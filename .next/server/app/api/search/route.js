(()=>{var e={};e.id=6202,e.ids=[6202],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},7462:(e,E,t)=>{"use strict";t.a(e,async(e,s)=>{try{t.r(E),t.d(E,{checkDatabase:()=>o,default:()=>n,initDatabase:()=>i});var T=t(28855),a=e([T]);T=(a.then?(await a)():a)[0];let N=(0,T.createClient)({url:process.env.TURSO_DATABASE_URL,authToken:process.env.TURSO_AUTH_TOKEN});async function i(){try{for(let e of(console.log("Initializing database with full schema..."),["PRAGMA foreign_keys = ON;",`CREATE TABLE IF NOT EXISTS profiles (
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
      GROUP BY fb.essay_id;`]))try{await N.execute(e)}catch(e){if(e instanceof Error&&e.message.includes("already exists")){console.log("Table/view already exists, skipping...");continue}throw e}console.log("Database initialized successfully with full schema!"),await r()}catch(e){throw console.error("Error initializing database:",e),e}}async function r(){try{try{await N.execute("ALTER TABLE profiles ADD COLUMN email TEXT"),console.log("Migration: Added email column to profiles table")}catch(e){e.message?.includes("duplicate column name")||console.error("Migration error:",e)}}catch(e){console.error("Error running migrations:",e)}}async function o(){try{return(await N.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='essays'")).rows.length>0}catch(e){return console.error("Error checking database:",e),!1}}let n=N;s()}catch(e){s(e)}})},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},28855:e=>{"use strict";e.exports=import("@libsql/client")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},76095:(e,E,t)=>{"use strict";t.a(e,async(e,s)=>{try{t.r(E),t.d(E,{patchFetch:()=>N,routeModule:()=>n,serverHooks:()=>c,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>l});var T=t(96559),a=t(48088),i=t(37719),r=t(92599),o=e([r]);r=(o.then?(await o)():o)[0];let n=new T.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/search/route",pathname:"/api/search",filename:"route",bundlePath:"app/api/search/route"},resolvedPagePath:"/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/app/api/search/route.ts",nextConfigOutput:"",userland:r}),{workAsyncStorage:d,workUnitAsyncStorage:l,serverHooks:c}=n;function N(){return(0,i.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:l})}s()}catch(e){s(e)}})},78335:()=>{},92599:(e,E,t)=>{"use strict";t.a(e,async(e,s)=>{try{t.r(E),t.d(E,{GET:()=>r});var T=t(32190),a=t(7462),i=e([a]);async function r(e){let{searchParams:E}=new URL(e.url),t=E.get("q")||"",s=E.get("type")||"all",i=E.get("status")||"published",r=E.get("visibility")||"public",o=Number.parseFloat(E.get("minRating")||"0"),N=E.get("college")||"",n=E.get("tags")?.split(",").filter(e=>e)||[],d=E.get("dateRange")||"";try{await (0,a.checkDatabase)()||(console.log("Database not initialized, initializing now..."),await (0,a.initDatabase)());let e={essays:[],users:[]};if("essays"===s||"all"===s){let E="",s=[],T=[];if(T.push("e.status = ?"),T.push("e.visibility = ?"),T.push("e.is_deleted = 0"),s.push(i,r),t.trim()?(E=`
          SELECT 
            e.id, e.title, e.content, e.word_count, e.college, e.prompt, e.visibility, e.status, e.created_at, e.updated_at,
            p.display_name, p.username,
            COUNT(DISTINCT r.id) as rating_count,
            AVG(r.score) as avg_rating,
            COUNT(DISTINCT c.id) as comment_count
          FROM essays e
          LEFT JOIN profiles p ON e.author_id = p.id
          LEFT JOIN ratings r ON e.id = r.essay_id
          LEFT JOIN comments c ON e.id = c.essay_id AND c.is_deleted = 0
        `,T.push("(e.title LIKE ? OR e.content LIKE ? OR e.prompt LIKE ?)"),s.push(`%${t}%`,`%${t}%`,`%${t}%`)):E=`
          SELECT 
            e.id, e.title, e.content, e.word_count, e.college, e.prompt, e.visibility, e.status, e.created_at, e.updated_at,
            p.display_name, p.username,
            COUNT(DISTINCT r.id) as rating_count,
            AVG(r.score) as avg_rating,
            COUNT(DISTINCT c.id) as comment_count
          FROM essays e
          LEFT JOIN profiles p ON e.author_id = p.id
          LEFT JOIN ratings r ON e.id = r.essay_id
          LEFT JOIN comments c ON e.id = c.essay_id AND c.is_deleted = 0
        `,N&&N.trim()&&(T.push("LOWER(e.college) LIKE ?"),s.push(`%${N.toLowerCase()}%`)),n.length>0){let e=n.map(()=>"LOWER(e.prompt) LIKE ?");T.push(`(${e.join(" OR ")})`),s.push(...n.map(e=>`%${e.toLowerCase()}%`))}if(d){let e="";switch(d){case"week":e="e.created_at >= datetime('now', '-7 days')";break;case"month":e="e.created_at >= datetime('now', '-30 days')";break;case"year":e="e.created_at >= datetime('now', '-365 days')"}e&&T.push(e)}T.length>0&&(E+=" WHERE "+T.join(" AND ")),E+=" GROUP BY e.id",o>0&&(E+=" HAVING avg_rating >= ?",s.push(o)),E+=" ORDER BY e.updated_at DESC LIMIT 100",console.log("Executing essay search with SQL:",E),console.log("Args:",s),e.essays=(await a.default.execute({sql:E,args:s})).rows.map(e=>({id:e.id,title:e.title,content:e.content,wordCount:e.word_count,college:e.college,prompt:e.prompt,visibility:e.visibility,status:e.status,author:e.display_name||e.username||"Anonymous",ratingCount:Number(e.rating_count),avgRating:e.avg_rating?Number(e.avg_rating):0,commentCount:Number(e.comment_count),createdAt:e.created_at,updatedAt:e.updated_at}))}if("users"===s||"all"===s){let E="",s=[],T=[];T.push("EXISTS (SELECT 1 FROM essays e2 WHERE e2.author_id = p.id AND e2.status = 'published' AND e2.visibility = 'public' AND e2.is_deleted = 0)"),t.trim()&&(T.push("(p.username LIKE ? OR p.display_name LIKE ? OR p.bio LIKE ?)"),s.push(`%${t}%`,`%${t}%`,`%${t}%`)),E=`
        SELECT 
          p.id, p.username, p.display_name, p.bio, p.avatar_url, p.created_at,
          COUNT(DISTINCT e.id) as essays_count,
          COALESCE(COUNT(DISTINCT f.follower_id), 0) as followers_count,
          COALESCE(COUNT(DISTINCT f2.followee_id), 0) as following_count,
          AVG(r.score) as avg_rating
        FROM profiles p
        LEFT JOIN essays e ON p.id = e.author_id AND e.is_deleted = 0 AND e.status = 'published' AND e.visibility = 'public'
        LEFT JOIN follows f ON p.id = f.followee_id
        LEFT JOIN follows f2 ON p.id = f2.follower_id
        LEFT JOIN ratings r ON e.id = r.essay_id
      `,T.length>0&&(E+=" WHERE "+T.join(" AND ")),E+=" GROUP BY p.id ORDER BY p.created_at DESC LIMIT 50",e.users=(await a.default.execute({sql:E,args:s})).rows.map(e=>({id:e.id,username:e.username,displayName:e.display_name,bio:e.bio,avatarUrl:e.avatar_url,essaysCount:Number(e.essays_count),followersCount:Number(e.followers_count),followingCount:Number(e.following_count),avgRating:e.avg_rating?Number(e.avg_rating):0,joinDate:e.created_at}))}return T.NextResponse.json(e)}catch(e){return console.error("Search error:",e),T.NextResponse.json({error:"Failed to perform search",details:e instanceof Error?e.message:"Unknown error"},{status:500})}}a=(i.then?(await i)():i)[0],s()}catch(e){s(e)}})},96487:()=>{},96559:(e,E,t)=>{"use strict";e.exports=t(44870)}};var E=require("../../../webpack-runtime.js");E.C(e);var t=e=>E(E.s=e),s=E.X(0,[80],()=>t(76095));module.exports=s})();