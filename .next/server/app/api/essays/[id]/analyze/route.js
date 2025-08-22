(()=>{var e={};e.id=8501,e.ids=[8501],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},7462:(e,s,t)=>{"use strict";t.a(e,async(e,a)=>{try{t.r(s),t.d(s,{checkDatabase:()=>T,default:()=>l,initDatabase:()=>r});var i=t(28855),E=e([i]);i=(E.then?(await E)():E)[0];let n=(0,i.createClient)({url:process.env.TURSO_DATABASE_URL,authToken:process.env.TURSO_AUTH_TOKEN});async function r(){try{for(let e of(console.log("Initializing database with full schema..."),["PRAGMA foreign_keys = ON;",`CREATE TABLE IF NOT EXISTS profiles (
        id                 TEXT PRIMARY KEY,
        username           TEXT UNIQUE,
        display_name       TEXT,
        email              TEXT,
        bio                TEXT,
        avatar_url         TEXT,
        is_verified        INTEGER NOT NULL DEFAULT 0,
        created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at         DATETIME
      );`,`CREATE TABLE IF NOT EXISTS follows (
        follower_id        TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        followee_id        TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (follower_id, followee_id)
      );`,`CREATE TABLE IF NOT EXISTS prompts (
        id                 TEXT PRIMARY KEY,
        source             TEXT NOT NULL,
        label              TEXT,
        text               TEXT NOT NULL
      );`,`CREATE TABLE IF NOT EXISTS tags (
        id                 TEXT PRIMARY KEY,
        name               TEXT NOT NULL UNIQUE
      );`,`CREATE TABLE IF NOT EXISTS essays (
        id                 TEXT PRIMARY KEY,
        author_id          TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        title              TEXT NOT NULL,
        content            TEXT NOT NULL,
        word_count         INTEGER,
        college            TEXT,
        prompt            TEXT,
        prompt_id          TEXT REFERENCES prompts(id) ON DELETE SET NULL,
        visibility         TEXT NOT NULL DEFAULT 'public',
        is_anonymous       INTEGER NOT NULL DEFAULT 0,
        status             TEXT NOT NULL DEFAULT 'draft',
        published_at       DATETIME,
        google_doc_id      TEXT,
        google_doc_url     TEXT,
        last_sync_at       DATETIME,
        is_deleted         INTEGER NOT NULL DEFAULT 0,
        created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at         DATETIME
      );`,"CREATE INDEX IF NOT EXISTS idx_essays_author ON essays(author_id);","CREATE INDEX IF NOT EXISTS idx_essays_status_pub ON essays(status, published_at);","CREATE INDEX IF NOT EXISTS idx_essays_visibility ON essays(visibility);","CREATE INDEX IF NOT EXISTS idx_essays_prompt ON essays(prompt_id);",`CREATE TABLE IF NOT EXISTS essay_tags (
        essay_id           TEXT NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
        tag_id             TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY (essay_id, tag_id)
      );`,`CREATE TABLE IF NOT EXISTS essay_versions (
        id                 TEXT PRIMARY KEY,
        essay_id           TEXT NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
        version_number     INTEGER NOT NULL,
        title              TEXT,
        content            TEXT NOT NULL,
        change_note        TEXT,
        created_by         TEXT REFERENCES profiles(id) ON DELETE SET NULL,
        created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (essay_id, version_number)
      );`,`CREATE TABLE IF NOT EXISTS feedback (
        id                 TEXT PRIMARY KEY,
        essay_id           TEXT NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
        author_id          TEXT REFERENCES profiles(id) ON DELETE SET NULL,
        provider           TEXT NOT NULL,
        model_name         TEXT,
        general_comment    TEXT,
        inline_annotations TEXT,
        suggestion_patch   TEXT,
        created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,`CREATE TABLE IF NOT EXISTS evaluation_scores (
        feedback_id        TEXT PRIMARY KEY REFERENCES feedback(id) ON DELETE CASCADE,
        flow               INTEGER CHECK (flow BETWEEN 0 AND 10),
        hook               INTEGER CHECK (hook BETWEEN 0 AND 10),
        voice              INTEGER CHECK (voice BETWEEN 0 AND 10),
        uniqueness         INTEGER CHECK (uniqueness BETWEEN 0 AND 10),
        conciseness        INTEGER CHECK (conciseness BETWEEN 0 AND 10),
        authenticity       INTEGER CHECK (authenticity BETWEEN 0 AND 10),
        overall            REAL
      );`,`CREATE TABLE IF NOT EXISTS comments (
        id                 TEXT PRIMARY KEY,
        essay_id           TEXT NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
        author_id          TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        parent_id          TEXT REFERENCES comments(id) ON DELETE CASCADE,
        body               TEXT NOT NULL,
        is_deleted         INTEGER NOT NULL DEFAULT 0,
        created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        edited_at          DATETIME
      );`,"CREATE INDEX IF NOT EXISTS idx_comments_essay ON comments(essay_id, created_at);",`CREATE TABLE IF NOT EXISTS ratings (
        id                 TEXT PRIMARY KEY,
        essay_id           TEXT NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
        rater_id           TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        score              INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
        created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (essay_id, rater_id)
      );`,`CREATE TABLE IF NOT EXISTS bookmarks (
        user_id            TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        essay_id           TEXT NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
        created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, essay_id)
      );`,`CREATE TABLE IF NOT EXISTS activities (
        id                 TEXT PRIMARY KEY,
        actor_id           TEXT REFERENCES profiles(id) ON DELETE SET NULL,
        verb               TEXT NOT NULL,
        object_type        TEXT NOT NULL,
        object_id          TEXT NOT NULL,
        target_user_id     TEXT REFERENCES profiles(id) ON DELETE CASCADE,
        created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,`CREATE TABLE IF NOT EXISTS notifications (
        id                 TEXT PRIMARY KEY,
        user_id            TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        type               TEXT NOT NULL,
        actor_id           TEXT REFERENCES profiles(id) ON DELETE SET NULL,
        entity_type        TEXT NOT NULL,
        entity_id          TEXT NOT NULL,
        read_at            DATETIME,
        created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,"CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at);",`CREATE TABLE IF NOT EXISTS reports (
        id                 TEXT PRIMARY KEY,
        reporter_id        TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        target_type        TEXT NOT NULL,
        target_id          TEXT NOT NULL,
        reason             TEXT NOT NULL,
        status             TEXT NOT NULL DEFAULT 'open',
        created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        resolved_at        DATETIME,
        resolver_id        TEXT REFERENCES profiles(id) ON DELETE SET NULL
      );`,`CREATE TABLE IF NOT EXISTS moderation_actions (
        id                 TEXT PRIMARY KEY,
        target_type        TEXT NOT NULL,
        target_id          TEXT NOT NULL,
        action_type        TEXT NOT NULL,
        reason             TEXT,
        actor_id           TEXT REFERENCES profiles(id) ON DELETE SET NULL,
        created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,`CREATE VIRTUAL TABLE IF NOT EXISTS essay_fts USING fts5(
        title,
        content,
        essay_id UNINDEXED,
        tokenize = "porter"
      );`,`CREATE TRIGGER IF NOT EXISTS essays_ai AFTER INSERT ON essays BEGIN
        INSERT INTO essay_fts(rowid, title, content, essay_id)
        VALUES (new.rowid, new.title, new.content, new.id);
      END;`,`CREATE TRIGGER IF NOT EXISTS essays_au AFTER UPDATE ON essays BEGIN
        INSERT INTO essay_fts(essay_fts, rowid, title, content, essay_id)
        VALUES('delete', old.rowid, old.title, old.content, old.id);
        INSERT INTO essay_fts(rowid, title, content, essay_id)
        VALUES (new.rowid, new.title, new.content, new.id);
      END;`,`CREATE TRIGGER IF NOT EXISTS essays_ad AFTER DELETE ON essays BEGIN
        INSERT INTO essay_fts(essay_fts, rowid, title, content, essay_id)
        VALUES('delete', old.rowid, old.title, old.content, old.id);
      END;`,`CREATE VIEW IF NOT EXISTS v_essay_rating AS
      SELECT
        e.id AS essay_id,
        COUNT(r.id) AS ratings_count,
        AVG(r.score) AS avg_score
      FROM essays e
      LEFT JOIN ratings r ON r.essay_id = e.id
      GROUP BY e.id;`,`CREATE VIEW IF NOT EXISTS v_rubric_avg AS
      SELECT
        fb.essay_id,
        AVG(es.flow) AS flow_avg,
        AVG(es.hook) AS hook_avg,
        AVG(es.voice) AS voice_avg,
        AVG(es.uniqueness) AS uniqueness_avg,
        AVG(es.conciseness) AS conciseness_avg,
        AVG(es.authenticity) AS authenticity_avg,
        AVG(es.overall) AS overall_avg
      FROM evaluation_scores es
      JOIN feedback fb ON fb.id = es.feedback_id
      GROUP BY fb.essay_id;`]))try{await n.execute(e)}catch(e){if(e instanceof Error&&e.message.includes("already exists")){console.log("Table/view already exists, skipping...");continue}throw e}console.log("Database initialized successfully with full schema!"),await o()}catch(e){throw console.error("Error initializing database:",e),e}}async function o(){try{try{await n.execute("ALTER TABLE profiles ADD COLUMN email TEXT"),console.log("Migration: Added email column to profiles table")}catch(e){e.message?.includes("duplicate column name")||console.error("Migration error:",e)}}catch(e){console.error("Error running migrations:",e)}}async function T(){try{return(await n.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='essays'")).rows.length>0}catch(e){return console.error("Error checking database:",e),!1}}let l=n;a()}catch(e){a(e)}})},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},14719:(e,s,t)=>{"use strict";t.a(e,async(e,a)=>{try{t.d(s,{r:()=>o});var i=t(84412),E=t(7462),r=e([E]);async function o(e){let s=await E.default.execute({sql:"SELECT id, username, display_name, avatar_url FROM profiles WHERE id = ?",args:[e]});if(s.rows.length>0){let e=s.rows[0];return{id:e.id,username:e.username,displayName:e.display_name,imageUrl:e.avatar_url}}try{let s=await (0,i.$)(),t=await s.users.getUser(e),a=t.username||t.emailAddresses[0]?.emailAddress?.split("@")[0]||`user_${e.slice(0,8)}`,r=t.firstName&&t.lastName?`${t.firstName} ${t.lastName}`.trim():t.firstName||t.lastName||a,o=t.emailAddresses[0]?.emailAddress,T=t.imageUrl;return await E.default.execute({sql:"INSERT INTO profiles (id, username, display_name, avatar_url, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",args:[e,a,r,T||null]}),console.log("Created user profile for:",e,{username:a,displayName:r,email:o}),{id:e,username:a,displayName:r,email:o,imageUrl:T}}catch(a){console.error("Error fetching user from Clerk:",a);let s=`user_${e.slice(0,8)}`,t=`User ${e.slice(0,8)}`;return await E.default.execute({sql:"INSERT INTO profiles (id, username, display_name, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",args:[e,s,t]}),console.log("Created fallback user profile for:",e),{id:e,username:s,displayName:t}}}E=(r.then?(await r)():r)[0],a()}catch(e){a(e)}})},15958:(e,s,t)=>{"use strict";t.a(e,async(e,a)=>{try{t.r(s),t.d(s,{POST:()=>l});var i=t(32190),E=t(88261),r=t(7462),o=t(59232),T=t(14719),n=e([r,T]);[r,T]=n.then?(await n)():n;let c={primary:["moonshotai/kimi-k2:free","mistralai/mistral-small-3.2-24b-instruct:free","z-ai/glm-4.5-air:free","tngtech/deepseek-r1t2-chimera:free","nvidia/llama-3.1-nemotron-ultra-253b-v1:free"],flexible:["cognitivecomputations/dolphin-mistral-24b-venice-edition:free","tencent/hunyuan-a13b-instruct:free","qwen/qwen3-30b-a3b:free","microsoft/mai-ds-r1:free","arliai/qwq-32b-arliai-rpr-v1:free"],longContext:["moonshotai/kimi-dev-72b:free","google/gemma-3n-e4b-it:free","google/gemma-3n-e2b-it:free","deepseek/deepseek-r1-0528:free","deepseek/deepseek-r1-0528-qwen3-8b:free"],extra:["qwen/qwen3-coder:free","mistralai/devstral-small-2505:free","sarvamai/sarvam-m:free"]},d=[...c.primary,...c.flexible,...c.longContext,...c.extra];async function l(e,{params:s}){try{let{userId:e}=await (0,E.j)();if(!e)return i.NextResponse.json({error:"Unauthorized"},{status:401});let{id:t}=await s;await (0,r.checkDatabase)()||(console.log("Database not initialized, initializing now..."),await (0,r.initDatabase)()),await (0,T.r)(e);let a=await r.default.execute({sql:"SELECT * FROM essays WHERE id = ? AND author_id = ?",args:[t,e]});if(0===a.rows.length)return i.NextResponse.json({error:"Essay not found"},{status:404});let n=a.rows[0],l=String(n.content||"").trim();if(!l)return i.NextResponse.json({error:"Essay content is empty"},{status:400});let c=`Analyze the following college essay. Provide: 1) word count, 2) redundancy/repetition hotspots, 3) clarity & conciseness suggestions, 4) rubric scores (flow, hook, voice, uniqueness, conciseness, authenticity) 0-10 with 1-2 bullet justifications each. Essay:

${l}`,N=process.env.OPENROUTER_API_KEY;if(!N)return i.NextResponse.json({error:"OpenRouter API key not configured. Please set OPENROUTER_API_KEY in your environment."},{status:500});for(let e of d)try{console.log(`Attempting AI analysis with model: ${e}`);let s=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${N}`,"Content-Type":"application/json","HTTP-Referer":process.env.SITE_URL||"http://localhost:3000","X-Title":"PeerPen"},body:JSON.stringify({model:e,messages:[{role:"system",content:"You are an expert writing tutor specializing in college essay analysis. Provide clear, actionable feedback with specific examples from the text. Focus on constructive criticism that helps improve the essay."},{role:"user",content:c}],temperature:.2,max_tokens:1e3})});if(s.ok){let a=await s.json(),E=a.choices?.[0]?.message?.content;if(E){console.log(`✅ Successfully analyzed essay with model: ${e}`),(0,o.Ak)();let s=(0,o.Ak)();await r.default.execute({sql:"INSERT INTO feedback (id, essay_id, author_id, provider, model_name, general_comment) VALUES (?, ?, ?, ?, ?, ?)",args:[s,t,null,"ai",e,E]});let a={flow:7,hook:7,voice:7,uniqueness:7,conciseness:7,authenticity:7,overall:7};try{[{key:"flow",patterns:[/flow.*?(\d+)/i,/flow.*?(\d+\.\d+)/i]},{key:"hook",patterns:[/hook.*?(\d+)/i,/hook.*?(\d+\.\d+)/i]},{key:"voice",patterns:[/voice.*?(\d+)/i,/voice.*?(\d+\.\d+)/i]},{key:"uniqueness",patterns:[/uniqueness.*?(\d+)/i,/unique.*?(\d+)/i]},{key:"conciseness",patterns:[/conciseness.*?(\d+)/i,/concise.*?(\d+)/i]},{key:"authenticity",patterns:[/authenticity.*?(\d+)/i,/authentic.*?(\d+)/i]}].forEach(({key:e,patterns:s})=>{for(let t of s){let s=E.match(t);if(s&&s[1]){let t=parseFloat(s[1]);if(t>=0&&t<=10){a[e]=t;break}}}});let e=[a.flow,a.hook,a.voice,a.uniqueness,a.conciseness,a.authenticity];a.overall=e.reduce((e,s)=>e+s,0)/e.length}catch(e){console.log("Could not extract scores from AI response, using defaults")}return await r.default.execute({sql:"INSERT INTO evaluation_scores (feedback_id, flow, hook, voice, uniqueness, conciseness, authenticity, overall) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",args:[s,a.flow,a.hook,a.voice,a.uniqueness,a.conciseness,a.authenticity,a.overall]}),i.NextResponse.json({analysis:E,model_used:e,success:!0})}}else{let t=await s.json().catch(()=>({}));if(console.warn(`Model ${e} failed with status ${s.status}:`,t),429===s.status||402===s.status||400===s.status)continue}}catch(s){console.warn(`Error with model ${e}:`,s);continue}console.warn("All AI models failed, providing fallback analysis");let u=l.split(/\s+/).length,A=l.length,L=l.split(/[.!?]+/).filter(e=>e.trim().length>0).length,R=l.split(/\n\s*\n/).filter(e=>e.trim().length>0).length,_=u>0?(A/u).toFixed(1):0,y=L>0?(u/L).toFixed(1):0,p=`📊 Basic Essay Analysis (AI models unavailable)

1) Word Count: ${u} words
2) Character Count: ${A} characters
3) Sentences: ${L}
4) Paragraphs: ${R}
5) Average Word Length: ${_} characters
6) Average Sentence Length: ${y} words

📝 Basic Writing Tips:
• Your essay is ${u>650?"over":"under"} the Common App limit of 650 words
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
• Is your writing clear and concise?`;(0,o.Ak)();let f=(0,o.Ak)();await r.default.execute({sql:"INSERT INTO feedback (id, essay_id, author_id, provider, model_name, general_comment) VALUES (?, ?, ?, ?, ?, ?)",args:[f,t,null,"ai","fallback",p]});let I={flow:Math.min(8,Math.max(5,Math.floor(u/100))),hook:6,voice:7,uniqueness:6,conciseness:Math.min(9,Math.max(4,Math.floor(650/u*5))),authenticity:7,overall:6.5};return await r.default.execute({sql:"INSERT INTO evaluation_scores (feedback_id, flow, hook, voice, uniqueness, conciseness, authenticity, overall) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",args:[f,I.flow,I.hook,I.voice,I.uniqueness,I.conciseness,I.authenticity,I.overall]}),i.NextResponse.json({analysis:p,model_used:"fallback",success:!1,note:"AI analysis failed, showing basic metrics instead"})}catch(e){return console.error("Error analyzing essay:",e),i.NextResponse.json({error:"Internal server error"},{status:500})}}a()}catch(e){a(e)}})},16698:e=>{"use strict";e.exports=require("node:async_hooks")},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},28855:e=>{"use strict";e.exports=import("@libsql/client")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},59232:(e,s,t)=>{"use strict";let a,i;t.d(s,{Ak:()=>o});var E=t(77598);function r(e){!a||a.length<e?(a=Buffer.allocUnsafe(128*e),E.webcrypto.getRandomValues(a),i=0):i+e>a.length&&(E.webcrypto.getRandomValues(a),i=0),i+=e}function o(e=21){r(e|=0);let s="";for(let t=i-e;t<i;t++)s+="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict"[63&a[t]];return s}},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},64659:(e,s,t)=>{"use strict";t.a(e,async(e,a)=>{try{t.r(s),t.d(s,{patchFetch:()=>n,routeModule:()=>l,serverHooks:()=>N,workAsyncStorage:()=>c,workUnitAsyncStorage:()=>d});var i=t(96559),E=t(48088),r=t(37719),o=t(15958),T=e([o]);o=(T.then?(await T)():T)[0];let l=new i.AppRouteRouteModule({definition:{kind:E.RouteKind.APP_ROUTE,page:"/api/essays/[id]/analyze/route",pathname:"/api/essays/[id]/analyze",filename:"route",bundlePath:"app/api/essays/[id]/analyze/route"},resolvedPagePath:"/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/app/api/essays/[id]/analyze/route.ts",nextConfigOutput:"",userland:o}),{workAsyncStorage:c,workUnitAsyncStorage:d,serverHooks:N}=l;function n(){return(0,r.patchFetch)({workAsyncStorage:c,workUnitAsyncStorage:d})}a()}catch(e){a(e)}})},73024:e=>{"use strict";e.exports=require("node:fs")},76760:e=>{"use strict";e.exports=require("node:path")},77598:e=>{"use strict";e.exports=require("node:crypto")},78335:()=>{},96487:()=>{}};var s=require("../../../../../webpack-runtime.js");s.C(e);var t=e=>s(s.s=e),a=s.X(0,[80,8261,846],()=>t(64659));module.exports=a})();