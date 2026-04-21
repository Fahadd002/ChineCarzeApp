"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PublicNavbar = () => {
  const router = useRouter();

  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b bg-background">
      {/* Logo/Brand */}
      <Link href="/" className="text-xl font-bold">
        CineCraze
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center space-x-6">
        <Link href="/" className="text-sm font-medium hover:text-primary">
          Home
        </Link>
        <Link href="/browse" className="text-sm font-medium hover:text-primary">
          Browse
        </Link>
        <Link href="/about" className="text-sm font-medium hover:text-primary">
          About
        </Link>
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" onClick={() => router.push("/login")}>
          Login
        </Button>
        <Button onClick={() => router.push("/register")}>
          Sign Up
        </Button>
      </div>
    </nav>
  );
};

export default PublicNavbar;