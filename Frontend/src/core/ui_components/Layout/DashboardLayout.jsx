// src/core/ui_components/Layout/DashboardLayout.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../../features/profile/hooks/useProfile";
import { useNotifications } from "../../../features/notifications/hooks/useNotifications";

const DashboardLayout = ({ children }) => {
  const { logout, isAdmin } = useAuth();
  const { user } = useProfile();
  const { notifications, unreadCount, markAsRead, isLoading } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update isScrolled only when state actually changes
      const shouldBeScrolled = currentScrollY > 20;
      setIsScrolled(prev => prev !== shouldBeScrolled ? shouldBeScrolled : prev);

      // Smart Visibility logic
      const isAtBottom = window.innerHeight + currentScrollY >= document.body.offsetHeight - 100;
      
      if (isAtBottom) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = useMemo(() => [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Career Match", path: "/career-match", icon: "🎯" },
    { name: "Career Paths", path: "/career-paths", icon: "🛤️" },
    { name: "Courses", path: "/courses", icon: "📚" },
    { name: "Jobs", path: "/jobs", icon: "💼" },
    { name: "CV Manager", path: "/cv-manager", icon: "📄" },
    { name: "Chatbot", path: "/ai-assistant", icon: "🤖" },
  ], []);

  const allNavItems = useMemo(() => isAdmin 
    ? [...navItems, { name: "Admin Console", path: "/admin", icon: "⚙️" }]
    : navItems, [isAdmin, navItems]);

  const activeItem = allNavItems.find((i) => location.pathname.includes(i.path)) || allNavItems[0];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      
      {/* ─── Trajectory Navbar (Fixed / Smart) ─── */}
      <div className={`fixed top-0 left-0 right-0 z-[60] py-4 transition-all duration-500 ${isVisible ? "translate-y-0" : "-translate-y-full opacity-0"}`}>
        <div className="container-main">
          <header className={`flex h-16 items-center justify-between rounded-[2rem] border px-6 transition-all duration-700 ${isScrolled ? "bg-white/90 backdrop-blur-xl shadow-2xl border-white/40" : "bg-white/70 backdrop-blur-md shadow-lg border-white/20"}`}>
            
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="group flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg text-white shadow-lg transition-transform group-hover:rotate-12">
                  P
                </div>
                <span className="hidden sm:block text-sm font-black uppercase tracking-[0.3em] text-slate-900 italic">PathFinder</span>
              </Link>
              
              <nav className="hidden xl:flex items-center gap-1 bg-slate-200/40 p-1 rounded-xl relative">
                 {allNavItems.map((item) => {
                   const isActive = location.pathname.includes(item.path);
                   return (
                     <Link
                       key={item.path}
                       to={item.path}
                       className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all duration-500 relative z-10 whitespace-nowrap ${isActive ? "text-white" : "text-slate-400 hover:text-slate-900"}`}
                     >
                       {isActive && (
                         <div className="absolute inset-0 bg-primary rounded-lg -z-1 shadow-lg shadow-primary/30 animate-pop" />
                       )}
                       {item.name}
                     </Link>
                   );
                 })}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => setIsNotifModalOpen(true)} className="p-3 bg-white/50 rounded-2xl text-xl relative hover:bg-white transition-all active:scale-90 shadow-sm">
                🔔 {unreadCount > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-ping" />}
              </button>

              <Link to="/profile" className="flex items-center gap-3 bg-white/50 p-1.5 pr-4 rounded-2xl border border-white/40 hover:bg-white hover:shadow-xl transition-all group">
                 <div className="w-10 h-10 bg-slate-100 rounded-xl overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
                    <img src={user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.userName || 'PF'}`} alt="U" className="h-full w-full object-cover" />
                 </div>
                 <div className="hidden lg:block text-left">
                   <p className="text-[10px] font-black text-slate-900 leading-none">{user?.firstName || "Explorer"}</p>
                   <p className="text-[7px] font-black uppercase tracking-widest text-slate-400 mt-1">{isAdmin ? "Admin" : "Node"}</p>
                 </div>
              </Link>

              <button onClick={handleLogout} className="p-3 text-slate-400 hover:text-red-500 transition-all hover:rotate-12">🚪</button>
            </div>
          </header>
        </div>
      </div>

      {/* ─── Trajectory Content Area ─── */}
      <main className="flex-1 pt-32 pb-16">
        <div className="container-main">
          
          {/* Journey Header */}
          <div className="mb-10 ml-8 space-y-4 animate-fade-in-up">
             <div className="flex items-center gap-3">
                <div className="h-1 w-10 bg-primary rounded-full shadow-[0_0_15px_var(--color-primary)]" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Mission / {activeItem.name}</p>
             </div>
             <h1 className="heading-premium text-4xl md:text-7xl italic text-slate-900">
               {activeItem.name}
             </h1>
          </div>

          <div className="page-frame animate-fade-in-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
            <div className="page-frame-content">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* ─── Notifications Modal ─── */}
      {isNotifModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" onClick={() => setIsNotifModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-zoom-in border border-white/40">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">Signals</h3>
              <button onClick={() => setIsNotifModalOpen(false)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm transition-all">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar no-scrollbar">
              {isLoading ? (
                <div className="text-center py-10 opacity-30 text-[10px] font-black uppercase tracking-widest">Scanning...</div>
              ) : notifications?.length === 0 ? (
                <div className="text-center py-10 text-slate-300 font-black uppercase text-[10px] tracking-widest">No signals detected</div>
              ) : (
                notifications?.map((n, idx) => (
                  <div key={n.id || idx} onClick={() => !n.isRead && markAsRead(n.id)} className={`p-6 rounded-[2rem] border mb-3 transition-all cursor-pointer ${n.isRead ? "bg-white border-gray-50 opacity-60" : "bg-primary/5 border-primary/20 shadow-sm"}`}>
                    <h4 className="text-[13px] font-black text-slate-900 mb-1">{n.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
