
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BrainCircuit, Users, GraduationCap, ShieldCheck,
  Search, LogOut, RefreshCw, BookOpen, UserCog,
} from "lucide-react";
import api from "../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const meResponse = await api.get("/auth/me");
      const currentUser = meResponse.data.user;

      if (currentUser.role !== "ADMIN") {
        navigate("/dashboard", { replace: true });
        return;
      }

      setAdmin(currentUser);

      const usersResponse = await api.get("/admin/users");
      setUsers(usersResponse.data.users || []);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login", { replace: true });
      } else {
        setError(
          err.response?.data?.message || "Unable to load admin dashboard."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const counts = useMemo(() => ({
    total: users.length,
    learners: users.filter((u) => u.role === "LEARNER").length,
    instructors: users.filter((u) => u.role === "INSTRUCTOR").length,
    admins: users.filter((u) => u.role === "ADMIN").length,
  }), [users]);

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const changeRole = async (userId, role) => {
    try {
      setUpdatingId(userId);
      setError("");

      const response = await api.patch(`/admin/users/${userId}/role`, { role });

      setUsers((previous) =>
        previous.map((user) =>
          user.id === userId ? response.data.user : user
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update user role.");
    } finally {
      setUpdatingId("");
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      navigate("/login", { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-600">
        Loading admin dashboard...
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: counts.total, icon: Users, color: "text-indigo-600 bg-indigo-50" },
    { label: "Learners", value: counts.learners, icon: GraduationCap, color: "text-blue-600 bg-blue-50" },
    { label: "Instructors", value: counts.instructors, icon: BookOpen, color: "text-emerald-600 bg-emerald-50" },
    { label: "Administrators", value: counts.admins, icon: ShieldCheck, color: "text-violet-600 bg-violet-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-2 text-white">
              <BrainCircuit size={25} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                Learn<span className="text-indigo-600">AI</span> Admin
              </h1>
              <p className="text-xs text-slate-500">Platform management</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-600 sm:block">
              {admin?.name} · Administrator
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-indigo-600">ADMINISTRATION</p>
            <h2 className="mt-1 text-3xl font-extrabold text-slate-900">
              Dashboard Overview
            </h2>
            <p className="mt-2 text-slate-500">
              Manage users and monitor your LearnAI platform.
            </p>
          </div>

          <button
            onClick={loadDashboard}
            className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((item) => (
            <div key={item.label} className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <h3 className="mt-2 text-3xl font-extrabold text-slate-900">
                    {item.value}
                  </h3>
                </div>
                <div className={`rounded-xl p-3 ${item.color}`}>
                  <item.icon size={25} />
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-9 overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b p-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">User Management</h3>
              <p className="mt-1 text-sm text-slate-500">
                View users and manage their platform roles.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email..."
                className="w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Manage Role</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {user.name}
                      {user.id === admin?.id && (
                        <span className="ml-2 text-xs text-indigo-600">You</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        disabled={user.id === admin?.id || updatingId === user.id}
                        onChange={(e) => changeRole(user.id, e.target.value)}
                        className="rounded-lg border bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="LEARNER">Learner</option>
                        <option value="INSTRUCTOR">Instructor</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t px-6 py-4 text-xs text-slate-500">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </section>
      </main>
    </div>
  );
}
