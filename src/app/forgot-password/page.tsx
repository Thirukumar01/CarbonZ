"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { ShieldCheck, Mail, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, Info } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const isConfigured = isSupabaseConfigured();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!isConfigured) {
      setStatus("error");
      setMessage(
        "Supabase credentials are not configured in this environment. To send real recovery emails, populate NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file."
      );
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth/callback?next=/dashboard/settings`,
      });

      if (error) {
        setStatus("error");
        setMessage(error.message);
      } else {
        setStatus("success");
        setMessage(
          `A password recovery email has been dispatched to ${email}. Follow the instructions in the email to set a new password.`
        );
      }
    } catch (err) {
      setStatus("error");
      setMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-forest-800 text-white flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-accent-cyan" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-navy-950">
              Carbon<span className="text-forest-600">Z</span>
            </span>
          </Link>
          <h2 className="mt-4 text-xl font-bold text-navy-950">
            Reset Account Password
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        {!isConfigured && (
          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Requirement Notice:</strong>
              Real email dispatch requires Supabase SMTP / Auth configuration. We do not simulate fake delivery when unconfigured.
            </div>
          </div>
        )}

        {status === "error" && message && (
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}

        {status === "success" && message ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-3">
            <div className="flex items-center gap-2 font-bold text-emerald-950">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Reset Link Sent
            </div>
            <p className="leading-relaxed">{message}</p>
            <div className="pt-2">
              <Link
                href="/login"
                className="text-forest-800 font-semibold hover:text-forest-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleReset}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-forest-700 hover:bg-forest-800 text-white font-semibold rounded-lg text-sm shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Sending link..." : "Send Reset Link"}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-3 text-center">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

