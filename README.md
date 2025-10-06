# Remixer - Content Remixing Tool

A modern React application for remixing content using AI. Paste in text, choose a remix type, and get transformed content instantly.

## Features

1. ✅ Paste in text we want to remix
2. ✅ Click a button to apply the remixing we want for it
3. ✅ Send the request to an AI API endpoint (Claude)
4. ✅ See the remix in an output box
5. ✅ Modern, responsive UI with TailwindCSS
6. ✅ Multiple remix types (summarize, expand, simplify, creative, formal, casual)
7. ✅ Copy and download functionality
8. ✅ Error handling and loading states
9. ✅ Mock API for development

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Deployment**: Vercel
- **AI API**: Claude API

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Claude API key from [Anthropic](https://console.anthropic.com/) (optional for development)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Claude API key (optional for development):
   ```
   VITE_CLAUDE_API_KEY=your_claude_api_key_here
   VITE_USE_MOCK_API=true
   ```

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
│   ├── Header.jsx      # App header with branding
│   ├── InputSection.jsx # Text input area with character count
│   ├── OutputSection.jsx # Results display with loading/error states
│   └── RemixControls.jsx # Controls and remix types
├── services/           # API services
│   └── api.js         # Claude API integration + mock functions
├── App.jsx            # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles with TailwindCSS
```

## Remix Types

- **Summarize**: Create a concise summary
- **Expand**: Add more detail and context
- **Simplify**: Make it easier to understand
- **Creative Rewrite**: Add creative flair
- **Formal Tone**: Make it more professional
- **Casual Tone**: Make it more conversational

## Upcoming Features

1. Add in another AI API (OpenAI, etc.)
2. Add a way to upload audio files to have them transcribed
3. Click to tweet or to schedule a tweet from the output
4. Add a way to save the remixed output to a database
5. User authentication and saved remixes
6. Batch processing
7. Custom remix templates
8. History of remixes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
