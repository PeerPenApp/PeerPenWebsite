import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import db, { checkDatabase, initDatabase } from '@/lib/db';
import { nanoid } from 'nanoid';
import { ensureUserProfile } from '@/lib/profile-utils';

// Backup models organized by priority and capability
const BACKUP_MODELS = {
  // Primary Picks - High quality, reliable models
  primary: [
    'moonshotai/kimi-k2:free',
    'mistralai/mistral-small-3.2-24b-instruct:free',
    'z-ai/glm-4.5-air:free',
    'tngtech/deepseek-r1t2-chimera:free',
    'nvidia/llama-3.1-nemotron-ultra-253b-v1:free'
  ],
  
  // Flexible / Instruction Models - Good for structured analysis
  flexible: [
    'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
    'tencent/hunyuan-a13b-instruct:free',
    'qwen/qwen3-30b-a3b:free',
    'microsoft/mai-ds-r1:free',
    'arliai/qwq-32b-arliai-rpr-v1:free'
  ],
  
  // Long-Context / Essay-Friendly - Good for longer text analysis
  longContext: [
    'moonshotai/kimi-dev-72b:free',
    'google/gemma-3n-e4b-it:free',
    'google/gemma-3n-e2b-it:free',
    'deepseek/deepseek-r1-0528:free',
    'deepseek/deepseek-r1-0528-qwen3-8b:free'
  ],
  
  // Extra Backups - Additional fallback options
  extra: [
    'qwen/qwen3-coder:free',
    'mistralai/devstral-small-2505:free',
    'sarvamai/sarvam-m:free'
  ]
};

