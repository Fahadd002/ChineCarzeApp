"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { loginAction } from "@/app/(commonLayout)/(authRouteGroup)/login/_action";
import AppField from "@/components/shared/AppField";
import AppSubmitButton from "@/components/shared/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Sparkles, Film, Play, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { FloatingOrb } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

interface LoginFormProps {
    redirectPath? : string;
    message?: string;
}

const LoginForm = ({ redirectPath, message }: LoginFormProps) => {

    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const { mutateAsync , isPending} = useMutation({
        mutationFn : (payload : ILoginPayload) => loginAction(payload, redirectPath),
    })

    const form = useForm({
        defaultValues : {
            email : "",
            password : "",
        },

        onSubmit : async ({value}) => {
            setServerError(null);
            try {
                const result = await mutateAsync(value) as any;

                if(!result.success ){
                    setServerError(result.message || "Login failed");
                    return ;
                }
            } catch (error : any) {
                console.log(`Login failed: ${error.message}`);
                setServerError(`Login failed: ${error.message}`);
            }
        }
    })
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Cinematic Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-zinc-950 via-red-950/20 to-purple-950/20"
      >
        {/* Animated background elements */}
        <FloatingOrb color="red" size="lg" className="top-1/4 left-1/4" />
        <FloatingOrb color="purple" size="md" className="bottom-1/3 right-1/4" />
        <FloatingOrb color="blue" size="sm" className="top-3/4 left-2/3" />

        {/* Grain texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 250 250%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.6%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.04%22/%3E%3C/svg%3E')] opacity-40" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-md space-y-8"
          >
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="h-12 w-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/30"
              >
                <Film className="h-6 w-6 text-white fill-white" />
              </motion.div>
              <span className="text-3xl font-bold bg-gradient-to-r from-red-400 via-white to-purple-400 bg-clip-text text-transparent">
                CineCraze
              </span>
            </div>

            {/* Tagline */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl md:text-5xl font-bold leading-tight text-white"
              >
                Your Journey Into
                <span className="block bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
                  Cinematic Worlds
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-lg text-gray-300 leading-relaxed"
              >
                Stream thousands of movies, TV shows, and exclusive content anywhere, anytime.
              </motion.p>
            </div>

            {/* Feature bubbles */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-3 pt-4"
            >
              {["4K Ultra HD", "Ad-Free", "Offline Download"].map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <span className="text-sm text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="pt-8"
            >
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-white/20 text-white hover:bg-white/10 bg-white/5"
                >
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      </motion.div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Mobile header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden absolute top-6 left-6 flex items-center gap-2"
        >
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
            <Film className="h-5 w-5 text-white fill-white" />
          </div>
          <span className="text-lg font-bold text-white">CineCraze</span>
        </motion.div>

        {/* Background decorative */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-black pointer-events-none" />
        <FloatingOrb color="mixed" size="md" className="top-10 right-10 opacity-10" />

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="bg-zinc-900/50 backdrop-blur-xl border-white/10 shadow-2xl relative overflow-hidden">
            {/* Glass light reflection */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 pointer-events-none" />

            <div className="relative p-8 space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.4 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 mb-4 shadow-lg shadow-red-500/30"
                >
                  <Sparkles className="h-8 w-8 text-white" />
                </motion.div>
                <h1 className="text-3xl font-bold text-white">
                  Welcome Back
                </h1>
                <p className="text-muted-foreground">
                  Sign in to continue your cinematic journey
                </p>
              </div>

              {/* Server message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert className="border-blue-500/50 bg-blue-500/10 text-blue-200">
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {/* Server error */}
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-200">
                    <AlertDescription>{serverError}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {/* Form */}
              <form
                method="POST"
                action="#"
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="space-y-4"
              >
                <form.Field
                  name="email"
                  validators={{ onChange: loginZodSchema.shape.email }}
                >
                  {(field) => (
                    <AppField
                      field={field}
                      label="Email"
                      type="email"
                      placeholder="Enter your email"
                      className="bg-zinc-950/50 border-white/10 focus:border-red-500/50"
                    />
                  )}
                </form.Field>

                <form.Field
                  name="password"
                  validators={{ onChange: loginZodSchema.shape.password }}
                >
                  {(field) => (
                    <AppField
                      field={field}
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      append={
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            type="button"
                            onClick={() => setShowPassword((value) => !value)}
                            variant="ghost"
                            size="icon"
                            className="hover:bg-white/5 text-muted-foreground hover:text-white"
                          >
                            {showPassword ? (
                              <EyeOff className="size-4" aria-hidden="true" />
                            ) : (
                              <Eye className="size-4" aria-hidden="true" />
                            )}
                          </Button>
                        </motion.div>
                      }
                      className="bg-zinc-950/50 border-white/10 focus:border-red-500/50"
                    />
                  )}
                </form.Field>

                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-red-400 hover:text-red-300 hover:underline underline-offset-4 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <form.Subscribe
                  selector={(s) => [s.canSubmit, s.isSubmitting] as const}
                >
                  {([canSubmit, isSubmitting]) => (
                    <AppSubmitButton
                      isPending={isSubmitting || isPending}
                      pendingLabel="Logging in..."
                      disabled={!canSubmit}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-0 shadow-lg shadow-red-500/30"
                    >
                      Sign In
                    </AppSubmitButton>
                  )}
                </form.Subscribe>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-zinc-900/80 text-muted-foreground backdrop-blur-sm">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Sign-in */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-foreground"
                  onClick={() => {
                    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                    window.location.href = `${baseUrl}/auth/login/google`;
                  }}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </motion.div>

              {/* Footer */}
              <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-red-400 font-medium hover:text-red-300 hover:underline underline-offset-4 transition-colors"
                >
                  Sign up free
                </Link>
              </div>
            </div>
          </Card>

          {/* Branding gradient accent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center text-xs text-muted-foreground/60"
          >
            <p>By signing in, you agree to our Terms & Privacy Policy</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginForm