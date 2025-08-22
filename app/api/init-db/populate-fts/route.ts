import { NextResponse } from "next/server"
import db, { checkDatabase, initDatabase } from '@/lib/db';

export async function POST() {
  try {
    // Ensure database is initialized
    const isInitialized = await checkDatabase();
    if (!isInitialized) {
      console.log('Database not initialized, initializing now...');
      await initDatabase();
    }

    // Clear existing FTS data
    await db.execute({
      sql: "DELETE FROM essay_fts",
      args: []
    });

    // Get all essays and populate FTS table
    const essaysResult = await db.execute({
      sql: `
        SELECT id, title, content 
        FROM essays 
        WHERE is_deleted = 0
      `,
      args: []
    });

    let insertedCount = 0;
    for (const essay of essaysResult.rows) {
      try {
        await db.execute({
          sql: `
            INSERT INTO essay_fts (rowid, title, content, essay_id)
            VALUES (?, ?, ?, ?)
          `,
          args: [essay.id, essay.title, essay.content, essay.id]
        });
        insertedCount++;
      } catch (error) {
        console.error(`Failed to insert essay ${essay.id} into FTS:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully populated FTS table with ${insertedCount} essays`,
      insertedCount
    });

  } catch (error) {
    console.error("Failed to populate FTS table:", error);
    return NextResponse.json({ 
      error: "Failed to populate FTS table",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