// Flatten all models into a single array for easy iteration
const ALL_MODELS = [
  ...BACKUP_MODELS.primary,
  ...BACKUP_MODELS.flexible,
  ...BACKUP_MODELS.longContext,
  ...BACKUP_MODELS.extra
];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Ensure database is initialized
    const isInitialized = await checkDatabase();
    if (!isInitialized) {
      console.log('Database not initialized, initializing now...');
      await initDatabase();
    }

    // Ensure user profile exists with correct Clerk data
    await ensureUserProfile(userId);

    // Check if user owns this essay
    const essayResult = await db.execute({
      sql: `SELECT * FROM essays WHERE id = ? AND author_id = ?`,
      args: [id, userId]
    });

    if (essayResult.rows.length === 0) {
      return NextResponse.json({ error: 'Essay not found' }, { status: 404 });
    }

    const essay = essayResult.rows[0];
    const content = String(essay.content || '').trim();
    
    if (!content) {
      return NextResponse.json({ error: 'Essay content is empty' }, { status: 400 });
    }

    const prompt = `Analyze the following college essay. Provide: 1) word count, 2) redundancy/repetition hotspots, 3) clarity & conciseness suggestions, 4) rubric scores (flow, hook, voice, uniqueness, conciseness, authenticity) 0-10 with 1-2 bullet justifications each. Essay:\n\n${content}`;

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
      return NextResponse.json({ 
        error: 'OpenRouter API key not configured. Please set OPENROUTER_API_KEY in your environment.' 
      }, { status: 500 });
    }

    // Try each model in order until one succeeds
    for (const model of ALL_MODELS) {
      try {
        console.log(`Attempting AI analysis with model: ${model}`);
        
        const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openRouterKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
            'X-Title': 'PeerPen'
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { 
                role: 'system', 
                content: 'You are an expert writing tutor specializing in college essay analysis. Provide clear, actionable feedback with specific examples from the text. Focus on constructive criticism that helps improve the essay.' 
              },
              { role: 'user', content: prompt }
            ],
            temperature: 0.2,
            max_tokens: 1000
          })
        });

        if (openRouterRes.ok) {
          const data = await openRouterRes.json();
          const analysis = data.choices?.[0]?.message?.content;
          
          if (analysis) {
            console.log(`✅ Successfully analyzed essay with model: ${model}`);
            
            // Save analysis to database
            const analysisId = nanoid();
            const feedbackId = nanoid();
            
            // Insert feedback record
            await db.execute({
              sql: `INSERT INTO feedback (id, essay_id, author_id, provider, model_name, general_comment) VALUES (?, ?, ?, ?, ?, ?)`,
              args: [feedbackId, id, null, 'ai', model, analysis]
            });

            // Extract rubric scores from analysis if possible
            // Try to parse scores from the AI response
            let rubricScores = {
              flow: 7,
              hook: 7,
              voice: 7,
              uniqueness: 7,
              conciseness: 7,
              authenticity: 7,
              overall: 7.0
            };

            // Try to extract scores from the AI response
            try {
              // Look for score patterns in the analysis text
              const scorePatterns = [
                { key: 'flow', patterns: [/flow.*?(\d+)/i, /flow.*?(\d+\.\d+)/i] },
                { key: 'hook', patterns: [/hook.*?(\d+)/i, /hook.*?(\d+\.\d+)/i] },
                { key: 'voice', patterns: [/voice.*?(\d+)/i, /voice.*?(\d+\.\d+)/i] },
                { key: 'uniqueness', patterns: [/uniqueness.*?(\d+)/i, /unique.*?(\d+)/i] },
                { key: 'conciseness', patterns: [/conciseness.*?(\d+)/i, /concise.*?(\d+)/i] },
                { key: 'authenticity', patterns: [/authenticity.*?(\d+)/i, /authentic.*?(\d+)/i] }
              ];

              scorePatterns.forEach(({ key, patterns }) => {
                for (const pattern of patterns) {
                  const match = analysis.match(pattern);
                  if (match && match[1]) {
                    const score = parseFloat(match[1]);
                    if (score >= 0 && score <= 10) {
                      rubricScores[key as keyof typeof rubricScores] = score;
                      break;
                    }
                  }
                }
              });

              // Calculate overall score as average of individual scores
              const individualScores = [rubricScores.flow, rubricScores.hook, rubricScores.voice, 
                                      rubricScores.uniqueness, rubricScores.conciseness, rubricScores.authenticity];
              rubricScores.overall = individualScores.reduce((sum, score) => sum + score, 0) / individualScores.length;
            } catch (error) {
              console.log('Could not extract scores from AI response, using defaults');
            }

            // Insert evaluation scores
            await db.execute({
              sql: `INSERT INTO evaluation_scores (feedback_id, flow, hook, voice, uniqueness, conciseness, authenticity, overall) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [feedbackId, rubricScores.flow, rubricScores.hook, rubricScores.voice, rubricScores.uniqueness, rubricScores.conciseness, rubricScores.authenticity, rubricScores.overall]
            });

            return NextResponse.json({ 
              analysis,
              model_used: model,
              success: true
            });
          }
        } else {
          const errorData = await openRouterRes.json().catch(() => ({}));
          console.warn(`Model ${model} failed with status ${openRouterRes.status}:`, errorData);
          
          // If it's a rate limit or quota issue, try the next model
          if (openRouterRes.status === 429 || openRouterRes.status === 402) {
            continue;
          }
          
          // If it's a model-specific error (like model not available), try the next model
          if (openRouterRes.status === 400) {
            continue;
          }
        }
      } catch (error) {
        console.warn(`Error with model ${model}:`, error);
        // Continue to next model
        continue;
      }
    }

    // If all models failed, return a comprehensive fallback analysis
    console.warn('All AI models failed, providing fallback analysis');
    
    const wordCount = content.split(/\s+/).length;
    const charCount = content.length;
    const sentences = content.split(/[.!?]+/).filter((s: string) => s.trim().length > 0).length;
    const paragraphs = content.split(/\n\s*\n/).filter((p: string) => p.trim().length > 0).length;
    
    // Basic readability metrics
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
• Your essay is ${wordCount > 650 ? 'over' : 'under'} the Common App limit of 650 words
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

    // Save fallback analysis to database
    const analysisId = nanoid();
    const feedbackId = nanoid();
    
    // Insert feedback record
    await db.execute({
      sql: `INSERT INTO feedback (id, essay_id, author_id, provider, model_name, general_comment) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [feedbackId, id, null, 'ai', 'fallback', fallbackAnalysis]
    });

    // Create fallback evaluation scores based on basic metrics
    const fallbackScores = {
      flow: Math.min(8, Math.max(5, Math.floor(wordCount / 100))), // Based on word count
      hook: 6, // Default middle score
      voice: 7, // Default middle score
      uniqueness: 6, // Default middle score
      conciseness: Math.min(9, Math.max(4, Math.floor(650 / wordCount * 5))), // Based on word count vs ideal
      authenticity: 7, // Default middle score
      overall: 6.5 // Average of all scores
    };

    // Insert fallback evaluation scores
    await db.execute({
      sql: `INSERT INTO evaluation_scores (feedback_id, flow, hook, voice, uniqueness, conciseness, authenticity, overall) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [feedbackId, fallbackScores.flow, fallbackScores.hook, fallbackScores.voice, fallbackScores.uniqueness, fallbackScores.conciseness, fallbackScores.authenticity, fallbackScores.overall]
    });

    return NextResponse.json({ 
      analysis: fallbackAnalysis,
      model_used: 'fallback',
      success: false,
      note: 'AI analysis failed, showing basic metrics instead'
    });

  } catch (error) {
    console.error('Error analyzing essay:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
