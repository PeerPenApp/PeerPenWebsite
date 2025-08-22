import { type NextRequest, NextResponse } from "next/server"
import { auth } from '@clerk/nextjs/server';
import db, { checkDatabase, initDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status") || "open"
  const type = searchParams.get("type") || "all"

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
    `;

    let args: any[] = [];
    let whereConditions: string[] = [];

    if (status && status !== "all") {
      whereConditions.push("r.status = ?");
      args.push(status);
    }

    if (type && type !== "all") {
      whereConditions.push("r.target_type = ?");
      args.push(type);
    }

    if (whereConditions.length > 0) {
      sql += " WHERE " + whereConditions.join(" AND ");
    }

    sql += " ORDER BY r.created_at DESC";

    const result = await db.execute({ sql, args });
    
    const reports = result.rows.map(row => ({
      id: row.id,
      type: row.target_type,
      contentId: row.target_id,
      contentTitle: row.content_title || 'Unknown',
      contentAuthor: row.content_author_username || 'Unknown',
      reportedBy: row.reporter_id,
      reporterName: row.reporter_display_name || row.reporter_username || 'Anonymous',
      reason: row.reason,
      status: row.status,
      createdAt: row.created_at,
      resolvedAt: row.resolved_at,
      moderatorId: row.resolver_id,
      moderatorName: row.resolver_display_name || row.resolver_username || 'Unassigned',
      priority: row.status === 'open' ? 'high' : 'low'
    }));

    return NextResponse.json({
      reports,
      total: reports.length,
    })
  } catch (error) {
    console.error("Failed to fetch reports:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check admin authorization
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reportId, action, reason } = await request.json()

    // Ensure database is initialized
    const isInitialized = await checkDatabase();
    if (!isInitialized) {
      console.log('Database not initialized, initializing now...');
      await initDatabase();
    }

    // Get the report details
    const reportResult = await db.execute({
      sql: `SELECT * FROM reports WHERE id = ?`,
      args: [reportId]
    });

    if (reportResult.rows.length === 0) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const report = reportResult.rows[0];
    let newStatus = "";
    let actionType = "";

    switch (action) {
      case "approve":
        newStatus = "resolved";
        actionType = "resolve";
        break;
      case "reject":
        newStatus = "rejected";
        actionType = "reject";
        break;
      case "review":
        newStatus = "reviewing";
        actionType = "review";
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Update report status
    await db.execute({
      sql: `UPDATE reports SET status = ?, resolved_at = ?, resolver_id = ? WHERE id = ?`,
      args: [newStatus, newStatus === "resolved" || newStatus === "rejected" ? new Date().toISOString() : null, userId, reportId]
    });

    // Log the moderation action
    const actionId = crypto.randomUUID();
    await db.execute({
      sql: `INSERT INTO moderation_actions (id, target_type, target_id, action_type, reason, actor_id) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [actionId, report.target_type, report.target_id, actionType, reason, userId]
    });

    // Take action on the reported content if approved
    if (action === "approve") {
      switch (report.target_type) {
        case "essay":
          await db.execute({
            sql: `UPDATE essays SET is_deleted = 1 WHERE id = ?`,
            args: [report.target_id]
          });
          break;
        case "comment":
          await db.execute({
            sql: `UPDATE comments SET is_deleted = 1 WHERE id = ?`,
            args: [report.target_id]
          });
          break;
        case "profile":
          // You might want to add a banned field to profiles
          await db.execute({
            sql: `UPDATE profiles SET is_verified = 0 WHERE id = ?`,
            args: [report.target_id]
          });
          break;
      }
    }

    const updatedReport = {
      id: reportId,
      status: newStatus,
      moderatorId: userId,
      resolvedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      report: updatedReport,
    })
  } catch (error) {
    console.error("Failed to update report:", error)
    return NextResponse.json({ error: "Failed to update report" }, { status: 500 })
  }
}
