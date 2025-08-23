(()=>{var e={};e.id=2625,e.ids=[2625],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},5866:(e,E,s)=>{"use strict";s.a(e,async(e,t)=>{try{s.r(E),s.d(E,{DELETE:()=>N,GET:()=>l,POST:()=>n});var r=s(32190),T=s(88261),a=s(7462),i=s(14719),o=e([a,i]);async function n(e){try{let{userId:E}=await (0,T.j)();if(!E)return r.NextResponse.json({error:"Unauthorized"},{status:401});let{followeeId:s}=await e.json();if(!s)return r.NextResponse.json({error:"Followee ID is required"},{status:400});if(E===s)return r.NextResponse.json({error:"Cannot follow yourself"},{status:400});let t=await a.default.execute({sql:"SELECT id FROM profiles WHERE id = ?",args:[s]});if(0===t.rows.length)return r.NextResponse.json({error:"User not found"},{status:404});if(await (0,a.checkDatabase)()||(console.log("Database not initialized, initializing now..."),await (0,a.initDatabase)()),await (0,i.r)(E),await (0,i.r)(s),(await a.default.execute({sql:"SELECT follower_id FROM follows WHERE follower_id = ? AND followee_id = ?",args:[E,s]})).rows.length>0)return r.NextResponse.json({error:"Already following this user"},{status:400});return await a.default.execute({sql:"INSERT INTO follows (follower_id, followee_id) VALUES (?, ?)",args:[E,s]}),r.NextResponse.json({success:!0,message:"Successfully followed user"})}catch(e){return console.error("Follow error:",e),r.NextResponse.json({error:"Failed to follow user",details:e instanceof Error?e.message:"Unknown error"},{status:500})}}async function N(e){try{let{userId:E}=await (0,T.j)();if(!E)return r.NextResponse.json({error:"Unauthorized"},{status:401});let{searchParams:s}=new URL(e.url),t=s.get("followeeId");if(!t)return r.NextResponse.json({error:"Followee ID is required"},{status:400});if(E===t)return r.NextResponse.json({error:"Cannot unfollow yourself"},{status:400});await (0,a.checkDatabase)()||(console.log("Database not initialized, initializing now..."),await (0,a.initDatabase)());let i=await a.default.execute({sql:"DELETE FROM follows WHERE follower_id = ? AND followee_id = ?",args:[E,t]});if(0===i.rowsAffected)return r.NextResponse.json({error:"Not following this user"},{status:400});return r.NextResponse.json({success:!0,message:"Successfully unfollowed user"})}catch(e){return console.error("Unfollow error:",e),r.NextResponse.json({error:"Failed to unfollow user",details:e instanceof Error?e.message:"Unknown error"},{status:500})}}async function l(e){try{let{userId:E}=await (0,T.j)();if(!E)return r.NextResponse.json({error:"Unauthorized"},{status:401});let{searchParams:s}=new URL(e.url),t=s.get("followeeId");if(!t)return r.NextResponse.json({error:"Followee ID is required"},{status:400});await (0,a.checkDatabase)()||(console.log("Database not initialized, initializing now..."),await (0,a.initDatabase)());let i=(await a.default.execute({sql:"SELECT follower_id FROM follows WHERE follower_id = ? AND followee_id = ?",args:[E,t]})).rows.length>0;return r.NextResponse.json({isFollowing:i,followerId:E,followeeId:t})}catch(e){return console.error("Follow status error:",e),r.NextResponse.json({error:"Failed to check follow status",details:e instanceof Error?e.message:"Unknown error"},{status:500})}}[a,i]=o.then?(await o)():o,t()}catch(e){t(e)}})},7462:(e,E,s)=>{"use strict";s.a(e,async(e,t)=>{try{s.r(E),s.d(E,{checkDatabase:()=>o,default:()=>N,initDatabase:()=>a});var r=s(28855),T=e([r]);r=(T.then?(await T)():T)[0];let n=(0,r.createClient)({url:process.env.TURSO_DATABASE_URL,authToken:process.env.TURSO_AUTH_TOKEN});async function a(){try{for(let e of(console.log("Initializing database with full schema..."),["PRAGMA foreign_keys = ON;",`CREATE TABLE IF NOT EXISTS profiles (
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
      GROUP BY fb.essay_id;`]))try{await n.execute(e)}catch(e){if(e instanceof Error&&e.message.includes("already exists")){console.log("Table/view already exists, skipping...");continue}throw e}console.log("Database initialized successfully with full schema!"),await i()}catch(e){throw console.error("Error initializing database:",e),e}}async function i(){try{try{await n.execute("ALTER TABLE profiles ADD COLUMN email TEXT"),console.log("Migration: Added email column to profiles table")}catch(e){e.message?.includes("duplicate column name")||console.error("Migration error:",e)}}catch(e){console.error("Error running migrations:",e)}}async function o(){try{return(await n.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='essays'")).rows.length>0}catch(e){return console.error("Error checking database:",e),!1}}let N=n;t()}catch(e){t(e)}})},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},14719:(e,E,s)=>{"use strict";s.a(e,async(e,t)=>{try{s.d(E,{r:()=>i});var r=s(84412),T=s(7462),a=e([T]);async function i(e){let E=await T.default.execute({sql:"SELECT id, username, display_name, avatar_url FROM profiles WHERE id = ?",args:[e]});if(E.rows.length>0){let e=E.rows[0];return{id:e.id,username:e.username,displayName:e.display_name,imageUrl:e.avatar_url}}try{let E=await (0,r.$)(),s=await E.users.getUser(e),t=s.username||s.emailAddresses[0]?.emailAddress?.split("@")[0]||`user_${e.slice(0,8)}`,a=s.firstName&&s.lastName?`${s.firstName} ${s.lastName}`.trim():s.firstName||s.lastName||t,i=s.emailAddresses[0]?.emailAddress,o=s.imageUrl;return await T.default.execute({sql:"INSERT INTO profiles (id, username, display_name, avatar_url, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",args:[e,t,a,o||null]}),console.log("Created user profile for:",e,{username:t,displayName:a,email:i}),{id:e,username:t,displayName:a,email:i,imageUrl:o}}catch(t){console.error("Error fetching user from Clerk:",t);let E=`user_${e.slice(0,8)}`,s=`User ${e.slice(0,8)}`;return await T.default.execute({sql:"INSERT INTO profiles (id, username, display_name, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",args:[e,E,s]}),console.log("Created fallback user profile for:",e),{id:e,username:E,displayName:s}}}T=(a.then?(await a)():a)[0],t()}catch(e){t(e)}})},16698:e=>{"use strict";e.exports=require("node:async_hooks")},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},28855:e=>{"use strict";e.exports=import("@libsql/client")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},46075:(e,E,s)=>{"use strict";s.a(e,async(e,t)=>{try{s.r(E),s.d(E,{patchFetch:()=>n,routeModule:()=>N,serverHooks:()=>c,workAsyncStorage:()=>l,workUnitAsyncStorage:()=>d});var r=s(96559),T=s(48088),a=s(37719),i=s(5866),o=e([i]);i=(o.then?(await o)():o)[0];let N=new r.AppRouteRouteModule({definition:{kind:T.RouteKind.APP_ROUTE,page:"/api/follow/route",pathname:"/api/follow",filename:"route",bundlePath:"app/api/follow/route"},resolvedPagePath:"/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/app/api/follow/route.ts",nextConfigOutput:"",userland:i}),{workAsyncStorage:l,workUnitAsyncStorage:d,serverHooks:c}=N;function n(){return(0,a.patchFetch)({workAsyncStorage:l,workUnitAsyncStorage:d})}t()}catch(e){t(e)}})},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},73024:e=>{"use strict";e.exports=require("node:fs")},76760:e=>{"use strict";e.exports=require("node:path")},77598:e=>{"use strict";e.exports=require("node:crypto")},78335:()=>{},96487:()=>{}};var E=require("../../../webpack-runtime.js");E.C(e);var s=e=>E(E.s=e),t=E.X(0,[80,8261,846],()=>s(46075));module.exports=t})();