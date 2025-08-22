import { type NextRequest, NextResponse } from "next/server"
import db, { checkDatabase, initDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Ensure database is initialized
    const isInitialized = await checkDatabase();
    if (!isInitialized) {
      console.log('Database not initialized, initializing now...');
      await initDatabase();
    }

    // Get available colleges
    const collegesSql = `
      SELECT DISTINCT college
      FROM essays
      WHERE college IS NOT NULL 
        AND college != '' 
        AND status = 'published' 
        AND visibility = 'public'
        AND is_deleted = 0
      ORDER BY college
    `;
    
    const collegesResult = await db.execute({ sql: collegesSql, args: [] });
    const colleges = collegesResult.rows.map(row => row.college);

    // Get available tags (for now, we'll use essay prompts as tags)
    // In the future, this could be enhanced with actual tags from the tags table
    const tagsSql = `
      SELECT DISTINCT prompt as tag
      FROM essays
      WHERE prompt IS NOT NULL 
        AND prompt != '' 
        AND status = 'published' 
        AND visibility = 'public'
        AND is_deleted = 0
      ORDER BY prompt
      LIMIT 50
    `;
    
    const tagsResult = await db.execute({ sql: tagsSql, args: [] });
    const tags = tagsResult.rows.map(row => row.tag);

    return NextResponse.json({
      colleges,
      tags
    });
  } catch (error) {
    console.error("Filters error:", error);
    return NextResponse.json({ error: "Failed to fetch filters" }, { status: 500 });
  }
}
