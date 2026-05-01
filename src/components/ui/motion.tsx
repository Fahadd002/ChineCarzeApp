'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import * as React from 'react';

// AnimatedCard with floating hover effect
interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  hoverScale?: number;
  glowColor?: 'red' | 'blue' | 'purple' | 'none';
  borderGlow?: boolean;
  className?: string;
}

export function AnimatedCard({
  children,
  hoverScale = 1.02,
  glowColor = 'none',
  borderGlow = false,
  className,
  ...props
}: AnimatedCardProps) {
  const glowStyles = {
    red: 'var(--glow-red)',
    blue: 'var(--glow-blue)',
    purple: 'var(--glow-purple)',
    none: undefined,
  };

  const borderGlowClass = borderGlow
    ? glowColor !== 'none'
      ? `shadow-[${glowStyles[glowColor]}]`
      : 'shadow-glow'
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: hoverScale,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
        opacity: { duration: 0.3 },
      }}
      className={cn(
        'rounded-2xl bg-gradient-to-b from-zinc-900/95 to-zinc-900/80 backdrop-blur-sm',
        'border border-white/5 shadow-card transition-all duration-500',
        'group relative overflow-hidden',
        borderGlowClass,
        className
      )}
      {...props}
    >
      {/* Gradient overlay on hover */}
      {glowColor !== 'none' && (
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${glowStyles[glowColor]})`,
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* Focus ring for accessibility */}
      <motion.div
        className="absolute inset-0 rounded-2xl ring-2 ring-primary/0 opacity-0"
        whileHover={{ opacity: 0.3 }}
        transition={{ duration: 0.2 }}
      />

      {children}
    </motion.div>
  );
}

// AnimatedButton with multiple variants
interface AnimatedButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'ghost' | 'outline' | 'gradient' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  glowColor?: 'red' | 'blue' | 'purple';
  className?: string;
  disabled?: boolean;
  [key: string]: unknown;
}

export function AnimatedButton({
  children,
  variant = 'default',
  size = 'md',
  isLoading = false,
  glowColor = 'red',
  className,
  disabled,
  ...buttonProps
}: AnimatedButtonProps) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    default:
      'bg-zinc-900 text-white hover:bg-zinc-800 border border-white/10',
    ghost:
      'hover:bg-white/5 text-foreground border border-transparent',
    outline:
      'border border-white/20 bg-transparent hover:bg-white/5',
    gradient:
      'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 border-none shadow-lg',
    glow:
      'bg-zinc-950 text-white border border-white/10 hover:shadow-glow',
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm rounded-lg',
    md: 'h-10 px-4 text-sm rounded-lg',
    lg: 'h-12 px-6 text-base rounded-xl',
  };

  const glowEffect = {
    red: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.4),0_0_40px_rgba(239,68,68,0.2)]',
    blue: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.4),0_0_40px_rgba(59,130,246,0.2)]',
    purple: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.4),0_0_40px_rgba(168,85,247,0.2)]',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        variant === 'glow' && glowEffect[glowColor],
        className
      )}
      disabled={disabled || isLoading}
      {...buttonProps}
    >
      {isLoading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
        />
      ) : null}
      {children}
    </motion.button>
  );
}

// MotionWrapper for page transitions
interface MotionWrapperProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function MotionWrapper({
  children,
  className,
  delay = 0,
  ...props
}: MotionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Staggered container for lists
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
}: StaggerContainerProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div variants={item}>{child}</motion.div>
      ))}
    </motion.div>
  );
}

// FloatingOrb background decoration
interface FloatingOrbProps {
  className?: string;
  color?: 'red' | 'blue' | 'purple' | 'mixed';
  size?: 'sm' | 'md' | 'lg';
}

export function FloatingOrb({ className, color = 'mixed', size = 'md' }: FloatingOrbProps) {
  const gradients = {
    red: 'from-red-600/20 to-transparent',
    blue: 'from-blue-600/20 to-transparent',
    purple: 'from-purple-600/20 to-transparent',
    mixed: 'from-red-600/10 via-purple-600/10 to-blue-600/10',
  };

  const sizes = {
    sm: 'w-32 h-32',
    md: 'w-64 h-64',
    lg: 'w-96 h-96',
  };

  return (
    <motion.div
      className={cn(
        'absolute rounded-full blur-3xl opacity-30',
        gradients[color],
        sizes[size],
        className
      )}
      animate={{
        x: [0, 30, -30, 0],
        y: [0, -30, 30, 0],
        scale: [1, 1.1, 0.9, 1],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

// ParallaxImage for hero sections
interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
}

export function ParallaxImage({ src, alt, className, speed = 0.5 }: ParallaxImageProps) {
  return (
    <motion.div
      className={cn('relative overflow-hidden', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        initial={{ scale: 1.2, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{
          duration: 1.2,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      />
    </motion.div>
  );
}

// ShimmerSkeleton loader with animation
export function ShimmerSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-lg bg-zinc-800/50', className)}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <div className="relative h-full w-full bg-zinc-800/50" />
    </div>
  );
}

// Page transition wrapper
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

// Fade-in animation for elements
export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Scale-in animation
export function ScaleIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Slide-up animation
export function SlideUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
