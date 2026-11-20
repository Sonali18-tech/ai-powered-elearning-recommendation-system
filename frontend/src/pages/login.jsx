
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import api from "../services/api";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">

      {/* Left branding section */}
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
            Personalized learning experience
          </div>

          <h1 className="text-5xl font-extrabold leading-tight">
            Your next chapter of learning starts here.
          </h1>

          <p className="mt-6 text-lg leading-8 text-indigo-100">
            Sign in to discover personalized courses, track your progress
            and build skills that move you forward.
          </p>

          <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
            <div className="flex items-center gap-3">
              <ShieldCheck size={26} />
              <div>
                <p className="font-bold">Learn with confidence</p>
                <p className="mt-1 text-sm text-indigo-100">
                  Your learning journey, personalized for you.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative text-sm text-indigo-200">
          © {new Date().getFullYear()} LearnAI. All rights reserved.
        </p>
      </div>

      {/* Login form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          <Link to="/" className="mb-10 flex items-center gap-2 lg:hidden">
            <BrainCircuit className="text-indigo-600" size={30} />
            <span className="text-xl font-extrabold text-slate-900">
              Learn<span className="text-indigo-600">AI</span>
            </span>
          </Link>

          <div className="mb-8">
            <p className="font-semibold text-indigo-600">WELCOME BACK</p>

            <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
              Login to your account
            </h2>

            <p className="mt-3 text-slate-500">
              Continue your personalized learning journey.
            </p>
          </div>

          {/* Google button - integration pending */}
          <button
            type="button"
            onClick={() =>
              alert("Google OAuth will be integrated with the backend later.")
            }
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
            Continue with Google
          </button>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm text-slate-400">
              OR CONTINUE WITH EMAIL
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

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
                  className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Forgot password?
                </Link>
              </div>

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
                  placeholder="Enter your password"
                  autoComplete="current-password"
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
              className="w-full rounded-xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                "Logging in..."
              ) : (
                <>
                  Login <ArrowRight className="ml-2 inline" size={18} />
                </>
              )}
            </button>

          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-indigo-600 hover:text-indigo-800"
            >
              Create an account
            </Link>
          </p>

          <Link
            to="/"
            className="mt-6 block text-center text-sm text-slate-400 hover:text-indigo-600"
          >
            ← Back to Home
          </Link>

        </div>
      </div>
    </div>
  );
}
