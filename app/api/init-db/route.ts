import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, checkDatabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Check if database is already initialized
    const isInitialized = await checkDatabase();
    
    if (isInitialized) {
      return NextResponse.json({ 
        message: 'Database already initialized',
        initialized: true 
      });
    }
    
    // Initialize database
    await initDatabase();
    
    return NextResponse.json({ 
      message: 'Database initialized successfully',
      initialized: true 
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json({ 
      error: 'Failed to initialize database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const isInitialized = await checkDatabase();
    
    return NextResponse.json({ 
      initialized: isInitialized,
      message: isInitialized ? 'Database is initialized' : 'Database is not initialized'
    });
  } catch (error) {
    console.error('Error checking database:', error);
    return NextResponse.json({ 
      error: 'Failed to check database status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
