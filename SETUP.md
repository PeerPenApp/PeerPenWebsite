# Quick Setup Guide

## 1. Environment Variables

Create a `.env.local` file in your project root:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Turso Database
TURSO_DATABASE_URL=libsql://your-database-name.turso.io
TURSO_AUTH_TOKEN=your_auth_token_here

# OpenRouter API (for AI analysis)
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Site URL (optional)
SITE_URL=http://localhost:3000
```

## 2. Database Setup

The database will be automatically initialized when you first use the app, but you can also manually initialize it:

### Option A: Automatic Initialization
- The app will automatically create tables when you first try to create an essay
- Tables are created with proper Clerk user linking and indexes

### Option B: Manual Initialization
- Visit `/dashboard` and click the "Initialize" button in the Database Status card
- Or make a POST request to `/api/init-db`

### Database Schema
The app automatically creates a comprehensive schema including:

#### Core Tables
- **profiles**: User profiles with Clerk integration
- **essays**: Essay content with versioning and visibility controls
- **feedback**: AI and peer feedback with rubric scoring
- **comments**: Nested comment system
- **ratings**: 1-5 star rating system
- **tags**: Essay categorization
- **prompts**: Essay prompts and questions

#### Advanced Features
- **essay_versions**: Complete version history for essays
- **evaluation_scores**: Detailed rubric scoring (flow, hook, voice, uniqueness, conciseness, authenticity)
- **follows**: User following system
- **bookmarks**: User bookmarking system
- **reports**: Content moderation system
- **moderation_actions**: Audit trail for moderation

#### Search & Performance
- **essay_fts**: Full-text search using SQLite FTS5
- **Automatic triggers**: Keep search index in sync
- **Optimized views**: Pre-computed aggregations for ratings and rubric scores

#### Key Features
- **Soft deletes**: Content is marked as deleted rather than permanently removed
- **Foreign key constraints**: Maintains data integrity
- **Comprehensive indexing**: Optimized for common query patterns
- **Audit trails**: Track all moderation and content changes

## 3. Install Dependencies

```bash
pnpm install
```

## 4. Run the Development Server

```bash
pnpm dev
```

## 5. Database Features

### Full-Text Search
The platform includes powerful full-text search capabilities:
- Search across essay titles and content
- Automatic indexing and synchronization
- Ranking based on relevance

### Rubric Scoring
AI analysis provides detailed scoring across multiple dimensions:
- **Flow**: Logical progression and coherence
- **Hook**: Engaging opening and narrative pull
- **Voice**: Authentic personal expression
- **Uniqueness**: Original perspective and insights
- **Conciseness**: Efficient use of words
- **Authenticity**: Genuine personal voice

### Content Moderation
Built-in moderation system:
- User reporting for inappropriate content
- Admin review and action system
- Audit trail for all moderation decisions
- Automatic content removal for approved reports

### User Management
Comprehensive user system:
- Profile verification system
- Following/follower relationships
- Activity tracking
- Notification system

## 6. API Endpoints

### Essays
- `POST /api/essays` - Create new essay
- `GET /api/essays` - List essays with filtering
- `PUT /api/essays/[id]` - Update essay
- `DELETE /api/essays/[id]` - Soft delete essay

### Analysis
- `POST /api/essays/[id]/analyze` - AI-powered essay analysis

### Social Features
- `POST /api/essays/[id]/comments` - Add comment
- `GET /api/essays/[id]/comments` - Get comments
- `POST /api/essays/[id]/like` - Rate essay (1-5 stars)

### Search
- `GET /api/search` - Full-text search across essays and users

### Admin
- `GET /api/admin/users` - List users with moderation tools
- `PATCH /api/admin/users` - Moderate users
- `GET /api/admin/reports` - List content reports
- `PATCH /api/admin/reports` - Handle reports

## 7. Development Notes

- **Database**: Uses Turso (SQLite) with FTS5 for search
- **Authentication**: Clerk integration for user management
- **AI Analysis**: OpenRouter API integration for multiple AI models
- **Search**: Full-text search with automatic indexing
- **Moderation**: Built-in content moderation system
- **Performance**: Optimized queries with proper indexing
