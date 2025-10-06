import { Sparkles } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-3">
          <Sparkles className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Remixer</h1>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            Content Remixing Tool
          </span>
        </div>
        <p className="text-gray-600 mt-2">
          Transform your content with AI-powered remixing
        </p>
      </div>
    </header>
  )
}
