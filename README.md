# PeerPen - College Essay Writing & AI Analysis Platform

PeerPen is a comprehensive platform for writing, editing, and analyzing college essays with AI-powered feedback, social features, and advanced content moderation.

## Features

- **Essay Editor**: Create, edit, and manage your essays with version control
- **AI Analysis**: Get detailed feedback on your writing using multiple AI models with rubric scoring
- **Social Platform**: Comment, rate, and interact with other essays
- **Advanced Search**: Full-text search across essays and users using SQLite FTS5
- **Content Moderation**: Built-in reporting and moderation system
- **User Management**: Profile verification, following system, and activity tracking
- **User Authentication**: Secure login with Clerk
- **Database Storage**: Persistent storage with Turso (SQLite)
- **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS

## Architecture

### Database Schema
The platform uses a comprehensive database schema designed for scalability and performance:

#### Core Tables
- **profiles**: User profiles with Clerk integration, verification, and social features
- **essays**: Essay content with versioning, visibility controls, and soft deletes
- **feedback**: AI and peer feedback with detailed rubric scoring
- **comments**: Nested comment system with moderation
- **ratings**: 1-5 star rating system for essays
- **tags**: Essay categorization and discovery
- **prompts**: Essay prompts and questions

#### Advanced Features
- **essay_versions**: Complete version history for essays with change tracking
- **evaluation_scores**: Detailed rubric scoring across 6 dimensions
- **follows**: User following system for social discovery
- **bookmarks**: User bookmarking system for favorite content
- **reports**: Content moderation system with admin review
- **moderation_actions**: Complete audit trail for moderation decisions

#### Search & Performance
- **essay_fts**: Full-text search using SQLite FTS5 with automatic indexing
- **Triggers**: Automatic synchronization of search index with content changes
- **Views**: Pre-computed aggregations for ratings and rubric scores
- **Indexes**: Optimized for common query patterns and performance

### Rubric Scoring System
AI analysis provides detailed scoring across multiple dimensions:
- **Flow** (0-10): Logical progression and coherence
- **Hook** (0-10): Engaging opening and narrative pull  
- **Voice** (0-10): Authentic personal expression
- **Uniqueness** (0-10): Original perspective and insights
- **Conciseness** (0-10): Efficient use of words
- **Authenticity** (0-10): Genuine personal voice

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Turso Database
TURSO_DATABASE_URL=your_turso_database_url_here
TURSO_AUTH_TOKEN=your_turso_auth_token_here

# OpenRouter API (for AI analysis)
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Site URL (optional, defaults to localhost:3000)
SITE_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Database Setup

The database schema is automatically created when you first use the app. The schema includes:

- **User Management**: Profiles, verification, following system
- **Content Management**: Essays, versions, comments, ratings
- **AI Integration**: Feedback, rubric scoring, analysis tracking
- **Moderation**: Reporting, admin actions, audit trails
- **Search**: Full-text search with automatic indexing
- **Performance**: Optimized views, indexes, and triggers

### 4. Run the Development Server

```bash
pnpm dev
```

## API Endpoints

### Essays
- `POST /api/essays` - Create new essay
- `GET /api/essays` - List essays with filtering and pagination
- `PUT /api/essays/[id]` - Update essay
- `DELETE /api/essays/[id]` - Soft delete essay

### Analysis & Feedback
- `POST /api/essays/[id]/analyze` - AI-powered essay analysis with rubric scoring

### Social Features
- `POST /api/essays/[id]/comments` - Add comment to essay
- `GET /api/essays/[id]/comments` - Get comments for essay
- `POST /api/essays/[id]/like` - Rate essay (1-5 stars)

### Search & Discovery
- `GET /api/search` - Full-text search across essays and users
- Supports filtering by status, visibility, and rating

### Admin & Moderation
- `GET /api/admin/users` - List users with moderation tools
- `PATCH /api/admin/users` - Moderate users (verify, ban, etc.)
- `GET /api/admin/reports` - List content reports
- `PATCH /api/admin/reports` - Handle reports (approve, reject, review)

## Key Features

### Content Management
- **Version Control**: Track all changes to essays with change notes
- **Visibility Controls**: Public, followers-only, or private essays
- **Soft Deletes**: Content is marked as deleted rather than permanently removed
- **Moderation**: Built-in reporting and admin review system

### AI Analysis
- **Multiple Models**: Fallback system with multiple AI providers
- **Rubric Scoring**: Detailed feedback across 6 dimensions
- **Analysis History**: Track all AI feedback and improvements
- **Model Auditing**: Record which AI model provided each analysis

### Social Platform
- **Comments**: Nested comment system with moderation
- **Ratings**: 1-5 star rating system for essays
- **Following**: User following system for content discovery
- **Bookmarks**: Save favorite essays for later reading

### Search & Discovery
- **Full-Text Search**: Search across essay titles and content
- **User Search**: Find users by username, display name, or bio
- **Filtering**: Filter by status, visibility, rating, and more
- **Ranking**: Relevance-based search results

### Moderation & Safety
- **Content Reporting**: Users can report inappropriate content
- **Admin Review**: Comprehensive admin tools for content moderation
- **Audit Trails**: Complete history of all moderation actions
- **Automatic Actions**: Content removal for approved reports

## Development Notes

- **Database**: Turso (SQLite) with FTS5 for search and comprehensive schema
- **Authentication**: Clerk integration for secure user management
- **AI Analysis**: OpenRouter API integration with multiple AI models
- **Search**: Full-text search with automatic indexing and synchronization
- **Moderation**: Built-in content moderation with admin tools
- **Performance**: Optimized queries, views, and indexing for scale
- **Security**: Foreign key constraints, soft deletes, and audit trails

## Contributing

This is a comprehensive platform designed for production use. The database schema supports:
- Large-scale user management
- Advanced content moderation
- Comprehensive audit trails
- High-performance search
- Scalable social features

## License

This project is licensed under the MIT License.
