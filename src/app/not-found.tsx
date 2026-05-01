import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-cyan-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Glass Morphism Container */}
          <div className="rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 p-8 md:p-12 shadow-2xl">
            {/* 404 Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-full p-4 md:p-6">
                  <div className="text-5xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">404</div>
                </div>
              </div>
            </div>

            {/* Not Found Content */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Page Not Found
              </h1>
              <p className="text-lg text-gray-300 mb-2">
                We could not find the page you  are looking for.
              </p>
              <p className="text-sm text-gray-400">
                The content might have been moved, deleted, or never existed. Lets get you back on track.
              </p>
            </div>

            {/* Search Suggestion */}
            <div className="mb-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 text-blue-300">
                <Search className="w-4 h-4" />
                <p className="text-sm">Try using the search feature or explore our library</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/"
                className="group flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold transition-all duration-300 hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg hover:shadow-blue-500/50 active:scale-95"
              >
                Back to Home
              </Link>
              <Link
                href="/content"
                className="px-6 md:px-8 py-3 md:py-4 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 text-white font-semibold transition-all duration-300 hover:bg-white/10 hover:border-white/20 active:scale-95"
              >
                Browse Content
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <p className="text-center text-sm text-gray-400">
                Need help? Contact our support team or explore our featured content
              </p>
            </div>
          </div>

          {/* Decorative Footer */}
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>© CineCraze - Your Entertainment Destination</p>
          </div>
        </div>
      </div>
    </div>
  );
}
