import { createClient } from "@libsql/client";
const url = "libsql://peerpen-peerpenn.aws-us-east-1.turso.io";
const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTU1NDU5MjQsImlkIjoiYWM3NzlmZjYtNDdlMS00OWY3LTliNTAtOGRkYjU5NWQ0OTQxIiwicmlkIjoiYzk2NTU2OTMtODZiYy00NzllLWI1MjMtOWEwMzA5ZDNjNWZhIn0.D49fjQ8ugnAK4MgPmpL0QqlcWASQbp_dQESoLlzQ_dcr0ZTQGc05q84pKt8YA7BJDoYumFncoShABnOGMb21BQ";
const db = createClient({
  url,
  authToken
});
async function initDB() {
  await db.execute("DROP TABLE IF EXISTS reports");
  await db.execute("DROP TABLE IF EXISTS notifications");
  await db.execute("DROP TABLE IF EXISTS votes");
  await db.execute("DROP TABLE IF EXISTS comments");
  await db.execute("DROP TABLE IF EXISTS review_scores");
  await db.execute("DROP TABLE IF EXISTS reviews");
  await db.execute("DROP TABLE IF EXISTS essay_versions");
  await db.execute("DROP TABLE IF EXISTS essays");
  await db.execute("DROP TABLE IF EXISTS sessions");
  await db.execute("DROP TABLE IF EXISTS users");
  await db.execute("DROP TABLE IF EXISTS essay_prompts");
  await db.execute("DROP TABLE IF EXISTS colleges");
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      handle TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE,
      display_name TEXT,
      bio TEXT,
      password_hash TEXT NOT NULL,
      karma INTEGER DEFAULT 0
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS essays (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      author_id TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      school_name TEXT,
      prompt TEXT,
      application_type TEXT DEFAULT 'commonapp',
      word_count INTEGER,
      is_public BOOLEAN DEFAULT FALSE,
      target_major TEXT,
      target_program TEXT,
      deadline_date DATE,
      FOREIGN KEY (author_id) REFERENCES users (id)
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS essay_versions (
      id TEXT PRIMARY KEY,
      essay_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      content TEXT NOT NULL,
      notes TEXT,
      version_number INTEGER DEFAULT 1,
      FOREIGN KEY (essay_id) REFERENCES essays (id)
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      essay_id TEXT NOT NULL,
      author_id TEXT NOT NULL,
      summary TEXT NOT NULL,
      FOREIGN KEY (essay_id) REFERENCES essays (id),
      FOREIGN KEY (author_id) REFERENCES users (id)
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS review_scores (
      id TEXT PRIMARY KEY,
      review_id TEXT UNIQUE NOT NULL,
      flow INTEGER NOT NULL,
      hook INTEGER NOT NULL,
      voice INTEGER NOT NULL,
      uniqueness INTEGER NOT NULL,
      conciseness INTEGER NOT NULL,
      authenticity INTEGER NOT NULL,
      FOREIGN KEY (review_id) REFERENCES reviews (id)
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      author_id TEXT NOT NULL,
      essay_id TEXT,
      review_id TEXT,
      content TEXT NOT NULL,
      start_pos INTEGER,
      end_pos INTEGER,
      FOREIGN KEY (author_id) REFERENCES users (id),
      FOREIGN KEY (essay_id) REFERENCES essays (id),
      FOREIGN KEY (review_id) REFERENCES reviews (id)
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS votes (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      review_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      value INTEGER DEFAULT 1,
      UNIQUE(review_id, user_id),
      FOREIGN KEY (review_id) REFERENCES reviews (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      data TEXT NOT NULL,
      read BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      reporter_id TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      status TEXT DEFAULT 'open',
      FOREIGN KEY (reporter_id) REFERENCES users (id)
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS essay_prompts (
      id TEXT PRIMARY KEY,
      prompt_text TEXT NOT NULL,
      source TEXT NOT NULL,
      year INTEGER,
      is_active BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS colleges (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT,
      acceptance_rate REAL,
      common_data_set_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.execute(`
    INSERT OR IGNORE INTO essay_prompts (id, prompt_text, source, year) VALUES 
    ('prompt-1', 'Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.', 'Common App', 2024),
    ('prompt-2', 'The lessons we take from obstacles we encounter can be fundamental to later success. Recount a time when you faced a challenge, setback, or failure. How did it affect you, and what did you learn from the experience?', 'Common App', 2024),
    ('prompt-3', 'Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?', 'Common App', 2024),
    ('prompt-4', 'Reflect on something that someone has done for you that has made you happy or thankful in a surprising way. How has this gratitude affected or motivated you?', 'Common App', 2024),
    ('prompt-5', 'Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others.', 'Common App', 2024),
    ('prompt-6', 'Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you? What or who do you turn to when you want to learn more?', 'Common App', 2024),
    ('prompt-7', 'Share an essay on any topic of your choice. It can be one you''ve already written, one that responds to a different prompt, or one of your own design.', 'Common App', 2024)
  `);
  await db.execute(`
    INSERT OR IGNORE INTO colleges (id, name, location, acceptance_rate) VALUES 
    ('college-1', 'Harvard University', 'Cambridge, MA', 4.6),
    ('college-2', 'Stanford University', 'Stanford, CA', 4.3),
    ('college-3', 'MIT', 'Cambridge, MA', 6.7),
    ('college-4', 'Yale University', 'New Haven, CT', 5.9),
    ('college-5', 'Princeton University', 'Princeton, NJ', 5.8),
    ('college-6', 'Columbia University', 'New York, NY', 5.1),
    ('college-7', 'University of Pennsylvania', 'Philadelphia, PA', 5.9),
    ('college-8', 'Duke University', 'Durham, NC', 6.3),
    ('college-9', 'Brown University', 'Providence, RI', 5.4),
    ('college-10', 'Cornell University', 'Ithaca, NY', 8.7),
    ('college-11', 'University of California, Berkeley', 'Berkeley, CA', 14.4),
    ('college-12', 'University of Michigan', 'Ann Arbor, MI', 20.2),
    ('college-13', 'University of Virginia', 'Charlottesville, VA', 20.7),
    ('college-14', 'University of North Carolina', 'Chapel Hill, NC', 19.2),
    ('college-15', 'University of Texas at Austin', 'Austin, TX', 31.8)
  `);
}
export {
  db as d,
  initDB as i
};
