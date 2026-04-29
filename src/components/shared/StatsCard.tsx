"use client";

import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "@/lib/utils";
import { createElement } from "react";
import { Card, CardContent } from "../ui/card";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { useEffect } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  iconName: string;
  description?: string;
  className?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  glowColor?: 'red' | 'blue' | 'purple' | 'emerald';
}

const StatsCard = ({
  title,
  value,
  iconName,
  description,
  className,
  trend,
  glowColor = 'red'
}: StatsCardProps) => {
  const numericValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 1500, bounce: 0 });

  useEffect(() => {
    motionValue.set(numericValue);
  }, [numericValue, motionValue]);

  // Glow color mapping
  const glowStyles = {
    red: "from-red-500/20 to-transparent border-red-500/20 text-red-400 bg-red-500/10",
    blue: "from-blue-500/20 to-transparent border-blue-500/20 text-blue-400 bg-blue-500/10",
    purple: "from-purple-500/20 to-transparent border-purple-500/20 text-purple-400 bg-purple-500/10",
    emerald: "from-emerald-500/20 to-transparent border-emerald-500/20 text-emerald-400 bg-emerald-500/10",
  };

  const iconBgColors = {
    red: "bg-red-500/20 text-red-400",
    blue: "bg-blue-500/20 text-blue-400",
    purple: "bg-purple-500/20 text-purple-400",
    emerald: "bg-emerald-500/20 text-emerald-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 15 } }}
    >
      <Card
        className={cn(
          "relative overflow-hidden rounded-2xl border transition-all duration-500 group",
          "bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 backdrop-blur-sm",
          "border-white/5 hover:border-white/10 hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)]",
          "before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none",
          className
        )}
      >
        {/* Ambient glow on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, var(--glow-${glowColor}))`,
            filter: 'blur(20px)',
          }}
        />

        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between">
            {/* Left: Title and Value */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                {title}
                {trend && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      trend.isPositive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    )}
                  >
                    {trend.isPositive ? "+" : ""}{trend.value}%
                  </motion.span>
                )}
              </p>

              {/* Animated counter */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold tracking-tight"
              >
                <motion.span
                  key={value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "bg-gradient-to-r bg-clip-text text-transparent",
                    glowColor === 'red' ? 'from-red-400 to-rose-300' :
                    glowColor === 'blue' ? 'from-blue-400 to-cyan-300' :
                    glowColor === 'purple' ? 'from-purple-400 to-pink-300' :
                    'from-emerald-400 to-teal-300'
                  )}
                >
                  {typeof value === 'number' && value > 1000
                    ? value.toLocaleString()
                    : value}
                </motion.span>
              </motion.div>

              {description && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xs text-muted-foreground"
                >
                  {description}
                </motion.p>
              )}
            </div>

            {/* Right: Icon with glow */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className={cn(
                "h-14 w-14 rounded-2xl flex items-center justify-center",
                "ring-2 ring-white/5 shadow-lg",
                iconBgColors[glowColor]
              )}
            >
              {createElement(getIconComponent(iconName), {
                className: "w-7 h-7"
              })}
            </motion.div>
          </div>

          {/* Bottom gradient line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            className={cn(
              "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r",
              glowColor === 'red' ? 'from-red-500 via-rose-500 to-transparent' :
              glowColor === 'blue' ? 'from-blue-500 via-cyan-500 to-transparent' :
              glowColor === 'purple' ? 'from-purple-500 via-pink-500 to-transparent' :
              'from-emerald-500 via-teal-500 to-transparent'
            )}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;