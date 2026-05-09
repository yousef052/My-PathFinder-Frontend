// src/core/ui_components/Layout/DashboardLayout.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../../features/profile/hooks/useProfile";
import { clearProfileCache } from "../../../features/profile/hooks/useProfile";
import { useNotifications } from "../../../features/notifications/hooks/useNotifications";

const DashboardLayout = ({ children }) => {
  const { user } = useProfile();
  const { notifications, unreadCount, markAsRead, isLoading } =
    useNotifications();
  const { isAdmin, userRole, refreshAuthState } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false); //

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Career Match", path: "/career-match", icon: "🎯" },
    { name: "Career Paths", path: "/career-paths", icon: "🗺️" },
    { name: "My Paths", path: "/my-career-paths", icon: "🛤️" },
    { name: "Courses", path: "/courses", icon: "📚" },
    { name: "Jobs", path: "/jobs", icon: "💼" },
    { name: "Saved", path: "/saved", icon: "🔖" },
    { name: "CV Manager", path: "/cv-manager", icon: "📄" },
    { name: "AI Assistant", path: "/ai-assistant", icon: "🤖" },
  ];

  const adminNavItems = [
    { name: "Admin Console", path: "/admin" },
  ];

  const handleLogout = () => {
    clearProfileCache();
    localStorage.clear();
    refreshAuthState();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col relative transition-colors duration-500">
      {/* 💡 نافذة التنبيهات المصلحة - تم وضعها في أعلى مستوى لضمان الظهور[cite: 19] */}
      {isNotifModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsNotifModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-zoom-in">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-2xl font-black text-text-primary tracking-tight">
                Notifications
              </h3>
              <button
                onClick={() => setIsNotifModalOpen(false)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-text-hint hover:text-red-500 shadow-sm transition-all"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar">
              {isLoading ? (
                <div className="text-center py-10 opacity-30 text-[10px] font-black uppercase">
                  Loading...
                </div>
              ) : notifications?.length === 0 ? (
                <div className="text-center py-10 text-text-hint font-black uppercase text-[10px]">
                  No notifications
                </div>
              ) : (
                notifications?.map((n, idx) => (
                  <div
                    key={n.id || idx}
                    onClick={() => !n.isRead && markAsRead(n.id)}
                    className={`p-6 rounded-[2rem] border mb-3 transition-all cursor-pointer ${n.isRead ? "bg-white border-gray-50 opacity-60" : "bg-primary-50 border-primary/10"}`}
                  >
                    <h4 className="text-[13px] font-black text-text-primary mb-1">
                      {n.title}
                    </h4>
                    <p className="text-[11px] text-text-secondary font-medium leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 h-20 flex items-center justify-between overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-10 min-w-max">
          <h2 className="text-2xl font-black text-primary italic tracking-tight animate-pulse">
            Path Finder
          </h2>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:scale-110 ${location.pathname.includes(item.path) ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-text-hint hover:text-primary"}`}
              >
                {item.name}
              </Link>
            ))}
            {isAdmin &&
              adminNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:scale-110 ${location.pathname.includes(item.path) ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-text-hint hover:text-primary"}`}
                >
                  {item.name}
                </Link>
              ))}
          </nav>
        </div>

        <div className="flex items-center gap-6 ml-6 min-w-max">
          {/* 💡 زر التنبيهات المصلح[cite: 19] */}
          <button
            onClick={() => setIsNotifModalOpen(true)}
            className="p-3 bg-gray-50 rounded-2xl text-xl relative text-text-hint hover:bg-primary-50 hover:text-primary transition-all active:scale-90"
          >
            🔔{" "}
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
            )}
          </button>

          <Link
            to="/profile"
            className="flex items-center gap-4 bg-white p-1.5 pr-5 rounded-2xl border border-gray-100 hover:shadow-xl transition-all group"
          >
            <div className="w-10 h-10 bg-primary rounded-xl overflow-hidden shadow-lg border-2 border-white group-hover:rotate-12 transition-transform">
              {user?.firstName?.[0]}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-black text-text-primary leading-none">
                {user ? `${user.firstName} ${user.lastName}` : "..."}
              </p>
              <p className="text-[8px] text-text-hint font-black uppercase tracking-widest mt-1">
                {isAdmin ? "Admin Account" : `${userRole || "User"} Account`}
              </p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="p-3 text-red-400 hover:bg-red-50 rounded-2xl transition-all hover:rotate-12"
          >
            🚪
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 lg:p-12 max-w-7xl mx-auto w-full animate-fade-in-up">
        <div className="mb-12 flex items-center gap-5 transition-transform hover:translate-x-3 duration-500">
          <div className="h-12 w-2.5 bg-primary rounded-full shadow-lg shadow-primary/20 animate-bounce"></div>
          <div>
            <h1 className="text-4xl font-black text-text-primary capitalize tracking-tighter italic leading-none">
              {navItems.find((i) => location.pathname.includes(i.path))?.name ||
                "Overview"}
            </h1>
            {/* 💡 تم حذف سطر Management Hub كما طلبت[cite: 19] */}
          </div>
        </div>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
