import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { g as getSessionUser, r as requireUser } from "../../../chunks/auth_e0h_D5ri.mjs";
import { renderers } from "../../../renderers.mjs";
let limiter = null;
function getLimiter(tokensPerMinute = 30) {
  if (limiter) return limiter;
  const url = "https://...";
  const token = "...";
  {
    const redis = new Redis({ url, token });
    limiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(tokensPerMinute, "1 m") });
  }
  return limiter;
}
async function limit(identifier, tokensPerMinute = 30) {
  const l = getLimiter(tokensPerMinute);
  if (!l) return { success: true };
  return await l.limit(identifier);
}
const BACKUP_MODELS = {
  // Primary Picks - High quality, reliable models
  primary: [
    "openai/gpt-oss-20b",
    "z-ai/glm-4.5-air",
    "moonshot-ai/kimi-k2",
    "tng/deepseek-r1t2-chimera",
    "mistral/mistral-small-3.2-24b"
  ],
  // Flexible / Instruction Models - Good for structured analysis
  flexible: [
    "venice/uncensored-mistral-24b-venice-edition",
    "tencent/hunyuan-a13b-instruct",
    "qwen/qwen3-coder",
    "anthropic/claude-3.5-sonnet",
    "anthropic/claude-3.5-haiku"
  ],
  // Long-Context / Essay-Friendly - Good for longer text analysis
  longContext: [
    "google/gemma-3n-2b",
    "google/gemini-1.5-flash",
    "deepseek/deepseek-v3",
    "mistral/mixtral-8x22b",
    "moonshot-ai/kimi-k1.5"
  ],
  // Extra Backups - Additional fallback options
  extra: [
    "01-ai/yi-1.5-34b",
    "meta-llama/llama-3-70b-instruct",
    "cohere/command-r-plus",
    "mosaicml/mpt-30b-instruct",
    "qwen/qwen3-72b-instruct"
  ]
};
const ALL_MODELS = [
  ...BACKUP_MODELS.primary,
  ...BACKUP_MODELS.flexible,
  ...BACKUP_MODELS.longContext,
  ...BACKUP_MODELS.extra
];
async function POST(ctx) {
  const user = await getSessionUser();
  requireUser(user);
  const ip = ctx.clientAddress || "unknown";
  const rl = await limit(`ai:${user?.id}:${ip}`, 10);
  if (!rl.success) return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429 });
  const body = await ctx.request.json();
  const content = (body?.content || "").trim();
  if (!content) return new Response(JSON.stringify({ error: "content required" }), { status: 400 });
  const prompt = `Analyze the following college essay. Provide: 1) word count, 2) redundancy/repetition hotspots, 3) clarity & conciseness suggestions, 4) rubric scores (flow, hook, voice, uniqueness, conciseness, authenticity) 0-10 with 1-2 bullet justifications each. Essay:

${content}`;
  const openRouterKey = "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";
  for (const model of ALL_MODELS) {
    try {
      console.log(`Attempting AI analysis with model: ${model}`);
      const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openRouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:4321",
          "X-Title": "PeerPen"
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content: "You are an expert writing tutor specializing in college essay analysis. Provide clear, actionable feedback with specific examples from the text. Focus on constructive criticism that helps improve the essay."
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.2,
          max_tokens: 1e3
        })
      });
      if (openRouterRes.ok) {
        const data = await openRouterRes.json();
        const analysis = data.choices?.[0]?.message?.content;
        if (analysis) {
          console.log(`✅ Successfully analyzed essay with model: ${model}`);
          return new Response(JSON.stringify({
            analysis,
            model_used: model,
            success: true
          }));
        }
      } else {
        const errorData = await openRouterRes.json().catch(() => ({}));
        console.warn(`Model ${model} failed with status ${openRouterRes.status}:`, errorData);
        if (openRouterRes.status === 429 || openRouterRes.status === 402) {
          continue;
        }
        if (openRouterRes.status === 400) {
          continue;
        }
      }
    } catch (error) {
      console.warn(`Error with model ${model}:`, error);
      continue;
    }
  }
  console.warn("All AI models failed, providing fallback analysis");
  const wordCount = content.split(/\s+/).length;
  const charCount = content.length;
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const paragraphs = content.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
  const avgWordLength = wordCount > 0 ? (charCount / wordCount).toFixed(1) : 0;
  const avgSentenceLength = sentences > 0 ? (wordCount / sentences).toFixed(1) : 0;
  const fallbackAnalysis = `📊 Basic Essay Analysis (AI models unavailable)

1) Word Count: ${wordCount} words
2) Character Count: ${charCount} characters
3) Sentences: ${sentences}
4) Paragraphs: ${paragraphs}
5) Average Word Length: ${avgWordLength} characters
6) Average Sentence Length: ${avgSentenceLength} words

📝 Basic Writing Tips:
• Your essay is ${wordCount > 650 ? "over" : "under"} the Common App limit of 650 words
• Consider breaking up sentences longer than 20 words for better readability
• Ensure each paragraph has a clear topic sentence and supporting details

🔧 To get AI-powered analysis:
• Check that your OpenRouter API key is valid
• Ensure you have sufficient credits in your OpenRouter account
• Try again in a few minutes if the service is temporarily unavailable

💡 Manual Review Checklist:
• Does your opening hook grab the reader's attention?
• Is your story authentic and personal?
• Do you show rather than tell with specific examples?
• Does your conclusion connect back to your opening?
• Is your writing clear and concise?`;
  return new Response(JSON.stringify({
    analysis: fallbackAnalysis,
    model_used: "fallback",
    success: false,
    note: "AI analysis failed, showing basic metrics instead"
  }));
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
