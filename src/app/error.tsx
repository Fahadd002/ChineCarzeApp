"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
        <div className="max-w-2xl mx-auto">
          {/* Glass Morphism Container */}
          <div className="rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 p-8 md:p-12 shadow-2xl">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-full p-4 md:p-6">
                  <AlertTriangle className="w-12 h-12 md:w-16 md:h-16 text-red-400" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* Error Content */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 bg-gradient-to-r from-red-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                Oops! Something Went Wrong
              </h1>
              <p className="text-lg text-gray-300 mb-4">
                We encountered an unexpected error while processing your request.
              </p>
              {error.message && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-300 font-mono">
                    {error.message}
                  </p>
                </div>
              )}
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">Error ID: {error.digest}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => reset()}
                className="group flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold transition-all duration-300 hover:from-red-600 hover:to-pink-600 hover:shadow-lg hover:shadow-red-500/50 active:scale-95"
              >
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                Try Again
              </button>
              <Link
                href="/"
                className="px-6 md:px-8 py-3 md:py-4 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 text-white font-semibold transition-all duration-300 hover:bg-white/10 hover:border-white/20 active:scale-95"
              >
                Go to Home
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <p className="text-center text-sm text-gray-400">
                If the problem persists, please contact our support team or try again later.
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
