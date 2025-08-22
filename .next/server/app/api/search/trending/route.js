(()=>{var e={};e.id=1754,e.ids=[1754],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},7462:(e,E,s)=>{"use strict";s.a(e,async(e,t)=>{try{s.r(E),s.d(E,{checkDatabase:()=>o,default:()=>N,initDatabase:()=>T});var i=s(28855),a=e([i]);i=(a.then?(await a)():a)[0];let n=(0,i.createClient)({url:process.env.TURSO_DATABASE_URL,authToken:process.env.TURSO_AUTH_TOKEN});async function T(){try{for(let e of(console.log("Initializing database with full schema..."),["PRAGMA foreign_keys = ON;",`CREATE TABLE IF NOT EXISTS profiles (
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
      GROUP BY fb.essay_id;`]))try{await n.execute(e)}catch(e){if(e instanceof Error&&e.message.includes("already exists")){console.log("Table/view already exists, skipping...");continue}throw e}console.log("Database initialized successfully with full schema!"),await r()}catch(e){throw console.error("Error initializing database:",e),e}}async function r(){try{try{await n.execute("ALTER TABLE profiles ADD COLUMN email TEXT"),console.log("Migration: Added email column to profiles table")}catch(e){e.message?.includes("duplicate column name")||console.error("Migration error:",e)}}catch(e){console.error("Error running migrations:",e)}}async function o(){try{return(await n.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='essays'")).rows.length>0}catch(e){return console.error("Error checking database:",e),!1}}let N=n;t()}catch(e){t(e)}})},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},24615:(e,E,s)=>{"use strict";s.a(e,async(e,t)=>{try{s.r(E),s.d(E,{GET:()=>r});var i=s(32190),a=s(7462),T=e([a]);async function r(e){let{searchParams:E}=new URL(e.url),s=E.get("type")||"all";try{await (0,a.checkDatabase)()||(console.log("Database not initialized, initializing now..."),await (0,a.initDatabase)());let e={};if("colleges"===s||"all"===s){let E=`
        SELECT 
          e.college,
          COUNT(e.id) as essay_count,
          AVG(r.score) as avg_rating
        FROM essays e
        LEFT JOIN ratings r ON e.id = r.essay_id
        WHERE e.college IS NOT NULL 
          AND e.college != '' 
          AND e.status = 'published' 
          AND e.visibility = 'public'
          AND e.is_deleted = 0
        GROUP BY e.college
        HAVING essay_count >= 1
        ORDER BY essay_count DESC, avg_rating DESC
        LIMIT 10
      `;e.colleges=(await a.default.execute({sql:E,args:[]})).rows.map(e=>({college:e.college,essayCount:Number(e.essay_count),avgRating:e.avg_rating?Number(e.avg_rating):0}))}if("topics"===s||"all"===s){let E=`
        SELECT 
          e.prompt as full_prompt,
          COUNT(e.id) as essay_count,
          AVG(r.score) as avg_rating
        FROM essays e
        LEFT JOIN ratings r ON e.id = r.essay_id
        WHERE e.prompt IS NOT NULL 
          AND e.prompt != '' 
          AND e.status = 'published' 
          AND e.visibility = 'public'
          AND e.is_deleted = 0
        GROUP BY e.prompt
        HAVING essay_count >= 1
        ORDER BY essay_count DESC, avg_rating DESC
        LIMIT 20
      `,s=await a.default.execute({sql:E,args:[]}),t=new Map;s.rows.forEach(e=>{let E=e.full_prompt,s=Number(e.essay_count),i=e.avg_rating?Number(e.avg_rating):0;(function(e){let E=[],s=e.toLowerCase();for(let[e,t]of Object.entries({"Personal Statement":["personal statement","common app","college application","why this school"],Leadership:["leadership","leader","team captain","president","vice president","officer"],"Community Service":["community service","volunteer","helping others","giving back","charity"],"Academic Achievement":["academic","scholarship","honors","gpa","grades","achievement"],Extracurricular:["extracurricular","club","activity","sport","hobby","passion"],"Failure & Growth":["failure","mistake","challenge","overcome","learn","growth"],"Cultural Identity":["culture","heritage","identity","background","diversity","immigrant"],Innovation:["innovation","invention","creative","entrepreneur","startup","project"],"Social Impact":["social impact","change","activism","advocacy","justice","equality"],Family:["family","parent","sibling","home","tradition","values"],Travel:["travel","abroad","international","culture","experience","adventure"],"Music & Arts":["music","art","creative","performance","artist","musician"],"Science & Technology":["science","technology","research","lab","experiment","discovery"],Sports:["sport","athlete","team","competition","training","coach"],Writing:["writing","author","story","narrative","poetry","journalism"]}))t.some(e=>s.includes(e))&&E.push(e);if(s.includes("why this major")&&E.push("Major Choice"),s.includes("why this school")&&E.push("School Choice"),(s.includes("challenge")||s.includes("obstacle"))&&E.push("Overcoming Challenges"),(s.includes("passion")||s.includes("interest"))&&E.push("Personal Passion"),(s.includes("future")||s.includes("career"))&&E.push("Future Goals"),(s.includes("influence")||s.includes("inspire"))&&E.push("Influence & Inspiration"),(s.includes("change")||s.includes("impact"))&&E.push("Making a Difference"),(s.includes("learning")||s.includes("education"))&&E.push("Learning & Education"),0===E.length){let s=e.match(/(?:what|how|why|when|where|tell|describe|explain)\s+(?:is|are|was|were|do|does|did|can|could|would|should)\s+(.+?)(?:\?|\.|$)/i);if(s){let e=s[1].trim();e.length<50&&E.push(e.charAt(0).toUpperCase()+e.slice(1))}}if(0===E.length){let s=e.split(/\s+/).slice(0,3).join(" ");s.length<30&&E.push(s.charAt(0).toUpperCase()+s.slice(1))}return 0===E.length&&E.push("General Essay"),E})(E).forEach(e=>{if(t.has(e)){let E=t.get(e);E.count+=s,E.rating=(E.rating+i)/2}else t.set(e,{count:s,rating:i})})}),e.topics=Array.from(t.entries()).map(([e,E])=>({tag:e,essayCount:E.count,avgRating:E.rating})).sort((e,E)=>E.essayCount-e.essayCount).slice(0,10)}if("writers"===s||"all"===s){let E=`
        SELECT 
          p.id,
          p.username,
          p.display_name,
          COUNT(DISTINCT e.id) as essays_count,
          COALESCE(COUNT(DISTINCT f.follower_id), 0) as followers_count,
          AVG(r.score) as avg_rating,
          COUNT(CASE WHEN e.created_at >= datetime('now', '-30 days') THEN 1 END) as recent_essays
        FROM profiles p
        LEFT JOIN essays e ON p.id = e.author_id AND e.is_deleted = 0
        LEFT JOIN follows f ON p.id = f.followee_id
        LEFT JOIN ratings r ON e.id = r.essay_id
        WHERE e.status = 'published' AND e.visibility = 'public'
        GROUP BY p.id
        HAVING essays_count >= 1
        ORDER BY recent_essays DESC, avg_rating DESC, followers_count DESC
        LIMIT 10
      `;e.writers=(await a.default.execute({sql:E,args:[]})).rows.map(e=>({id:e.id,username:e.username,displayName:e.display_name,essaysCount:Number(e.essays_count),followersCount:Number(e.followers_count),avgRating:e.avg_rating?Number(e.avg_rating):0,recentEssays:Number(e.recent_essays)}))}return i.NextResponse.json(e)}catch(e){return console.error("Trending data error:",e),i.NextResponse.json({error:"Failed to fetch trending data"},{status:500})}}a=(T.then?(await T)():T)[0],t()}catch(e){t(e)}})},28855:e=>{"use strict";e.exports=import("@libsql/client")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},48191:(e,E,s)=>{"use strict";s.a(e,async(e,t)=>{try{s.r(E),s.d(E,{patchFetch:()=>n,routeModule:()=>N,serverHooks:()=>d,workAsyncStorage:()=>c,workUnitAsyncStorage:()=>l});var i=s(96559),a=s(48088),T=s(37719),r=s(24615),o=e([r]);r=(o.then?(await o)():o)[0];let N=new i.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/search/trending/route",pathname:"/api/search/trending",filename:"route",bundlePath:"app/api/search/trending/route"},resolvedPagePath:"/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/app/api/search/trending/route.ts",nextConfigOutput:"",userland:r}),{workAsyncStorage:c,workUnitAsyncStorage:l,serverHooks:d}=N;function n(){return(0,T.patchFetch)({workAsyncStorage:c,workUnitAsyncStorage:l})}t()}catch(e){t(e)}})},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},96487:()=>{},96559:(e,E,s)=>{"use strict";e.exports=s(44870)}};var E=require("../../../../webpack-runtime.js");E.C(e);var s=e=>E(E.s=e),t=E.X(0,[80],()=>s(48191));module.exports=t})();