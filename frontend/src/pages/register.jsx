
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";
import api from "../services/api";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (Object.values(formData).some((value) => !value.trim())) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptedTerms) {
      setError("Please accept the terms and conditions.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (response.data.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50";

  return (
    <div className="flex min-h-screen bg-white">

      {/* Branding section */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 p-12 text-white lg:flex">

        <div className="absolute -right-24 -top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-violet-300/20 blur-3xl" />

        <Link to="/" className="relative flex items-center gap-3">
          <div className="rounded-xl bg-white/20 p-2">
            <BrainCircuit size={28} />
          </div>

          <span className="text-2xl font-extrabold">
            Learn<span className="text-indigo-200">AI</span>
          </span>
        </Link>

        <div className="relative max-w-lg">
          <div className="mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
            <GraduationCap className="mr-2" size={18} />
            Start your learning journey
          </div>

          <h1 className="text-5xl font-extrabold leading-tight">
            Learn at your pace. Grow your potential.
          </h1>

          <p className="mt-6 text-lg leading-8 text-indigo-100">
            Create your account and let AI discover learning opportunities
            that match your interests, abilities and goals.
          </p>

          <div className="mt-10 space-y-5">
            {[
              "Personalized course recommendations",
              "Learner-specific difficulty predictions",
              "Track your learning progress",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="text-indigo-200" size={20} />
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-sm text-indigo-200">
          © {new Date().getFullYear()} LearnAI. All rights reserved.
        </p>
      </div>

      {/* Registration form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <BrainCircuit className="text-indigo-600" size={30} />

            <span className="text-xl font-extrabold text-slate-900">
              Learn<span className="text-indigo-600">AI</span>
            </span>
          </Link>

          <div className="mb-7">
            <p className="font-semibold text-indigo-600">GET STARTED</p>

            <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
              Create your account
            </h2>

            <p className="mt-3 text-slate-500">
              Join LearnAI and start learning smarter.
            </p>
          </div>

          {/* GOOGLE OAUTH */}
          <button
            type="button"
            onClick={() => {
              window.location.href =
                "http://localhost:5000/api/auth/google";
            }}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <svg viewBox="0 0 48 48" className="h-5 w-5">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                transform="translate(0 4)"
              />

              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.28 5.65c4.25-3.93 7.52-9.72 7.52-17.3Z"
              />

              <path
                fill="#FBBC05"
                d="M10.53 28.41a14.5 14.5 0 0 1 0-9.02l-7.98-6.19a24 24 0 0 0 0 21.4l7.98-6.19Z"
              />

              <path
                fill="#34A853"
                d="M24 48c6.47 0 11.9-2.13 15.87-5.8l-7.28-5.65c-2.02 1.35-4.61 2.15-8.59 2.15-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48Z"
              />
            </svg>

            Sign up with Google
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-sm text-slate-400">
              OR REGISTER WITH EMAIL
            </span>

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name
              </label>

              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={19}
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={19}
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={19}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  required
                  className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-12 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Confirm Password
              </label>

              <div className="relative">
                <LockKeyhole
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={19}
                />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  required
                  className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-12 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => {
                  setAcceptedTerms(e.target.checked);
                  setError("");
                }}
                className="mt-1 h-4 w-4 accent-indigo-600"
              />

              <span>
                I agree to the{" "}
                <a href="#terms" className="font-semibold text-indigo-600">
                  Terms and Conditions
                </a>{" "}
                and Privacy Policy.
              </span>
            </label>

            {/* Error message */}
            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                "Creating Account..."
              ) : (
                <>
                  Create Account{" "}
                  <ArrowRight className="ml-2 inline" size={18} />
                </>
              )}
            </button>

          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-indigo-600 hover:text-indigo-800"
            >
              Login
            </Link>
          </p>

          <Link
            to="/"
            className="mt-5 block text-center text-sm text-slate-400 hover:text-indigo-600"
          >
            ← Back to Home
          </Link>

        </div>
      </div>
    </div>
  );
}
