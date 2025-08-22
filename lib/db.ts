import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Initialize database with tables from schema.sql
export async function initDatabase() {
  try {
    console.log('Initializing database with full schema...');
    
    // Split schema into individual statements
    const statements = [
      'PRAGMA foreign_keys = ON;',
      
      // 1) Users
      `CREATE TABLE IF NOT EXISTS profiles (
        id                 TEXT PRIMARY KEY,
        username           TEXT UNIQUE,
        display_name       TEXT,
        email              TEXT,
        bio                TEXT,
        avatar_url         TEXT,
        is_verified        INTEGER NOT NULL DEFAULT 0,
        created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at         DATETIME
      );`,
      
      `CREATE TABLE IF NOT EXISTS follows (
        follower_id        TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        followee_id        TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (follower_id, followee_id)
      );`,
      
      // 2) Prompts and tagging
      `CREATE TABLE IF NOT EXISTS prompts (
        id                 TEXT PRIMARY KEY,
        source             TEXT NOT NULL,
        label              TEXT,
        text               TEXT NOT NULL
      );`,
      
      `CREATE TABLE IF NOT EXISTS tags (
        id                 TEXT PRIMARY KEY,
        name               TEXT NOT NULL UNIQUE
      );`,
      
      // 3) Essays
      `CREATE TABLE IF NOT EXISTS essays (
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
      );`,
      
      // Indexes for essays
      'CREATE INDEX IF NOT EXISTS idx_essays_author ON essays(author_id);',
      'CREATE INDEX IF NOT EXISTS idx_essays_status_pub ON essays(status, published_at);',
      'CREATE INDEX IF NOT EXISTS idx_essays_visibility ON essays(visibility);',
      'CREATE INDEX IF NOT EXISTS idx_essays_prompt ON essays(prompt_id);',
      
      `CREATE TABLE IF NOT EXISTS essay_tags (
        essay_id           TEXT NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
        tag_id             TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY (essay_id, tag_id)
      );`,
      
      // 4) Version history
      `CREATE TABLE IF NOT EXISTS essay_versions (
        id                 TEXT PRIMARY KEY,
        essay_id           TEXT NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
        version_number     INTEGER NOT NULL,
        title              TEXT,
        content            TEXT NOT NULL,
        change_note        TEXT,
        created_by         TEXT REFERENCES profiles(id) ON DELETE SET NULL,
        created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (essay_id, version_number)
      );`,
      
      // 5) Feedback and rubric scoring
      `CREATE TABLE IF NOT EXISTS feedback (
        id                 TEXT PRIMARY KEY,
        essay_id           TEXT NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
        author_id          TEXT REFERENCES profiles(id) ON DELETE SET NULL,
        provider           TEXT NOT NULL,
        model_name         TEXT,
        general_comment    TEXT,
        inline_annotations TEXT,
        suggestion_patch   TEXT,
        created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,
      
      `CREATE TABLE IF NOT EXISTS evaluation_scores (
        feedback_id        TEXT PRIMARY KEY REFERENCES feedback(id) ON DELETE CASCADE,
        flow               INTEGER CHECK (flow BETWEEN 0 AND 10),
        hook               INTEGER CHECK (hook BETWEEN 0 AND 10),
        voice              INTEGER CHECK (voice BETWEEN 0 AND 10),
        uniqueness         INTEGER CHECK (uniqueness BETWEEN 0 AND 10),
        conciseness        INTEGER CHECK (conciseness BETWEEN 0 AND 10),
        authenticity       INTEGER CHECK (authenticity BETWEEN 0 AND 10),
        overall            REAL
      );`,
      
      // 6) Comments and ratings
      `CREATE TABLE IF NOT EXISTS comments (
        id                 TEXT PRIMARY KEY,
        essay_id           TEXT NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
        author_id          TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        parent_id          TEXT REFERENCES comments(id) ON DELETE CASCADE,
        body               TEXT NOT NULL,
        is_deleted         INTEGER NOT NULL DEFAULT 0,
        created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        edited_at          DATETIME
      );`,
      
      'CREATE INDEX IF NOT EXISTS idx_comments_essay ON comments(essay_id, created_at);',
      
      `CREATE TABLE IF NOT EXISTS ratings (
        id                 TEXT PRIMARY KEY,
        essay_id           TEXT NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
        rater_id           TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        score              INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
        created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (essay_id, rater_id)
      );`,
      
      // 7) Bookmarks
      `CREATE TABLE IF NOT EXISTS bookmarks (
        user_id            TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        essay_id           TEXT NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
        created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, essay_id)
      );`,
      
      // 8) Notifications and activity
      `CREATE TABLE IF NOT EXISTS activities (
        id                 TEXT PRIMARY KEY,
        actor_id           TEXT REFERENCES profiles(id) ON DELETE SET NULL,
        verb               TEXT NOT NULL,
        object_type        TEXT NOT NULL,
        object_id          TEXT NOT NULL,
        target_user_id     TEXT REFERENCES profiles(id) ON DELETE CASCADE,
        created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,
      
      `CREATE TABLE IF NOT EXISTS notifications (
        id                 TEXT PRIMARY KEY,
        user_id            TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        type               TEXT NOT NULL,
        actor_id           TEXT REFERENCES profiles(id) ON DELETE SET NULL,
        entity_type        TEXT NOT NULL,
        entity_id          TEXT NOT NULL,
        read_at            DATETIME,
        created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,
      
      'CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at);',
      
      // 9) Moderation
      `CREATE TABLE IF NOT EXISTS reports (
        id                 TEXT PRIMARY KEY,
        reporter_id        TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        target_type        TEXT NOT NULL,
        target_id          TEXT NOT NULL,
        reason             TEXT NOT NULL,
        status             TEXT NOT NULL DEFAULT 'open',
        created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        resolved_at        DATETIME,
        resolver_id        TEXT REFERENCES profiles(id) ON DELETE SET NULL
      );`,
      
      `CREATE TABLE IF NOT EXISTS moderation_actions (
        id                 TEXT PRIMARY KEY,
        target_type        TEXT NOT NULL,
        target_id          TEXT NOT NULL,
        action_type        TEXT NOT NULL,
        reason             TEXT,
        actor_id           TEXT REFERENCES profiles(id) ON DELETE SET NULL,
        created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`,
      
      // 10) Search, FTS
      `CREATE VIRTUAL TABLE IF NOT EXISTS essay_fts USING fts5(
        title,
        content,
        essay_id UNINDEXED,
        tokenize = "porter"
      );`,
      
      // Sync triggers
      `CREATE TRIGGER IF NOT EXISTS essays_ai AFTER INSERT ON essays BEGIN
        INSERT INTO essay_fts(rowid, title, content, essay_id)
        VALUES (new.rowid, new.title, new.content, new.id);
      END;`,
      
      `CREATE TRIGGER IF NOT EXISTS essays_au AFTER UPDATE ON essays BEGIN
        INSERT INTO essay_fts(essay_fts, rowid, title, content, essay_id)
        VALUES('delete', old.rowid, old.title, old.content, old.id);
        INSERT INTO essay_fts(rowid, title, content, essay_id)
        VALUES (new.rowid, new.title, new.content, new.id);
      END;`,
      
      `CREATE TRIGGER IF NOT EXISTS essays_ad AFTER DELETE ON essays BEGIN
        INSERT INTO essay_fts(essay_fts, rowid, title, content, essay_id)
        VALUES('delete', old.rowid, old.title, old.content, old.id);
      END;`,
      
      // 11) Helpful views
      `CREATE VIEW IF NOT EXISTS v_essay_rating AS
      SELECT
        e.id AS essay_id,
        COUNT(r.id) AS ratings_count,
        AVG(r.score) AS avg_score
      FROM essays e
      LEFT JOIN ratings r ON r.essay_id = e.id
      GROUP BY e.id;`,
      
      `CREATE VIEW IF NOT EXISTS v_rubric_avg AS
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
      GROUP BY fb.essay_id;`
    ];

    // Execute each statement individually
    for (const statement of statements) {
      try {
        await client.execute(statement);
      } catch (error) {
        // Skip if table/view already exists
        if (error instanceof Error && error.message.includes('already exists')) {
          console.log('Table/view already exists, skipping...');
          continue;
        }
        throw error;
      }
    }
    
    console.log('Database initialized successfully with full schema!');
    
    // Run migrations
    await runMigrations();
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Run database migrations
async function runMigrations() {
  try {
    // Migration 1: Add email column to profiles table if it doesn't exist
    try {
      await client.execute("ALTER TABLE profiles ADD COLUMN email TEXT");
      console.log('Migration: Added email column to profiles table');
    } catch (error: any) {
      // Column might already exist, which is fine
      if (!error.message?.includes('duplicate column name')) {
        console.error('Migration error:', error);
      }
    }
  } catch (error) {
    console.error('Error running migrations:', error);
    // Don't throw here, migrations are non-critical
  }
}

// Check if database is initialized
export async function checkDatabase() {
  try {
    const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='essays'");
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking database:', error);
    return false;
  }
}

export default client;
