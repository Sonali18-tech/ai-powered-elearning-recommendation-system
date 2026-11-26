//Forgotpassword_testing
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BrainCircuit,
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/password/forgot-password", {
        email: normalizedEmail,
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Forgot password error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to process your request. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50">

        <Link to="/" className="mb-10 flex items-center justify-center gap-2">
          <BrainCircuit size={30} className="text-indigo-600" />
          <span className="text-2xl font-extrabold text-slate-900">
            Learn<span className="text-indigo-600">AI</span>
          </span>
        </Link>

        {!submitted ? (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Mail size={30} />
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-slate-900">
                Forgot Password?
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                No worries! Enter your registered email address and
                we'll help you reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="forgot-password-email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={19}
                  />
                  <input
                    id="forgot-password-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                    required
                  />
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 py-4 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Reset Link"}
                {!loading && (
                  <ArrowRight className="ml-2 inline" size={18} />
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="py-5 text-center">
            <CheckCircle2
              className="mx-auto mb-5 text-emerald-500"
              size={58}
            />

            <h1 className="text-2xl font-extrabold text-slate-900">
              Check Your Email
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              If an account exists for <strong>{email}</strong>,
              you will receive instructions to reset your password.
            </p>

            <button
              onClick={() => {
                setSubmitted(false);
                setEmail("");
                setError("");
              }}
              className="mt-7 font-semibold text-indigo-600"
            >
              Try another email
            </button>
          </div>
        )}

        <Link
          to="/login"
          className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600"
        >
          <ArrowLeft size={17} /> Back to Login
        </Link>
      </div>
    </div>
  );
}
