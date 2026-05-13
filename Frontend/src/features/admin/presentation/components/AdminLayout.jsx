import React from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "../../../../core/context/AuthContext";

const navItems = [
  { label: "Career Paths", path: "/admin/career-paths", marker: "CP" },
  { label: "Courses", path: "/admin/courses", marker: "CO" },
  { label: "Categories", path: "/admin/categories", marker: "CA" },
  { label: "Platforms", path: "/admin/platforms", marker: "PL" },
  { label: "Jobs", path: "/admin/jobs", marker: "JB" },
  { label: "Job Sources", path: "/admin/job-sources", marker: "JS" },
  { label: "Global Skills", path: "/admin/skills", marker: "SK" },
  { label: "My Profile", path: "/admin/profile", marker: "PR" },
];

const AdminLayout = () => {
  const { userRole } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-20 items-center border-b border-slate-100 px-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--color-primary)]">
              Path Finder
            </p>
            <h1 className="mt-1 text-xl font-black tracking-tight">
              Admin Console
            </h1>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition-all ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white shadow-lg shadow-blue-100"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
                }`
              }
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 text-[10px] font-black">
                {item.marker}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Signed in as
            </p>
            <p className="mt-1 text-sm font-black text-slate-700">
              {userRole || "Admin"}
            </p>
          </div>
          <Link
            to="/dashboard"
            className="mt-3 flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-500 transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            Back to App
          </Link>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--color-primary)]">
                Admin
              </p>
              <h1 className="text-lg font-black">Console</h1>
            </div>
            <Link
              to="/dashboard"
              className="rounded-xl border border-slate-200 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500"
            >
              App
            </Link>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `shrink-0 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest ${
                    isActive
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-slate-100 text-slate-500"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="mx-auto min-h-screen w-full max-w-7xl px-5 py-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
