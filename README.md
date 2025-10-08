# Remixer - Content Remixing Tool

A modern React application for remixing content using AI. Paste in text, choose a remix type, and get transformed content instantly.

## Features

1. ✅ Generate engaging tweets from any content using AI
2. ✅ Get 6 tweet variations instantly
3. ✅ One-click tweet posting to X/Twitter
4. ✅ Copy individual or all tweets to clipboard
5. ✅ **Save tweets to online database (Supabase)**
6. ✅ **View saved tweets in persistent sidebar**
7. ✅ Delete saved tweets
8. ✅ Modern, dark UI with TailwindCSS
9. ✅ Responsive design
10. ✅ Error handling and loading states
11. ✅ Mock API for development

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **AI API**: Anthropic Claude API
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Anthropic API key from [Anthropic](https://console.anthropic.com/)
- (Optional) Supabase account for saving tweets - see [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Create a `.env.local` file in the project root:
   ```bash
   # Required for AI tweet generation
   VITE_ANTHROPIC_API_KEY=your-anthropic-api-key-here
   VITE_USE_MOCK_API=false
   
   # Optional: For saving tweets to database
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
   
   **Database Setup**: To enable tweet saving, follow the detailed guide in [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

### Development

- **Mock API**: Set `VITE_USE_MOCK_API=true` in `.env` to use mock responses for development
- **Build**: `npm run build` creates production build
- **Preview**: `npm run preview` serves production build locally

## Project Structure

```
src/
├── components/          # React components
│   ├── SavedTweets.tsx # Sidebar for viewing saved tweets
│   └── (other legacy components)
├── services/           # API services
│   ├── api.ts         # Anthropic Claude API integration
│   └── supabase.ts    # Supabase database operations
├── types/             # TypeScript type definitions
│   └── index.ts       # App-wide types
├── App.tsx            # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles with TailwindCSS
```

## How to Use

1. **Paste Content**: Enter any text, article, or idea into the input box
2. **Generate Tweets**: Click "Generate Tweets" to create 6 AI-powered tweet variations
3. **Review & Edit**: Browse the generated tweets, each optimized for Twitter
4. **Take Action**:
   - 🐦 **Tweet**: Post directly to X/Twitter
   - 📋 **Copy**: Copy to clipboard
   - 💾 **Save**: Save to database (if configured)
5. **View Saved**: Access all saved tweets in the right sidebar
6. **Manage**: Delete unwanted tweets or copy/tweet saved ones anytime

## Database Features (Optional)

When configured with Supabase:
- ✅ Persistent storage of generated tweets
- ✅ View all saved tweets in the sidebar
- ✅ Delete tweets you no longer need
- ✅ Timestamps for each saved tweet
- ✅ Character count tracking
- ✅ Original content reference

**Setup Guide**: See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for a beginner-friendly, step-by-step database setup guide.

## Upcoming Features

1. User authentication with Supabase Auth
2. Multiple AI provider support (OpenAI, etc.)
3. Audio file transcription
4. Tweet scheduling
5. Batch processing
6. Custom tweet templates
7. Tweet analytics and performance tracking
8. Export saved tweets to CSV/JSON

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
