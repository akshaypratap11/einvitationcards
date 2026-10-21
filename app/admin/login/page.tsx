"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/browser";

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-festive-wine text-festive-gold flex items-center justify-center font-serif text-xl">
          <div className="flex flex-col items-center gap-3">
            <span className="text-3xl animate-spin">🪔</span>
            <span>Loading admin portal...</span>
          </div>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  const supabase = createClient();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // If already logged in, redirect to /admin
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.replace(from);
      }
    });
  }, [router, from, supabase.auth]);

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setForgotSuccess(null);
    setLoading(true);

    try {
      // 1. Call server API route in front of sign-in to enforce 5/min IP rate limiting
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("Too many login attempts. Please try again later.");
        }
        // Requirement: On any failure show only: "Invalid email or password"
        throw new Error("Invalid email or password");
      }

      // 2. Also authenticate browser client to sync in-memory & local state
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      // 3. Redirect to target destination
      router.push(from);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid email or password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError(null);
    setForgotSuccess(null);
    const email = getValues("email");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter your admin email above first, then click Forgot password.");
      return;
    }

    setForgotLoading(true);
    try {
      const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
      const redirectTo = `${siteUrl}/admin/reset-password`;

      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (resetErr) {
        throw resetErr;
      }

      setForgotSuccess(
        "Password reset instructions have been sent to your email. Please check your inbox."
      );
    } catch {
      setError("Unable to send reset instructions. Please check your email or try again later.");
    } finally {
      setForgotLoading(false);
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
            🪔
          </div>
          <span className="text-xs uppercase tracking-widest text-festive-gold font-semibold">
            Administrative Access
          </span>
          <h1 className="font-serif text-3xl font-bold text-festive-cream mt-1">
            निमंत्रण Utsav
          </h1>
          <p className="text-xs text-festive-cream/70 mt-1">
            Sign in with your administrator account to manage invitations.
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
        {forgotSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-start gap-2.5">
            <span className="text-emerald-400 text-base">✓</span>
            <span>{forgotSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-festive-goldLight mb-1.5"
            >
              Admin Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@example.com"
              disabled={loading}
              {...register("email")}
              className="w-full px-4 py-3 rounded-xl bg-festive-wine/80 border border-festive-gold/30 text-festive-cream placeholder-festive-cream/40 focus:outline-none focus:border-festive-gold focus:ring-1 focus:ring-festive-gold transition-all text-sm"
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-festive-goldLight"
              >
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={forgotLoading || loading}
                className="text-xs text-festive-gold/80 hover:text-festive-gold transition-colors hover:underline disabled:opacity-50"
              >
                {forgotLoading ? "Sending..." : "Forgot password?"}
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                disabled={loading}
                {...register("password")}
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
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-festive-gold via-amber-400 to-festive-goldDark text-festive-wine font-bold text-sm shadow-gold-glow hover:brightness-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <span className="animate-spin text-base">🪔</span>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Enter Admin Console</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-festive-gold/20 text-center">
          <Link
            href="/"
            className="text-xs text-festive-cream/60 hover:text-festive-gold transition-colors"
          >
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
}
