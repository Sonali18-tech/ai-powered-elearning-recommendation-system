
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrainCircuit, User, Mail, ShieldCheck, LogOut } from "lucide-react";
import api from "../services/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (err) {
        setError("Unable to load user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      navigate("/login", { replace: true });
    } catch (err) {
      setError("Logout failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading your dashboard...
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="flex items-center justify-between border-b bg-white px-8 py-5">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-indigo-600" size={30} />
          <span className="text-xl font-extrabold">
            Learn<span className="text-indigo-600">AI</span>
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 font-semibold text-red-600 hover:bg-red-100"
        >
          <LogOut size={18} />
          Logout
        </button>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Welcome, {user.name}!
        </h1>

        <p className="mt-2 text-slate-500">
          Your personalized learning journey starts here.
        </p>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <User className="text-indigo-600" size={28} />
            <h3 className="mt-4 font-bold text-slate-800">Full Name</h3>
            <p className="mt-2 text-slate-500">{user.name}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <Mail className="text-indigo-600" size={28} />
            <h3 className="mt-4 font-bold text-slate-800">Email</h3>
            <p className="mt-2 break-all text-slate-500">{user.email}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <ShieldCheck className="text-emerald-600" size={28} />
            <h3 className="mt-4 font-bold text-slate-800">Account Role</h3>
            <p className="mt-2 text-slate-500">{user.role}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
