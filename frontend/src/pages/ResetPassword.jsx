
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  BrainCircuit,
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Backend token verification and password update
    // will be implemented later.
    setError("");
    setSuccess(true);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-12 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50">

        <Link to="/" className="mb-10 flex items-center justify-center gap-2">
          <BrainCircuit size={30} className="text-indigo-600" />
          <span className="text-2xl font-extrabold text-slate-900">
            Learn<span className="text-indigo-600">AI</span>
          </span>
        </Link>

        {success ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto mb-5 text-emerald-500" size={58} />
            <h1 className="text-2xl font-extrabold text-slate-900">
              Password Updated!
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              This is a frontend demonstration. Your actual password
              has not been changed because backend integration is pending.
            </p>
            <Link
              to="/login"
              className="mt-7 inline-flex items-center rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Go to Login <ArrowRight className="ml-2" size={17} />
            </Link>
          </div>
        ) : (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <LockKeyhole size={30} />
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-slate-900">
                Reset Password
              </h1>
              <p className="mt-3 text-sm text-slate-500">
                Create a new secure password for your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  New Password
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showConfirm ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 py-4 font-bold text-white transition hover:bg-indigo-700"
              >
                Update Password <ArrowRight className="ml-2 inline" size={18} />
              </button>
            </form>
          </>
        )}

        <Link
          to="/login"
          className="mt-8 block text-center text-sm font-semibold text-slate-500 hover:text-indigo-600"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
