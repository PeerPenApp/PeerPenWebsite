PRAGMA foreign_keys = ON;

-- 1) Users
CREATE TABLE profiles (
  id                 TEXT PRIMARY KEY,              -- clerk user id
  username           TEXT UNIQUE,
  display_name       TEXT,
  email              TEXT,
  bio                TEXT,
  avatar_url         TEXT,
  is_verified        INTEGER NOT NULL DEFAULT 0,    -- boolean
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME
);

CREATE TABLE follows (
  follower_id        TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  followee_id        TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (follower_id, followee_id)
);

-- 2) Prompts and tagging
CREATE TABLE prompts (
  id                 TEXT PRIMARY KEY,
  source             TEXT NOT NULL,                 -- common_app, supplement, custom
  label              TEXT,                          -- short handle for UI
  text               TEXT NOT NULL
);

CREATE TABLE tags (
  id                 TEXT PRIMARY KEY,
  name               TEXT NOT NULL UNIQUE
);

-- 3) Essays
CREATE TABLE essays (
  id                 TEXT PRIMARY KEY,
  author_id          TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title              TEXT NOT NULL,
  content            TEXT NOT NULL,
  word_count         INTEGER,
  prompt_id          TEXT REFERENCES prompts(id) ON DELETE SET NULL,
  visibility         TEXT NOT NULL DEFAULT 'public',  -- public, followers, private
  is_anonymous       INTEGER NOT NULL DEFAULT 0,       -- boolean
  status             TEXT NOT NULL DEFAULT 'draft',    -- draft, published, archived
  published_at       DATETIME,
  google_doc_id      TEXT,
  google_doc_url     TEXT,
  last_sync_at       DATETIME,
  is_deleted         INTEGER NOT NULL DEFAULT 0,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME
);

CREATE INDEX idx_essays_author ON essays(author_id);
CREATE INDEX idx_essays_status_pub ON essays(status, published_at);
CREATE INDEX idx_essays_visibility ON essays(visibility);
CREATE INDEX idx_essays_prompt ON essays(prompt_id);

CREATE TABLE essay_tags (
  essay_id           TEXT NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
  tag_id             TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (essay_id, tag_id)
);

-- 4) Version history
CREATE TABLE essay_versions (
  id                 TEXT PRIMARY KEY,
  essay_id           TEXT NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
  version_number     INTEGER NOT NULL,                 -- 1,2,3...
  title              TEXT,
  content            TEXT NOT NULL,
  change_note        TEXT,
  created_by         TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (essay_id, version_number)
);

-- 5) Feedback and rubric scoring
CREATE TABLE feedback (
  id                 TEXT PRIMARY KEY,
  essay_id           TEXT NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
  author_id          TEXT REFERENCES profiles(id) ON DELETE SET NULL, -- null for AI
  provider           TEXT NOT NULL,             -- peer, ai
  model_name         TEXT,                      -- for AI audits
  general_comment    TEXT,                      -- summary critique
  inline_annotations TEXT,                      -- JSON of spans or suggestions
  suggestion_patch   TEXT,                      -- diff or rewritten text
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Your rubric categories as columns for fast queries
CREATE TABLE evaluation_scores (
  feedback_id        TEXT PRIMARY KEY REFERENCES feedback(id) ON DELETE CASCADE,
  flow               INTEGER CHECK (flow BETWEEN 0 AND 10),
  hook               INTEGER CHECK (hook BETWEEN 0 AND 10),
  voice              INTEGER CHECK (voice BETWEEN 0 AND 10),
  uniqueness         INTEGER CHECK (uniqueness BETWEEN 0 AND 10),
  conciseness        INTEGER CHECK (conciseness BETWEEN 0 AND 10),
  authenticity       INTEGER CHECK (authenticity BETWEEN 0 AND 10),
  overall            REAL                           -- optional stored overall
);

-- 6) Comments and ratings
CREATE TABLE comments (
  id                 TEXT PRIMARY KEY,
  essay_id           TEXT NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
  author_id          TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id          TEXT REFERENCES comments(id) ON DELETE CASCADE,
  body               TEXT NOT NULL,
  is_deleted         INTEGER NOT NULL DEFAULT 0,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  edited_at          DATETIME
);
CREATE INDEX idx_comments_essay ON comments(essay_id, created_at);

CREATE TABLE ratings (
  id                 TEXT PRIMARY KEY,
  essay_id           TEXT NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
  rater_id           TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score              INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (essay_id, rater_id)
);

-- 7) Bookmarks
CREATE TABLE bookmarks (
  user_id            TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  essay_id           TEXT NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, essay_id)
);

-- 8) Notifications and activity
CREATE TABLE activities (
  id                 TEXT PRIMARY KEY,
  actor_id           TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  verb               TEXT NOT NULL,              -- posted, commented, rated, followed
  object_type        TEXT NOT NULL,              -- essay, comment, profile
  object_id          TEXT NOT NULL,
  target_user_id     TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
  id                 TEXT PRIMARY KEY,
  user_id            TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type               TEXT NOT NULL,              -- comment, feedback, mention, follow
  actor_id           TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  entity_type        TEXT NOT NULL,              -- essay, comment, feedback
  entity_id          TEXT NOT NULL,
  read_at            DATETIME,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_notifications_user ON notifications(user_id, created_at);

-- 9) Moderation
CREATE TABLE reports (
  id                 TEXT PRIMARY KEY,
  reporter_id        TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type        TEXT NOT NULL,              -- essay, comment, profile
  target_id          TEXT NOT NULL,
  reason             TEXT NOT NULL,
  status             TEXT NOT NULL DEFAULT 'open',   -- open, reviewing, resolved, rejected
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at        DATETIME,
  resolver_id        TEXT REFERENCES profiles(id) ON DELETE SET NULL
);

CREATE TABLE moderation_actions (
  id                 TEXT PRIMARY KEY,
  target_type        TEXT NOT NULL,
  target_id          TEXT NOT NULL,
  action_type        TEXT NOT NULL,              -- hide, delete, warn, ban
  reason             TEXT,
  actor_id           TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10) Search, FTS
-- Requires SQLite FTS5 and JSON1, both are available on Turso.
CREATE VIRTUAL TABLE essay_fts USING fts5(
  title,
  content,
  essay_id UNINDEXED,
  tokenize = "porter"
);

-- Sync triggers
CREATE TRIGGER essays_ai AFTER INSERT ON essays BEGIN
  INSERT INTO essay_fts(rowid, title, content, essay_id)
  VALUES (new.rowid, new.title, new.content, new.id);
END;

CREATE TRIGGER essays_au AFTER UPDATE ON essays BEGIN
  INSERT INTO essay_fts(essay_fts, rowid, title, content, essay_id)
  VALUES('delete', old.rowid, old.title, old.content, old.id);
  INSERT INTO essay_fts(rowid, title, content, essay_id)
  VALUES (new.rowid, new.title, new.content, new.id);
END;

CREATE TRIGGER essays_ad AFTER DELETE ON essays BEGIN
  INSERT INTO essay_fts(essay_fts, rowid, title, content, essay_id)
  VALUES('delete', old.rowid, old.title, old.content, old.id);
END;

-- 11) Helpful views
CREATE VIEW v_essay_rating AS
SELECT
  e.id AS essay_id,
  COUNT(r.id) AS ratings_count,
  AVG(r.score) AS avg_score
FROM essays e
LEFT JOIN ratings r ON r.essay_id = e.id
GROUP BY e.id;

CREATE VIEW v_rubric_avg AS
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
GROUP BY fb.essay_id;