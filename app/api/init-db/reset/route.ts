import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, checkDatabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    console.log('Resetting database...');
    
    // Drop all existing tables and recreate them
    // This will delete all data and recreate the schema from scratch
    
    // First, check if database exists and get list of tables
    const client = (await import('@/lib/db')).default;
    
    // Get list of all tables
    const tablesResult = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
    const tables = tablesResult.rows.map(row => row.name);
    
    console.log('Found tables to drop:', tables);
    
    // Drop all tables (in reverse dependency order to avoid foreign key issues)
    const dropOrder = [
      'essay_fts', // Virtual table
      'moderation_actions',
      'reports', 
      'notifications',
      'activities',
      'bookmarks',
      'ratings',
      'comments',
      'evaluation_scores',
      'feedback',
      'essay_versions',
      'essay_tags',
      'essays',
      'tags',
      'prompts',
      'follows',
      'profiles'
    ];
    
    for (const tableName of dropOrder) {
      if (tables.includes(tableName)) {
        try {
          if (tableName === 'essay_fts') {
            // Drop virtual table
            await client.execute(`DROP TABLE IF EXISTS ${tableName}`);
          } else {
            // Drop regular table
            await client.execute(`DROP TABLE IF EXISTS ${tableName}`);
          }
          console.log(`Dropped table: ${tableName}`);
        } catch (error) {
          console.warn(`Warning: Could not drop table ${tableName}:`, error);
        }
      }
    }
    
    // Drop all views
    const viewsResult = await client.execute("SELECT name FROM sqlite_master WHERE type='view'");
    const views = viewsResult.rows.map(row => row.name);
    
    for (const viewName of views) {
      try {
        await client.execute(`DROP VIEW IF EXISTS ${viewName}`);
        console.log(`Dropped view: ${viewName}`);
      } catch (error) {
        console.warn(`Warning: Could not drop view ${viewName}:`, error);
      }
    }
    
    // Drop all triggers
    const triggersResult = await client.execute("SELECT name FROM sqlite_master WHERE type='trigger'");
    const triggers = triggersResult.rows.map(row => row.name);
    
    for (const triggerName of triggers) {
      try {
        await client.execute(`DROP TRIGGER IF EXISTS ${triggerName}`);
        console.log(`Dropped trigger: ${triggerName}`);
      } catch (error) {
        console.warn(`Warning: Could not drop trigger ${triggerName}:`, error);
      }
    }
    
    console.log('All existing tables, views, and triggers dropped');
    
    // Now recreate the database with fresh schema
    await initDatabase();
    
    // Verify the database is properly initialized
    const isInitialized = await checkDatabase();
    
    return NextResponse.json({ 
      message: 'Database reset successfully',
      initialized: isInitialized,
      tablesDropped: tables.length,
      viewsDropped: views.length,
      triggersDropped: triggers.length
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    return NextResponse.json({ 
      error: 'Failed to reset database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
