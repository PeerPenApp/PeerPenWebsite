import type { APIContext } from 'astro';
import { initDB } from '../../lib/db';

export async function POST() {
  try {
    await initDB();
    return new Response(JSON.stringify({ success: true, message: 'Database initialized' }));
  } catch (error) {
    console.error('DB init error:', error);
    return new Response(JSON.stringify({ error: 'Failed to initialize database' }), { status: 500 });
  }
}



