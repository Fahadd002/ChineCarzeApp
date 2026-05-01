import React from "react";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Glass Morphism Container */}
          <div className="rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 p-8 md:p-12 shadow-2xl">
            {/* Loading Animation */}
            <div className="mb-8 flex justify-center">
              <div className="relative w-24 h-24">
                {/* Outer rotating ring */}
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-500 border-r-pink-500 animate-spin"></div>
                {/* Middle rotating ring with delay */}
                <div 
                  className="absolute inset-2 rounded-full border-4 border-transparent border-b-blue-500 border-l-purple-500 animate-spin" 
                  style={{ animationDirection: "reverse", animationDelay: "0.5s" }}
                ></div>
                {/* Inner pulsing circle */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 animate-pulse"></div>
              </div>
            </div>

            {/* Loading Text */}
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Loading Your Experience
              </h2>
              <p className="text-gray-300 text-base">
                Preparing the best entertainment for you...
              </p>

              {/* Loading Progress */}
              <div className="mt-8 space-y-3">
                {/* Skeleton 1 */}
                <div className="h-4 bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-full animate-pulse"></div>
                {/* Skeleton 2 */}
                <div className="h-4 bg-gradient-to-r from-gray-600/50 to-gray-700/50 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                {/* Skeleton 3 */}
                <div className="h-4 bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <p className="text-xs text-gray-400">
                CineCraze is preparing your streaming experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
