(()=>{var e={};e.id=7073,e.ids=[7073],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},7462:(e,E,s)=>{"use strict";s.a(e,async(e,t)=>{try{s.r(E),s.d(E,{checkDatabase:()=>o,default:()=>N,initDatabase:()=>i});var a=s(28855),T=e([a]);a=(T.then?(await T)():T)[0];let n=(0,a.createClient)({url:process.env.TURSO_DATABASE_URL,authToken:process.env.TURSO_AUTH_TOKEN});async function i(){try{for(let e of(console.log("Initializing database with full schema..."),["PRAGMA foreign_keys = ON;",`CREATE TABLE IF NOT EXISTS profiles (
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
      GROUP BY fb.essay_id;`]))try{await n.execute(e)}catch(e){if(e instanceof Error&&e.message.includes("already exists")){console.log("Table/view already exists, skipping...");continue}throw e}console.log("Database initialized successfully with full schema!"),await r()}catch(e){throw console.error("Error initializing database:",e),e}}async function r(){try{try{await n.execute("ALTER TABLE profiles ADD COLUMN email TEXT"),console.log("Migration: Added email column to profiles table")}catch(e){e.message?.includes("duplicate column name")||console.error("Migration error:",e)}}catch(e){console.error("Error running migrations:",e)}}async function o(){try{return(await n.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='essays'")).rows.length>0}catch(e){return console.error("Error checking database:",e),!1}}let N=n;t()}catch(e){t(e)}})},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},12722:(e,E,s)=>{"use strict";s.a(e,async(e,t)=>{try{s.r(E),s.d(E,{GET:()=>n,PUT:()=>N});var a=s(32190),T=s(88261),i=s(7462),r=s(14719),o=e([i,r]);async function n(e){try{let{userId:e}=await (0,T.j)();if(!e)return a.NextResponse.json({error:"Unauthorized"},{status:401});await (0,i.checkDatabase)()||(console.log("Database not initialized, initializing now..."),await (0,i.initDatabase)());let E=await (0,r.r)(e),s=(await i.default.execute({sql:`
        SELECT 
          COUNT(DISTINCT e.id) as essays_count,
          COALESCE(COUNT(DISTINCT f.follower_id), 0) as followers_count,
          COALESCE(COUNT(DISTINCT f2.followee_id), 0) as following_count,
          COALESCE(AVG(r.score), 0) as avg_rating
        FROM profiles p
        LEFT JOIN essays e ON p.id = e.author_id AND e.is_deleted = 0
        LEFT JOIN follows f ON p.id = f.followee_id
        LEFT JOIN follows f2 ON p.id = f2.follower_id
        LEFT JOIN ratings r ON e.id = r.essay_id
        WHERE p.id = ?
      `,args:[e]})).rows[0];return a.NextResponse.json({profile:{id:E.id,username:E.username,displayName:E.displayName,bio:E.bio,avatarUrl:E.imageUrl,email:E.email,createdAt:E.createdAt||new Date().toISOString(),isVerified:E.isVerified||!1},stats:{essaysCount:Number(s.essays_count),totalViews:0,avgRating:Number(s.avg_rating),followersCount:Number(s.followers_count),followingCount:Number(s.following_count)}})}catch(e){return console.error("Profile fetch error:",e),a.NextResponse.json({error:"Failed to fetch profile",details:e instanceof Error?e.message:"Unknown error"},{status:500})}}async function N(e){try{let{userId:E}=await (0,T.j)();if(!E)return a.NextResponse.json({error:"Unauthorized"},{status:401});await (0,i.checkDatabase)()||(console.log("Database not initialized, initializing now..."),await (0,i.initDatabase)());let{displayName:s,username:t,bio:r,email:o}=await e.json();if(s&&s.length>100)return a.NextResponse.json({error:"Display name too long"},{status:400});if(t&&t.length>50)return a.NextResponse.json({error:"Username too long"},{status:400});if(r&&r.length>500)return a.NextResponse.json({error:"Bio too long"},{status:400});if(t&&(await i.default.execute({sql:"SELECT id FROM profiles WHERE username = ? AND id != ?",args:[t,E]})).rows.length>0)return a.NextResponse.json({error:"Username already taken"},{status:400});let n=[],N=[];void 0!==s&&(n.push("display_name = ?"),N.push(s)),void 0!==t&&(n.push("username = ?"),N.push(t)),void 0!==r&&(n.push("bio = ?"),N.push(r)),void 0!==o&&(n.push("email = ?"),N.push(o)),n.length>0&&(n.push("updated_at = CURRENT_TIMESTAMP"),N.push(E),await i.default.execute({sql:`UPDATE profiles SET ${n.join(", ")} WHERE id = ?`,args:N}));let d=await i.default.execute({sql:"SELECT id, username, display_name, bio, avatar_url, created_at, is_verified FROM profiles WHERE id = ?",args:[E]});if(0===d.rows.length)return a.NextResponse.json({error:"Profile not found"},{status:404});let l=d.rows[0];return a.NextResponse.json({profile:{id:l.id,username:l.username,displayName:l.display_name,bio:l.bio,avatarUrl:l.avatar_url,email:l.email,createdAt:l.created_at,isVerified:!!l.is_verified}})}catch(e){return console.error("Profile update error:",e),a.NextResponse.json({error:"Failed to update profile",details:e instanceof Error?e.message:"Unknown error"},{status:500})}}[i,r]=o.then?(await o)():o,t()}catch(e){t(e)}})},14719:(e,E,s)=>{"use strict";s.a(e,async(e,t)=>{try{s.d(E,{r:()=>r});var a=s(84412),T=s(7462),i=e([T]);async function r(e){let E=await T.default.execute({sql:"SELECT id, username, display_name, avatar_url FROM profiles WHERE id = ?",args:[e]});if(E.rows.length>0){let e=E.rows[0];return{id:e.id,username:e.username,displayName:e.display_name,imageUrl:e.avatar_url}}try{let E=await (0,a.$)(),s=await E.users.getUser(e),t=s.username||s.emailAddresses[0]?.emailAddress?.split("@")[0]||`user_${e.slice(0,8)}`,i=s.firstName&&s.lastName?`${s.firstName} ${s.lastName}`.trim():s.firstName||s.lastName||t,r=s.emailAddresses[0]?.emailAddress,o=s.imageUrl;return await T.default.execute({sql:"INSERT INTO profiles (id, username, display_name, avatar_url, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",args:[e,t,i,o||null]}),console.log("Created user profile for:",e,{username:t,displayName:i,email:r}),{id:e,username:t,displayName:i,email:r,imageUrl:o}}catch(t){console.error("Error fetching user from Clerk:",t);let E=`user_${e.slice(0,8)}`,s=`User ${e.slice(0,8)}`;return await T.default.execute({sql:"INSERT INTO profiles (id, username, display_name, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",args:[e,E,s]}),console.log("Created fallback user profile for:",e),{id:e,username:E,displayName:s}}}T=(i.then?(await i)():i)[0],t()}catch(e){t(e)}})},16698:e=>{"use strict";e.exports=require("node:async_hooks")},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},28855:e=>{"use strict";e.exports=import("@libsql/client")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55639:(e,E,s)=>{"use strict";s.a(e,async(e,t)=>{try{s.r(E),s.d(E,{patchFetch:()=>n,routeModule:()=>N,serverHooks:()=>c,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>l});var a=s(96559),T=s(48088),i=s(37719),r=s(12722),o=e([r]);r=(o.then?(await o)():o)[0];let N=new a.AppRouteRouteModule({definition:{kind:T.RouteKind.APP_ROUTE,page:"/api/profile/route",pathname:"/api/profile",filename:"route",bundlePath:"app/api/profile/route"},resolvedPagePath:"/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/app/api/profile/route.ts",nextConfigOutput:"",userland:r}),{workAsyncStorage:d,workUnitAsyncStorage:l,serverHooks:c}=N;function n(){return(0,i.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:l})}t()}catch(e){t(e)}})},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},73024:e=>{"use strict";e.exports=require("node:fs")},76760:e=>{"use strict";e.exports=require("node:path")},77598:e=>{"use strict";e.exports=require("node:crypto")},78335:()=>{},96487:()=>{}};var E=require("../../../webpack-runtime.js");E.C(e);var s=e=>E(E.s=e),t=E.X(0,[80,8261,846],()=>s(55639));module.exports=t})();