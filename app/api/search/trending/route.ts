import { type NextRequest, NextResponse } from "next/server"
import db, { checkDatabase, initDatabase } from '@/lib/db';

// Function to extract meaningful topic names from essay prompts
function extractTopicsFromPrompt(prompt: string): string[] {
  const topics: string[] = [];
  const lowerPrompt = prompt.toLowerCase();
  
  // Common essay categories and keywords
  const categoryKeywords = {
    'Personal Statement': ['personal statement', 'common app', 'college application', 'why this school'],
    'Leadership': ['leadership', 'leader', 'team captain', 'president', 'vice president', 'officer'],
    'Community Service': ['community service', 'volunteer', 'helping others', 'giving back', 'charity'],
    'Academic Achievement': ['academic', 'scholarship', 'honors', 'gpa', 'grades', 'achievement'],
    'Extracurricular': ['extracurricular', 'club', 'activity', 'sport', 'hobby', 'passion'],
    'Failure & Growth': ['failure', 'mistake', 'challenge', 'overcome', 'learn', 'growth'],
    'Cultural Identity': ['culture', 'heritage', 'identity', 'background', 'diversity', 'immigrant'],
    'Innovation': ['innovation', 'invention', 'creative', 'entrepreneur', 'startup', 'project'],
    'Social Impact': ['social impact', 'change', 'activism', 'advocacy', 'justice', 'equality'],
    'Family': ['family', 'parent', 'sibling', 'home', 'tradition', 'values'],
    'Travel': ['travel', 'abroad', 'international', 'culture', 'experience', 'adventure'],
    'Music & Arts': ['music', 'art', 'creative', 'performance', 'artist', 'musician'],
    'Science & Technology': ['science', 'technology', 'research', 'lab', 'experiment', 'discovery'],
    'Sports': ['sport', 'athlete', 'team', 'competition', 'training', 'coach'],
    'Writing': ['writing', 'author', 'story', 'narrative', 'poetry', 'journalism']
  };
  
  // Check for category matches
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
      topics.push(category);
    }
  }
  
  // Extract specific topics from common prompt patterns
  if (lowerPrompt.includes('why this major')) topics.push('Major Choice');
  if (lowerPrompt.includes('why this school')) topics.push('School Choice');
  if (lowerPrompt.includes('challenge') || lowerPrompt.includes('obstacle')) topics.push('Overcoming Challenges');
  if (lowerPrompt.includes('passion') || lowerPrompt.includes('interest')) topics.push('Personal Passion');
  if (lowerPrompt.includes('future') || lowerPrompt.includes('career')) topics.push('Future Goals');
  if (lowerPrompt.includes('influence') || lowerPrompt.includes('inspire')) topics.push('Influence & Inspiration');
  if (lowerPrompt.includes('change') || lowerPrompt.includes('impact')) topics.push('Making a Difference');
  if (lowerPrompt.includes('learning') || lowerPrompt.includes('education')) topics.push('Learning & Education');
  
  // If no specific topics found, try to extract from the prompt structure
  if (topics.length === 0) {
    // Look for question words and extract the main topic
    const questionMatch = prompt.match(/(?:what|how|why|when|where|tell|describe|explain)\s+(?:is|are|was|were|do|does|did|can|could|would|should)\s+(.+?)(?:\?|\.|$)/i);
    if (questionMatch) {
      const topic = questionMatch[1].trim();
      if (topic.length < 50) { // Only use if it's reasonably short
        topics.push(topic.charAt(0).toUpperCase() + topic.slice(1));
      }
    }
  }
  
  // Fallback: extract first few meaningful words
  if (topics.length === 0) {
    const words = prompt.split(/\s+/).slice(0, 3).join(' ');
    if (words.length < 30) {
      topics.push(words.charAt(0).toUpperCase() + words.slice(1));
    }
  }
  
  // Ensure we have at least one topic
  if (topics.length === 0) {
    topics.push('General Essay');
  }
  
  return topics;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") || "all"

  try {
    // Ensure database is initialized
    const isInitialized = await checkDatabase();
    if (!isInitialized) {
      console.log('Database not initialized, initializing now...');
      await initDatabase();
    }

    let result: any = {};

    if (type === "colleges" || type === "all") {
      // Get top colleges by essay count and average rating
      const collegesSql = `
        SELECT 
          e.college,
          COUNT(e.id) as essay_count,
          AVG(r.score) as avg_rating
        FROM essays e
        LEFT JOIN ratings r ON e.id = r.essay_id
        WHERE e.college IS NOT NULL 
          AND e.college != '' 
          AND e.status = 'published' 
          AND e.visibility = 'public'
          AND e.is_deleted = 0
        GROUP BY e.college
        HAVING essay_count >= 1
        ORDER BY essay_count DESC, avg_rating DESC
        LIMIT 10
      `;
      
      const collegesResult = await db.execute({ sql: collegesSql, args: [] });
      result.colleges = collegesResult.rows.map(row => ({
        college: row.college,
        essayCount: Number(row.essay_count),
        avgRating: row.avg_rating ? Number(row.avg_rating) : 0
      }));
    }

    if (type === "topics" || type === "all") {
      // Get popular topics by extracting meaningful categories from prompts
      const topicsSql = `
        SELECT 
          e.prompt as full_prompt,
          COUNT(e.id) as essay_count,
          AVG(r.score) as avg_rating
        FROM essays e
        LEFT JOIN ratings r ON e.id = r.essay_id
        WHERE e.prompt IS NOT NULL 
          AND e.prompt != '' 
          AND e.status = 'published' 
          AND e.visibility = 'public'
          AND e.is_deleted = 0
        GROUP BY e.prompt
        HAVING essay_count >= 1
        ORDER BY essay_count DESC, avg_rating DESC
        LIMIT 20
      `;
      
      const topicsResult = await db.execute({ sql: topicsSql, args: [] });
      
      // Extract meaningful topic names from prompts
      const topicMap = new Map<string, { count: number, rating: number }>();
      
      topicsResult.rows.forEach(row => {
        const prompt = row.full_prompt;
        const count = Number(row.essay_count);
        const rating = row.avg_rating ? Number(row.avg_rating) : 0;
        
        // Extract topic categories from prompts
        const topics = extractTopicsFromPrompt(prompt);
        
        topics.forEach(topic => {
          if (topicMap.has(topic)) {
            const existing = topicMap.get(topic)!;
            existing.count += count;
            existing.rating = (existing.rating + rating) / 2; // Average rating
          } else {
            topicMap.set(topic, { count, rating });
          }
        });
      });
      
      // Convert to array and sort by count
      result.topics = Array.from(topicMap.entries())
        .map(([tag, data]) => ({
          tag,
          essayCount: data.count,
          avgRating: data.rating
        }))
        .sort((a, b) => b.essayCount - a.essayCount)
        .slice(0, 10);
    }

    if (type === "writers" || type === "all") {
      // Get rising writers (users with recent activity and good ratings)
      const writersSql = `
        SELECT 
          p.id,
          p.username,
          p.display_name,
          COUNT(DISTINCT e.id) as essays_count,
          COALESCE(COUNT(DISTINCT f.follower_id), 0) as followers_count,
          AVG(r.score) as avg_rating,
          COUNT(CASE WHEN e.created_at >= datetime('now', '-30 days') THEN 1 END) as recent_essays
        FROM profiles p
        LEFT JOIN essays e ON p.id = e.author_id AND e.is_deleted = 0
        LEFT JOIN follows f ON p.id = f.followee_id
        LEFT JOIN ratings r ON e.id = r.essay_id
        WHERE e.status = 'published' AND e.visibility = 'public'
        GROUP BY p.id
        HAVING essays_count >= 1
        ORDER BY recent_essays DESC, avg_rating DESC, followers_count DESC
        LIMIT 10
      `;
      
      const writersResult = await db.execute({ sql: writersSql, args: [] });
      result.writers = writersResult.rows.map(row => ({
        id: row.id,
        username: row.username,
        displayName: row.display_name,
        essaysCount: Number(row.essays_count),
        followersCount: Number(row.followers_count),
        avgRating: row.avg_rating ? Number(row.avg_rating) : 0,
        recentEssays: Number(row.recent_essays)
      }));
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Trending data error:", error);
    return NextResponse.json({ error: "Failed to fetch trending data" }, { status: 500 });
  }
}
