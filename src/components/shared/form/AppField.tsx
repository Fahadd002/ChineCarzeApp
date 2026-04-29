import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { AnyFieldApi } from "@tanstack/react-form";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const getErrorMessage = (error : unknown) : string => {
  if (typeof error === "string") return error;

  if(error && typeof error === "object"){
      if("message" in error && typeof error.message === "string"){
          return error.message;
      }
  }

  return String(error);
}

type AppFieldProps = {
  field : AnyFieldApi;
  label : string;
  type ?: "text" | "email" | "password" | "number";
  placeholder ?: string;
  append ?: React.ReactNode;
  prepend ?: React.ReactNode;
  className ?: string;
  disabled ?: boolean;
}

const AppField = ({
  field,
  label,
  type = "text",
  placeholder,
  append,
  prepend,
  className,
  disabled = false,
} : AppFieldProps) => {

  const firstError = field.state.meta.isTouched && field.state.meta.errors.length > 0 ? getErrorMessage(field.state.meta.errors[0]) : null;

  const hasError = firstError !== null;
  const isFocused = field.state.meta.isDirty || field.state.value !== "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("space-y-1.5", className)}
    >
      {/* Floating label with indicator */}
      <div className="flex items-center justify-between">
        <Label
          htmlFor={field.name}
          className={cn(
            "text-sm font-medium transition-colors",
            hasError ? "text-red-400" : "text-gray-300",
            isFocused && "text-primary"
          )}
        >
          {label}
        </Label>
        {isFocused && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs text-primary/70"
          >
            Required
          </motion.span>
        )}
      </div>

      <div className="relative">
        {/* Prepend icon/element */}
        {prepend && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
            {React.cloneElement(prepend as React.ReactElement, {
              className: cn((prepend as React.ReactElement).props.className, "text-muted-foreground group-hover:text-red-500 transition-colors")
            })}
          </div>
        )}

        {/* Input with enhanced styling */}
        <motion.div
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Input
            id={field.name}
            name={field.name}
            type={type}
            value={field.state.value}
            placeholder={placeholder}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${field.name}-error` : undefined}
            className={cn(
              "relative h-10 bg-zinc-950/50 border-white/10 rounded-lg transition-all duration-300",
              "focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 focus:ring-offset-0",
              "hover:border-white/20",
              hasError && "border-red-500/50 focus:ring-red-500/30",
              prepend && "pl-10",
              append && "pr-10",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
        </motion.div>

        {/* Append icon/element */}
        {append && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none z-10">
            {append}
          </div>
        )}

        {/* Error message with animation */}
        <AnimatePresence mode="wait">
          {hasError && (
            <motion.div
              initial={{ opacity: 0, y: -5, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -5, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p
                id={`${field.name}-error`}
                role="alert"
                className="text-sm text-red-400 mt-1.5 flex items-center gap-1.5"
              >
                <span className="h-1 w-1 rounded-full bg-red-500" />
                {firstError}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default AppField;