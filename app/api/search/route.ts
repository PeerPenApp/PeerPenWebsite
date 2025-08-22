import { type NextRequest, NextResponse } from "next/server"
import db, { checkDatabase, initDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""
  const type = searchParams.get("type") || "all" // 'essays', 'users', or 'all'
  const status = searchParams.get("status") || "published"
  const visibility = searchParams.get("visibility") || "public"
  const minRating = Number.parseFloat(searchParams.get("minRating") || "0")
  const college = searchParams.get("college") || ""
  const tags = searchParams.get("tags")?.split(",").filter(t => t) || []
  const dateRange = searchParams.get("dateRange") || ""

  try {
    // Ensure database is initialized
    const isInitialized = await checkDatabase();
    if (!isInitialized) {
      console.log('Database not initialized, initializing now...');
      await initDatabase();
    }

    const results = { essays: [], users: [] }

    if (type === "essays" || type === "all") {
      let essaysSql = "";
      let args: any[] = [];
      let whereConditions: string[] = [];

      // Base conditions
      whereConditions.push("e.status = ?");
      whereConditions.push("e.visibility = ?");
      whereConditions.push("e.is_deleted = 0");
      args.push(status, visibility);

      // Search query
      if (query.trim()) {
        // Use regular search instead of FTS to avoid MATCH function issues
        essaysSql = `
          SELECT 
            e.id, e.title, e.content, e.word_count, e.college, e.prompt, e.visibility, e.status, e.created_at, e.updated_at,
            p.display_name, p.username,
            COUNT(DISTINCT r.id) as rating_count,
            AVG(r.score) as avg_rating,
            COUNT(DISTINCT c.id) as comment_count
          FROM essays e
          LEFT JOIN profiles p ON e.author_id = p.id
          LEFT JOIN ratings r ON e.id = r.essay_id
          LEFT JOIN comments c ON e.id = c.essay_id AND c.is_deleted = 0
        `;
        
        whereConditions.push("(e.title LIKE ? OR e.content LIKE ? OR e.prompt LIKE ?)");
        args.push(`%${query}%`, `%${query}%`, `%${query}%`);
      } else {
        // No search query, just filter by conditions
        essaysSql = `
          SELECT 
            e.id, e.title, e.content, e.word_count, e.college, e.prompt, e.visibility, e.status, e.created_at, e.updated_at,
            p.display_name, p.username,
            COUNT(DISTINCT r.id) as rating_count,
            AVG(r.score) as avg_rating,
            COUNT(DISTINCT c.id) as comment_count
          FROM essays e
          LEFT JOIN profiles p ON e.author_id = p.id
          LEFT JOIN ratings r ON e.id = r.essay_id
          LEFT JOIN comments c ON e.id = c.essay_id AND c.is_deleted = 0
        `;
      }

      // Add college filter
      if (college && college.trim()) {
        whereConditions.push("LOWER(e.college) LIKE ?");
        args.push(`%${college.toLowerCase()}%`);
      }

      // Add tags filter (using prompts for now)
      if (tags.length > 0) {
        const tagConditions = tags.map(() => "LOWER(e.prompt) LIKE ?");
        whereConditions.push(`(${tagConditions.join(" OR ")})`);
        args.push(...tags.map(tag => `%${tag.toLowerCase()}%`));
      }

      // Add date range filter
      if (dateRange) {
        let dateCondition = "";
        switch (dateRange) {
          case "week":
            dateCondition = "e.created_at >= datetime('now', '-7 days')";
            break;
          case "month":
            dateCondition = "e.created_at >= datetime('now', '-30 days')";
            break;
          case "year":
            dateCondition = "e.created_at >= datetime('now', '-365 days')";
            break;
        }
        if (dateCondition) {
          whereConditions.push(dateCondition);
        }
      }

      // Add WHERE clause
      if (whereConditions.length > 0) {
        essaysSql += " WHERE " + whereConditions.join(" AND ");
      }

      essaysSql += " GROUP BY e.id";

      // Add rating filter
      if (minRating > 0) {
        essaysSql += " HAVING avg_rating >= ?";
        args.push(minRating);
      }

      // Add ordering
      essaysSql += " ORDER BY e.updated_at DESC";

      // Add limit for performance
      essaysSql += " LIMIT 100";

      console.log('Executing essay search with SQL:', essaysSql);
      console.log('Args:', args);

      const essaysResult = await db.execute({ sql: essaysSql, args });
      
      const filteredEssays = essaysResult.rows.map(row => ({
        id: row.id,
        title: row.title,
        content: row.content,
        wordCount: row.word_count,
        college: row.college,
        prompt: row.prompt,
        visibility: row.visibility,
        status: row.status,
        author: row.display_name || row.username || 'Anonymous',
        ratingCount: Number(row.rating_count),
        avgRating: row.avg_rating ? Number(row.avg_rating) : 0,
        commentCount: Number(row.comment_count),
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));

      results.essays = filteredEssays;
    }

    if (type === "users" || type === "all") {
      let usersSql = "";
      let args: any[] = [];
      let whereConditions: string[] = [];

      // Base conditions - only show users with published essays
      whereConditions.push("EXISTS (SELECT 1 FROM essays e2 WHERE e2.author_id = p.id AND e2.status = 'published' AND e2.visibility = 'public' AND e2.is_deleted = 0)");

      // Search query
      if (query.trim()) {
        whereConditions.push("(p.username LIKE ? OR p.display_name LIKE ? OR p.bio LIKE ?)");
        args.push(`%${query}%`, `%${query}%`, `%${query}%`);
      }

      usersSql = `
        SELECT 
          p.id, p.username, p.display_name, p.bio, p.avatar_url, p.created_at,
          COUNT(DISTINCT e.id) as essays_count,
          COALESCE(COUNT(DISTINCT f.follower_id), 0) as followers_count,
          COALESCE(COUNT(DISTINCT f2.followee_id), 0) as following_count,
          AVG(r.score) as avg_rating
        FROM profiles p
        LEFT JOIN essays e ON p.id = e.author_id AND e.is_deleted = 0 AND e.status = 'published' AND e.visibility = 'public'
        LEFT JOIN follows f ON p.id = f.followee_id
        LEFT JOIN follows f2 ON p.id = f2.follower_id
        LEFT JOIN ratings r ON e.id = r.essay_id
      `;

      if (whereConditions.length > 0) {
        usersSql += " WHERE " + whereConditions.join(" AND ");
      }

      usersSql += " GROUP BY p.id ORDER BY p.created_at DESC LIMIT 50";

      const usersResult = await db.execute({ sql: usersSql, args });
      
      results.users = usersResult.rows.map(row => ({
        id: row.id,
        username: row.username,
        displayName: row.display_name,
        bio: row.bio,
        avatarUrl: row.avatar_url,
        essaysCount: Number(row.essays_count),
        followersCount: Number(row.followers_count),
        followingCount: Number(row.following_count),
        avgRating: row.avg_rating ? Number(row.avg_rating) : 0,
        joinDate: row.created_at
      }));
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ 
      error: "Failed to perform search",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
