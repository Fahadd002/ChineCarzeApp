"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavSection } from "@/types/dashboard.types";
import { UserInfo } from "@/types/user.types";
import { Menu, Search, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardMobileSidebar from "./DashboardMobileSidebar";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";
import { motion } from "framer-motion";

interface DashboardNavbarProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string
}

const DashboardNavbarContent = ({ dashboardHome, navItems, userInfo }: DashboardNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSmallerScreen = () => {
      setIsMobile(window.innerWidth < 768);
    }

    checkSmallerScreen();
    window.addEventListener("resize", checkSmallerScreen);

    return () => {
      window.removeEventListener("resize", checkSmallerScreen);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-30 flex items-center gap-4 w-full px-4 md:px-6 py-3 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-zinc-950/60 shadow-sm"
    >
      {/* Mobile Menu Toggle */}
      <Sheet open={isOpen && isMobile} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              className="border-white/10 bg-zinc-900/50 hover:bg-zinc-800"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </motion.div>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-64 p-0 bg-zinc-950/95 backdrop-blur-xl border-white/10"
        >
          <DashboardMobileSidebar userInfo={userInfo} dashboardHome={dashboardHome} navItems={navItems} />
        </SheetContent>
      </Sheet>

      {/* Search Bar */}
      <div className="flex-1 flex items-center max-w-md">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative w-full hidden sm:block group"
        >
          {/* Glow effect on focus */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500/10 via-purple-500/10 to-blue-500/10 blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10" />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-red-500 transition-colors" />
          <Input
            type="text"
            placeholder="Search anything..."
            className="pl-10 pr-4 h-10 bg-zinc-950/50 border-white/10 focus:border-red-500/50 focus:ring-red-500/20 rounded-lg transition-all"
          />
          {/* Search hint icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
            <Sparkles className="h-4 w-4 text-red-500" />
          </div>
        </motion.div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2">
        {/* Notification Dropdown */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <NotificationDropdown />
        </motion.div>

        {/* User Dropdown */}
        <UserDropdown userInfo={userInfo} />
      </div>
    </motion.div>
  );
};

export default DashboardNavbarContent;