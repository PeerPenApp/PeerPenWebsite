import { type NextRequest, NextResponse } from "next/server"
import { auth } from '@clerk/nextjs/server';
import db, { checkDatabase, initDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const search = searchParams.get("search")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  try {
    // Check admin authorization
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure database is initialized
    const isInitialized = await checkDatabase();
    if (!isInitialized) {
      console.log('Database not initialized, initializing now...');
      await initDatabase();
    }

    // Build the query
    let sql = `
      SELECT 
        p.id, p.username, p.display_name, p.bio, p.avatar_url, p.is_verified, p.created_at,
        COUNT(DISTINCT e.id) as essays_count,
        COUNT(DISTINCT c.id) as comments_count,
        COUNT(DISTINCT r.id) as reports_received,
        p.is_verified as status
      FROM profiles p
      LEFT JOIN essays e ON p.id = e.author_id AND e.is_deleted = 0
      LEFT JOIN comments c ON p.id = c.author_id AND c.is_deleted = 0
      LEFT JOIN reports r ON p.id = r.target_id AND r.target_type = 'profile'
    `;

    let args: any[] = [];
    let whereConditions: string[] = [];

    if (status && status !== "all") {
      whereConditions.push("p.is_verified = ?");
      args.push(status === "verified" ? 1 : 0);
    }

    if (search) {
      whereConditions.push("(p.username LIKE ? OR p.display_name LIKE ? OR p.bio LIKE ?)");
      args.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (whereConditions.length > 0) {
      sql += " WHERE " + whereConditions.join(" AND ");
    }

    sql += " GROUP BY p.id ORDER BY p.created_at DESC";

    // Add pagination
    const offset = (page - 1) * limit;
    sql += " LIMIT ? OFFSET ?";
    args.push(limit, offset);

    const result = await db.execute({ sql, args });
    
    // Get total count for pagination
    let countSql = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM profiles p
    `;
    
    if (whereConditions.length > 0) {
      countSql += " WHERE " + whereConditions.join(" AND ");
    }
    
    const countResult = await db.execute({ sql: countSql, args: args.slice(0, -2) });
    const total = countResult.rows[0]?.total || 0;

    const users = result.rows.map(row => ({
      id: row.id,
      username: row.username,
      displayName: row.display_name,
      bio: row.bio,
      avatarUrl: row.avatar_url,
      status: row.status ? "verified" : "unverified",
      essays: Number(row.essays_count),
      comments: Number(row.comments_count),
      reports: Number(row.reports_received),
      joinDate: row.created_at,
      lastActive: row.created_at // You might want to track this separately
    }));

    return NextResponse.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check admin authorization
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { targetUserId, action, reason } = await request.json()

    // Ensure database is initialized
    const isInitialized = await checkDatabase();
    if (!isInitialized) {
      console.log('Database not initialized, initializing now...');
      await initDatabase();
    }

    let sql = "";
    let args: any[] = [];

    switch (action) {
      case "verify":
        sql = "UPDATE profiles SET is_verified = 1 WHERE id = ?";
        args = [targetUserId];
        break;
      case "unverify":
        sql = "UPDATE profiles SET is_verified = 0 WHERE id = ?";
        args = [targetUserId];
        break;
      case "ban":
        // You might want to add a banned field to profiles or use a separate table
        sql = "UPDATE profiles SET is_verified = 0 WHERE id = ?";
        args = [targetUserId];
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await db.execute({ sql, args });

    // Log the moderation action
    const actionId = crypto.randomUUID();
    await db.execute({
      sql: `INSERT INTO moderation_actions (id, target_type, target_id, action_type, reason, actor_id) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [actionId, 'profile', targetUserId, action, reason, userId]
    });

    const updatedUser = {
      id: targetUserId,
      status: action,
      moderatedBy: userId,
      moderatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error) {
    console.error("Failed to update user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
