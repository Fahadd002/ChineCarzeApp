"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Film, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const PublicNavbar = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-zinc-950/60"
      >
        {/* Logo/Brand - Cinematic Treatment */}
        <Link
          href="/"
          className="group flex items-center gap-2"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="h-9 w-9 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/30"
          >
            <Film className="h-5 w-5 text-white fill-white" />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold hidden sm:block bg-gradient-to-r from-red-400 via-white to-purple-400 bg-clip-text text-transparent"
          >
            CineCraze
          </motion.span>
          <span className="text-xl font-bold sm:hidden text-white">CC</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          {[
            { href: "/", label: "Home" },
            { href: "/content", label: "Browse" },
            { href: "/about", label: "About" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors group"
            >
              <span className="relative z-10">{link.label}</span>
              {/* Animated underline */}
              <motion.div
                className="absolute bottom-0 left-1/2 right-1/2 h-0.5 bg-gradient-to-r from-red-500 to-purple-500"
                whileHover={{ left: 0, right: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2">
          {/* Login Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              onClick={() => router.push("/login")}
              className="text-foreground hover:bg-white/5 border border-transparent hover:border-white/10"
            >
              Login
            </Button>
          </motion.div>

          {/* Sign Up Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => router.push("/register")}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-0 shadow-lg shadow-red-500/30"
            >
              Sign Up
            </Button>
          </motion.div>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden ml-2 hover:bg-white/5"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed inset-0 z-40 pt-16 bg-zinc-950/95 backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col p-6 space-y-4">
            {[
              { href: "/", label: "Home" },
              { href: "/content", label: "Browse" },
              { href: "/about", label: "About" },
              { href: "/login", label: "Login" },
              { href: "/register", label: "Sign Up" },
            ].map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-lg font-medium transition-all",
                    link.label === "Sign Up"
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default PublicNavbar;