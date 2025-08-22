(()=>{var e={};e.id=5199,e.ids=[5199],e.modules={815:(e,t,E)=>{"use strict";E.a(e,async(e,r)=>{try{E.r(t),E.d(t,{patchFetch:()=>n,routeModule:()=>N,serverHooks:()=>l,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>_});var s=E(96559),a=E(48088),T=E(37719),i=E(66312),o=e([i]);i=(o.then?(await o)():o)[0];let N=new s.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/admin/reports/route",pathname:"/api/admin/reports",filename:"route",bundlePath:"app/api/admin/reports/route"},resolvedPagePath:"/Users/krithikalluri/Documents/GitHub/PeerPenWebsite/app/api/admin/reports/route.ts",nextConfigOutput:"",userland:i}),{workAsyncStorage:d,workUnitAsyncStorage:_,serverHooks:l}=N;function n(){return(0,T.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:_})}r()}catch(e){r(e)}})},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},7462:(e,t,E)=>{"use strict";E.a(e,async(e,r)=>{try{E.r(t),E.d(t,{checkDatabase:()=>o,default:()=>N,initDatabase:()=>T});var s=E(28855),a=e([s]);s=(a.then?(await a)():a)[0];let n=(0,s.createClient)({url:process.env.TURSO_DATABASE_URL,authToken:process.env.TURSO_AUTH_TOKEN});async function T(){try{for(let e of(console.log("Initializing database with full schema..."),["PRAGMA foreign_keys = ON;",`CREATE TABLE IF NOT EXISTS profiles (
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
      GROUP BY fb.essay_id;`]))try{await n.execute(e)}catch(e){if(e instanceof Error&&e.message.includes("already exists")){console.log("Table/view already exists, skipping...");continue}throw e}console.log("Database initialized successfully with full schema!"),await i()}catch(e){throw console.error("Error initializing database:",e),e}}async function i(){try{try{await n.execute("ALTER TABLE profiles ADD COLUMN email TEXT"),console.log("Migration: Added email column to profiles table")}catch(e){e.message?.includes("duplicate column name")||console.error("Migration error:",e)}}catch(e){console.error("Error running migrations:",e)}}async function o(){try{return(await n.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='essays'")).rows.length>0}catch(e){return console.error("Error checking database:",e),!1}}let N=n;r()}catch(e){r(e)}})},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},28855:e=>{"use strict";e.exports=import("@libsql/client")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},66312:(e,t,E)=>{"use strict";E.a(e,async(e,r)=>{try{E.r(t),E.d(t,{GET:()=>o,PATCH:()=>n});var s=E(32190),a=E(88261),T=E(7462),i=e([T]);async function o(e){let{searchParams:t}=new URL(e.url),E=t.get("status")||"open",r=t.get("type")||"all";try{let{userId:e}=await (0,a.j)();if(!e)return s.NextResponse.json({error:"Unauthorized"},{status:401});await (0,T.checkDatabase)()||(console.log("Database not initialized, initializing now..."),await (0,T.initDatabase)());let t=`
      SELECT 
        r.id, r.target_type, r.target_id, r.reason, r.status, r.created_at, r.resolved_at,
        r.reporter_id, r.resolver_id,
        p_reporter.username as reporter_username, p_reporter.display_name as reporter_display_name,
        p_resolver.username as resolver_username, p_resolver.display_name as resolver_display_name,
        CASE 
          WHEN r.target_type = 'essay' THEN e.title
          WHEN r.target_type = 'comment' THEN c.body
          WHEN r.target_type = 'profile' THEN p_target.username
          ELSE 'Unknown'
        END as content_title,
        CASE 
          WHEN r.target_type = 'essay' THEN e.author_id
          WHEN r.target_type = 'comment' THEN c.author_id
          WHEN r.target_type = 'profile' THEN p_target.id
          ELSE NULL
        END as content_author_id,
        CASE 
          WHEN r.target_type = 'essay' THEN p_author.username
          WHEN r.target_type = 'comment' THEN p_author.username
          WHEN r.target_type = 'profile' THEN p_target.username
          ELSE 'Unknown'
        END as content_author_username
      FROM reports r
      LEFT JOIN profiles p_reporter ON r.reporter_id = p_reporter.id
      LEFT JOIN profiles p_resolver ON r.resolver_id = p_resolver.id
      LEFT JOIN essays e ON r.target_type = 'essay' AND r.target_id = e.id
      LEFT JOIN comments c ON r.target_type = 'comment' AND r.target_id = c.id
      LEFT JOIN profiles p_target ON r.target_type = 'profile' AND r.target_id = p_target.id
      LEFT JOIN profiles p_author ON (e.author_id = p_author.id OR c.author_id = p_author.id)
    `,i=[],o=[];E&&"all"!==E&&(o.push("r.status = ?"),i.push(E)),r&&"all"!==r&&(o.push("r.target_type = ?"),i.push(r)),o.length>0&&(t+=" WHERE "+o.join(" AND ")),t+=" ORDER BY r.created_at DESC";let n=(await T.default.execute({sql:t,args:i})).rows.map(e=>({id:e.id,type:e.target_type,contentId:e.target_id,contentTitle:e.content_title||"Unknown",contentAuthor:e.content_author_username||"Unknown",reportedBy:e.reporter_id,reporterName:e.reporter_display_name||e.reporter_username||"Anonymous",reason:e.reason,status:e.status,createdAt:e.created_at,resolvedAt:e.resolved_at,moderatorId:e.resolver_id,moderatorName:e.resolver_display_name||e.resolver_username||"Unassigned",priority:"open"===e.status?"high":"low"}));return s.NextResponse.json({reports:n,total:n.length})}catch(e){return console.error("Failed to fetch reports:",e),s.NextResponse.json({error:"Failed to fetch reports"},{status:500})}}async function n(e){try{let{userId:t}=await (0,a.j)();if(!t)return s.NextResponse.json({error:"Unauthorized"},{status:401});let{reportId:E,action:r,reason:i}=await e.json();await (0,T.checkDatabase)()||(console.log("Database not initialized, initializing now..."),await (0,T.initDatabase)());let o=await T.default.execute({sql:"SELECT * FROM reports WHERE id = ?",args:[E]});if(0===o.rows.length)return s.NextResponse.json({error:"Report not found"},{status:404});let n=o.rows[0],N="",d="";switch(r){case"approve":N="resolved",d="resolve";break;case"reject":N="rejected",d="reject";break;case"review":N="reviewing",d="review";break;default:return s.NextResponse.json({error:"Invalid action"},{status:400})}await T.default.execute({sql:"UPDATE reports SET status = ?, resolved_at = ?, resolver_id = ? WHERE id = ?",args:[N,"resolved"===N||"rejected"===N?new Date().toISOString():null,t,E]});let _=crypto.randomUUID();if(await T.default.execute({sql:"INSERT INTO moderation_actions (id, target_type, target_id, action_type, reason, actor_id) VALUES (?, ?, ?, ?, ?, ?)",args:[_,n.target_type,n.target_id,d,i,t]}),"approve"===r)switch(n.target_type){case"essay":await T.default.execute({sql:"UPDATE essays SET is_deleted = 1 WHERE id = ?",args:[n.target_id]});break;case"comment":await T.default.execute({sql:"UPDATE comments SET is_deleted = 1 WHERE id = ?",args:[n.target_id]});break;case"profile":await T.default.execute({sql:"UPDATE profiles SET is_verified = 0 WHERE id = ?",args:[n.target_id]})}let l={id:E,status:N,moderatorId:t,resolvedAt:new Date().toISOString()};return s.NextResponse.json({success:!0,report:l})}catch(e){return console.error("Failed to update report:",e),s.NextResponse.json({error:"Failed to update report"},{status:500})}}T=(i.then?(await i)():i)[0],r()}catch(e){r(e)}})},73024:e=>{"use strict";e.exports=require("node:fs")},76760:e=>{"use strict";e.exports=require("node:path")},77598:e=>{"use strict";e.exports=require("node:crypto")},78335:()=>{},96487:()=>{},96559:(e,t,E)=>{"use strict";e.exports=E(44870)}};var t=require("../../../../webpack-runtime.js");t.C(e);var E=e=>t(t.s=e),r=t.X(0,[80,8261],()=>E(815));module.exports=r})();