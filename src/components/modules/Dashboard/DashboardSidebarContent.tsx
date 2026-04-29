"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getIconComponent } from "@/lib/iconMapper"
import { cn } from "@/lib/utils"
import { NavSection } from "@/types/dashboard.types"
import { UserInfo } from "@/types/user.types"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

interface DashboardSidebarContentProps {
  userInfo: UserInfo,
  navItems: NavSection[],
  dashboardHome: string,
}

const DashboardSidebarContent = ({ dashboardHome, navItems, userInfo }: DashboardSidebarContentProps) => {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="hidden md:flex h-full w-64 flex-col border-r border-white/5 bg-zinc-950/80 backdrop-blur-xl"
    >
      {/* Logo / Brand with glass effect */}
      <div className="flex h-16 items-center border-b border-white/5 px-6 bg-gradient-to-r from-zinc-900/50 to-transparent">
        <Link href={dashboardHome} className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/30"
          >
            <span className="text-sm font-bold text-white">CC</span>
          </motion.div>
          <span className="text-lg font-bold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
            CineCraze
          </span>
        </Link>
      </div>

      {/* Navigation Area */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {navItems.map((section, sectionId) => (
            <div key={sectionId}>
              {section.title && (
                <motion.h4
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2"
                >
                  <span className="h-px w-4 bg-white/20" />
                  {section.title}
                  <span className="h-px flex-1 bg-white/20" />
                </motion.h4>
              )}

              <div className="space-y-1">
                {section.items.map((item, id) => {
                  const isActive = pathname === item.href;
                  const Icon = getIconComponent(item.icon);

                  return (
                    <Link
                      href={item.href}
                      key={id}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative group",
                        isActive
                          ? "bg-gradient-to-r from-red-600/20 to-purple-600/20 text-white border border-red-500/20"
                          : "text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent"
                      )}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-red-500 to-purple-500 rounded-r-full"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}

                      {/* Icon with hover effect */}
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={cn(
                          "flex items-center justify-center",
                          isActive ? "text-red-400" : "text-gray-400 group-hover:text-white"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </motion.div>

                      <span>{item.title}</span>

                      {/* Glass reflection on hover */}
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.2 }}
                      />
                    </Link>
                  );
                })}
              </div>

              {sectionId < navItems.length - 1 && (
                <Separator className="my-4 bg-white/5" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Info At Bottom - Premium styling */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="border-t border-white/5 px-4 py-4 bg-gradient-to-r from-zinc-900/50 to-transparent"
      >
        <div className="flex items-center gap-3">
          {/* Avatar with glow */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-red-500/20 to-purple-500/20 border border-white/10"
          >
            <span className="text-sm font-bold text-white">
              {userInfo.name.charAt(0).toUpperCase()}
            </span>
            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-zinc-950" />
          </motion.div>

          <div className="flex-1 overflow-hidden min-w-0">
            <p className="text-sm font-semibold truncate text-foreground">
              {userInfo.name}
            </p>
            <p className="text-xs text-muted-foreground capitalize flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              {userInfo.role.toLocaleLowerCase().replace("_", " ")}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.aside>
  );
};

export default DashboardSidebarContent;