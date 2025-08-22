<p align="center">
  <img src="assets/gh-banner.png" alt="Cannonbal Theme Banner">
</p>

<br/>
<div align="center">
  <a href="https://twitter.com/littlesticksdev">
  <img src="assets/twitter-badge.svg" alt="Follow Little Sticks on Twitter"/>
</a>
  <a href="https://littlesticks.lemonsqueezy.com/checkout/buy/ce15f246-6ffb-417d-b380-0745aeef69a9">
    <img src="assets/sponsor-badge.svg" alt="Sponsor This Repo" />
  </a>
  <a href="https://littlesticks.dev/discord">
    <img src="assets/discord-badge.svg" alt="Join our Discord" />
  </a>
  
</div>
<br/>

# PeerPen

A web platform for writing, sharing, reviewing, and improving college essays with peer feedback and AI analysis.

## Features

- ✍️ Rich text editor for essay writing
- 👥 Peer review system with rubric scoring
- 🤖 AI-powered essay analysis
- 📊 User profiles and karma system
- 🚨 Content moderation tools
- 📱 Instagram-style responsive design

## Tech Stack

- **Frontend**: Astro + React + TailwindCSS
- **Backend**: Node.js with Astro SSR
- **Database**: Turso (libSQL)
- **AI**: OpenRouter with comprehensive backup model system including GPT-OSS-20B, GLM-4.5 Air, Kimi K2, Claude 3.5, and 15+ other models
- **Analytics**: PostHog
- **Monitoring**: Sentry
- **Rate Limiting**: Upstash Redis

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   # Database
   TURSO_DATABASE_URL=your_turso_db_url
   TURSO_AUTH_TOKEN=your_turso_auth_token
   
   # AI
   OPENROUTER_API_KEY=your_openrouter_api_key
   SITE_URL=your_site_url
   
   # Optional
   UPSTASH_REDIS_REST_URL=your_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_redis_token
   SENTRY_DSN=your_sentry_dsn
   ```

3. **Initialize database**
   ```bash
   # First time setup - creates all tables
   curl -X POST http://localhost:4321/api/init-db
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## Database Setup

The app uses Turso (libSQL) for the database. On first run, you must initialize the database schema by calling the `/api/init-db` endpoint. This creates all necessary tables:

- `users` - User accounts and profiles
- `essays` - Essay metadata
- `essay_versions` - Essay content versions
- `reviews` - Peer reviews
- `review_scores` - Rubric scores
- `comments` - Comments on essays/reviews
- `votes` - Upvotes/downvotes
- `notifications` - User notifications
- `reports` - Content moderation reports

## API Endpoints

- `POST /api/auth/signup` - User registration
- `GET /api/essays` - List essays
- `POST /api/essays` - Create essay
- `POST /api/reviews` - Submit review
- `POST /api/ai/analyze` - AI essay analysis
- `GET /api/notifications` - User notifications
- `GET /api/moderation/reports` - Moderation reports

## AI Analysis System

The platform uses OpenRouter to access multiple AI models for essay analysis, with automatic fallback to ensure reliability:

### Primary Models (High Quality)
- **OpenAI**: GPT-OSS-20B
- **Z.AI**: GLM-4.5 Air  
- **MoonshotAI**: Kimi K2
- **TNG**: DeepSeek R1T2 Chimera
- **Mistral**: Mistral Small 3.2 24B

### Flexible Models (Instruction-Tuned)
- **Venice**: Uncensored (Mistral 24B Venice Edition)
- **Tencent**: Hunyuan A13B Instruct
- **Qwen**: Qwen3 Coder
- **Anthropic**: Claude 3.5 Sonnet & Haiku

### Long-Context Models (Essay-Friendly)
- **Google**: Gemma 3N 2B & Gemini 1.5 Flash
- **DeepSeek**: V3
- **Mistral**: Mixtral 8x22B
- **MoonshotAI**: Kimi K1.5

### Fallback System
If all AI models fail, the system provides enhanced basic analysis including:
- Word count, character count, sentence/paragraph analysis
- Readability metrics and writing tips
- Manual review checklist
- Troubleshooting guidance for API issues

The system automatically tries models in priority order and gracefully degrades to ensure users always receive helpful feedback.

## Development

- **Port**: 4321 (or next available)
- **Database**: Local SQLite file (`./dev.db`) in development
- **Hot reload**: Enabled for all file changes
- **TypeScript**: Full type safety with Astro

## Deployment

The app is configured for Vercel deployment with the Node.js adapter. The build output is in `dist/` and includes both client and server bundles.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
