"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/browser";

const ResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(10, "Password must be at least 10 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-festive-wine text-festive-gold flex items-center justify-center font-serif text-xl">
          <div className="flex flex-col items-center gap-3">
            <span className="text-3xl animate-spin">🪔</span>
            <span>Loading password reset...</span>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null);
    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 1500);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to reset password. Please request a new reset link.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative festive-pattern-bg">
      {/* Decorative ambient lights */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-festive-gold/10 blur-[120px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-md w-full bg-festive-maroon/90 border border-festive-gold/40 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 backdrop-blur-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-festive-wine border-2 border-festive-gold/60 mx-auto flex items-center justify-center text-3xl shadow-gold-glow mb-4">
            🔐
          </div>
          <span className="text-xs uppercase tracking-widest text-festive-gold font-semibold">
            Security Reset
          </span>
          <h1 className="font-serif text-3xl font-bold text-festive-cream mt-1">
            Set New Password
          </h1>
          <p className="text-xs text-festive-cream/70 mt-1">
            Create a strong new password (minimum 10 characters) for your admin account.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs sm:text-sm flex items-start gap-2.5">
            <span className="text-red-400 text-base">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-start gap-2.5">
            <span className="text-emerald-400 text-base">✓</span>
            <span>Password updated successfully! Redirecting to admin console...</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* New password field */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-xs font-semibold uppercase tracking-wider text-festive-goldLight mb-1.5"
            >
              New Password (min 10 characters)
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                disabled={loading || success}
                {...register("newPassword")}
                className="w-full px-4 py-3 rounded-xl bg-festive-wine/80 border border-festive-gold/30 text-festive-cream placeholder-festive-cream/40 focus:outline-none focus:border-festive-gold focus:ring-1 focus:ring-festive-gold transition-all text-sm pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-festive-cream/60 hover:text-festive-gold text-xs transition-colors p-1"
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-red-400 mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm password field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold uppercase tracking-wider text-festive-goldLight mb-1.5"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter new password"
              disabled={loading || success}
              {...register("confirmPassword")}
              className="w-full px-4 py-3 rounded-xl bg-festive-wine/80 border border-festive-gold/30 text-festive-cream placeholder-festive-cream/40 focus:outline-none focus:border-festive-gold focus:ring-1 focus:ring-festive-gold transition-all text-sm"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-400 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-festive-gold via-amber-400 to-festive-goldDark text-festive-wine font-bold text-sm shadow-gold-glow hover:brightness-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <span className="animate-spin text-base">🪔</span>
                <span>Updating Password...</span>
              </>
            ) : success ? (
              <>
                <span>Password Saved</span>
                <span>✓</span>
              </>
            ) : (
              <>
                <span>Save New Password & Continue</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-festive-gold/20 text-center">
          <Link
            href="/admin/login"
            className="text-xs text-festive-cream/60 hover:text-festive-gold transition-colors"
          >
            ← Back to Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
