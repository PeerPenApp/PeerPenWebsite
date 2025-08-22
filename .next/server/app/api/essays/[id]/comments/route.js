(()=>{var e={};e.id=9693,e.ids=[9693],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},7462:(e,E,t)=>{"use strict";t.a(e,async(e,s)=>{try{t.r(E),t.d(E,{checkDatabase:()=>o,default:()=>N,initDatabase:()=>i});var a=t(28855),T=e([a]);a=(T.then?(await T)():T)[0];let n=(0,a.createClient)({url:process.env.TURSO_DATABASE_URL,authToken:process.env.TURSO_AUTH_TOKEN});async function i(){try{for(let e of(console.log("Initializing database with full schema..."),["PRAGMA foreign_keys = ON;",`CREATE TABLE IF NOT EXISTS profiles (
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
      GROUP BY fb.essay_id;`]))try{await n.execute(e)}catch(e){if(e instanceof Error&&e.message.includes("already exists")){console.log("Table/view already exists, skipping...");continue}throw e}console.log("Database initialized successfully with full schema!"),await r()}catch(e){throw console.error("Error initializing database:",e),e}}async function r(){try{try{await n.execute("ALTER TABLE profiles ADD COLUMN email TEXT"),console.log("Migration: Added email column to profiles table")}catch(e){e.message?.includes("duplicate column name")||console.error("Migration error:",e)}}catch(e){console.error("Error running migrations:",e)}}async function o(){try{return(await n.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='essays'")).rows.length>0}catch(e){return console.error("Error checking database:",e),!1}}let N=n;s()}catch(e){s(e)}})},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},12110:(e,E,t)=>{"use strict";t.a(e,async(e,s)=>{try{t.r(E),t.d(E,{GET:()=>d,POST:()=>N});var a=t(32190),T=t(88261),i=t(7462),r=t(59232),o=t(14719),n=e([i,o]);async function N(e,{params:E}){try{let{userId:t}=await (0,T.j)();if(!t)return a.NextResponse.json({error:"Unauthorized"},{status:401});let{id:s}=await E;await (0,i.checkDatabase)()||(console.log("Database not initialized, initializing now..."),await (0,i.initDatabase)()),await (0,o.r)(t);let{content:n,parentId:N}=await e.json();if(!n||!n.trim())return a.NextResponse.json({error:"Comment content is required"},{status:400});let d=await i.default.execute({sql:"SELECT id, visibility FROM essays WHERE id = ?",args:[s]});if(0===d.rows.length)return a.NextResponse.json({error:"Essay not found"},{status:404});let l=d.rows[0];if("public"!==l.visibility)return a.NextResponse.json({error:"Cannot comment on private essays"},{status:403});if(N){let e=await i.default.execute({sql:"SELECT id FROM comments WHERE id = ? AND essay_id = ?",args:[N,s]});if(0===e.rows.length)return a.NextResponse.json({error:"Parent comment not found"},{status:404})}let c=(0,r.Ak)();return await i.default.execute({sql:"INSERT INTO comments (id, essay_id, author_id, body, parent_id) VALUES (?, ?, ?, ?, ?)",args:[c,s,t,n.trim(),N||null]}),a.NextResponse.json({success:!0,comment:{id:c,content:n.trim(),parentId:N}})}catch(e){return console.error("Error creating comment:",e),a.NextResponse.json({error:"Internal server error"},{status:500})}}async function d(e,{params:E}){try{let{userId:e}=await (0,T.j)();if(!e)return a.NextResponse.json({error:"Unauthorized"},{status:401});let{id:t}=await E;await (0,i.checkDatabase)()||(console.log("Database not initialized, initializing now..."),await (0,i.initDatabase)());let s=await i.default.execute({sql:"SELECT id, visibility FROM essays WHERE id = ?",args:[t]});if(0===s.rows.length)return a.NextResponse.json({error:"Essay not found"},{status:404});let r=s.rows[0];if("public"!==r.visibility)return a.NextResponse.json({error:"Cannot view comments on private essays"},{status:403});let o=(await i.default.execute({sql:`
        SELECT 
          c.id, c.body, c.parent_id, c.created_at, c.edited_at,
          p.display_name, p.username
        FROM comments c
        LEFT JOIN profiles p ON c.author_id = p.id
        WHERE c.essay_id = ? AND c.is_deleted = 0
        ORDER BY c.created_at ASC
      `,args:[t]})).rows.map(e=>({id:e.id,content:e.body,parentId:e.parent_id,createdAt:e.created_at,updatedAt:e.edited_at,author:e.display_name||e.username||"Anonymous"}));return a.NextResponse.json({comments:o})}catch(e){return console.error("Error fetching comments:",e),a.NextResponse.json({error:"Internal server error"},{status:500})}}[i,o]=n.then?(await n)():n,s()}catch(e){s(e)}})},13211:(e,E,t)=>{"use strict";t.a(e,async(e,s)=>{try{t.r(E),t.d(E,{patchFetch:()=>n,routeModule:()=>N,serverHooks:()=>c,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>l});var a=t(96559),T=t(48088),i=t(37719),r=t(12110),o=e([r]);r=(o.then?(await o)():o)[0];let N=new a.AppRouteRouteModule({definition:{kind:T.RouteKind.APP_ROUTE,page:"/api/essays/[id]/comments/route",pathname:"/api/essays/[id]/comments",filename:"route",bundlePath:"app/api/essays/[id]/comments/route"},resolvedPagePath:"/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/app/api/essays/[id]/comments/route.ts",nextConfigOutput:"",userland:r}),{workAsyncStorage:d,workUnitAsyncStorage:l,serverHooks:c}=N;function n(){return(0,i.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:l})}s()}catch(e){s(e)}})},14719:(e,E,t)=>{"use strict";t.a(e,async(e,s)=>{try{t.d(E,{r:()=>r});var a=t(84412),T=t(7462),i=e([T]);async function r(e){let E=await T.default.execute({sql:"SELECT id, username, display_name, avatar_url FROM profiles WHERE id = ?",args:[e]});if(E.rows.length>0){let e=E.rows[0];return{id:e.id,username:e.username,displayName:e.display_name,imageUrl:e.avatar_url}}try{let E=await (0,a.$)(),t=await E.users.getUser(e),s=t.username||t.emailAddresses[0]?.emailAddress?.split("@")[0]||`user_${e.slice(0,8)}`,i=t.firstName&&t.lastName?`${t.firstName} ${t.lastName}`.trim():t.firstName||t.lastName||s,r=t.emailAddresses[0]?.emailAddress,o=t.imageUrl;return await T.default.execute({sql:"INSERT INTO profiles (id, username, display_name, avatar_url, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",args:[e,s,i,o||null]}),console.log("Created user profile for:",e,{username:s,displayName:i,email:r}),{id:e,username:s,displayName:i,email:r,imageUrl:o}}catch(s){console.error("Error fetching user from Clerk:",s);let E=`user_${e.slice(0,8)}`,t=`User ${e.slice(0,8)}`;return await T.default.execute({sql:"INSERT INTO profiles (id, username, display_name, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",args:[e,E,t]}),console.log("Created fallback user profile for:",e),{id:e,username:E,displayName:t}}}T=(i.then?(await i)():i)[0],s()}catch(e){s(e)}})},16698:e=>{"use strict";e.exports=require("node:async_hooks")},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},28855:e=>{"use strict";e.exports=import("@libsql/client")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},59232:(e,E,t)=>{"use strict";let s,a;t.d(E,{Ak:()=>r});var T=t(77598);function i(e){!s||s.length<e?(s=Buffer.allocUnsafe(128*e),T.webcrypto.getRandomValues(s),a=0):a+e>s.length&&(T.webcrypto.getRandomValues(s),a=0),a+=e}function r(e=21){i(e|=0);let E="";for(let t=a-e;t<a;t++)E+="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict"[63&s[t]];return E}},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},73024:e=>{"use strict";e.exports=require("node:fs")},76760:e=>{"use strict";e.exports=require("node:path")},77598:e=>{"use strict";e.exports=require("node:crypto")},78335:()=>{},96487:()=>{}};var E=require("../../../../../webpack-runtime.js");E.C(e);var t=e=>E(E.s=e),s=E.X(0,[80,8261,846],()=>t(13211));module.exports=s})();