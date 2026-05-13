// src/core/ui_components/Layout/DashboardLayout.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../../features/profile/hooks/useProfile";
import { useNotifications } from "../../../features/notifications/hooks/useNotifications";

// Local fallback to prevent ReferenceError
const resolveMediaUrl = (value) => {
  if (typeof value !== "string") return null;
  const trimmedValue = value.trim();
  if (!trimmedValue || trimmedValue.toLowerCase() === "null") return null;
  if (/^https?:\/\//i.test(trimmedValue)) return trimmedValue;
  return `https://pathfinder.tryasp.net${trimmedValue.startsWith("/") ? trimmedValue : "/" + trimmedValue}`;
};

const DashboardLayout = ({ children }) => {
  const { logout, isAdmin } = useAuth();
  const { user } = useProfile();
  const { notifications, unreadCount, markAsRead, isLoading } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    console.log("Intelligence Sync:", { count: unreadCount, items: notifications?.length });
  }, [notifications, unreadCount]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const shouldBeScrolled = currentScrollY > 20;
      setIsScrolled(prev => prev !== shouldBeScrolled ? shouldBeScrolled : prev);

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
    { name: "My Resumes", path: "/cv-manager", icon: "📄" },
    { name: "AI Assistant", path: "/ai-assistant", icon: "🤖" },
    { name: "My Profile", path: "/profile", icon: "👤" },
  ], []);

  const allNavItems = useMemo(() => isAdmin 
    ? [...navItems, { name: "Admin Console", path: "/admin", icon: "⚙️" }]
    : navItems, [isAdmin, navItems]);

  const activeItem = allNavItems.find((i) => location.pathname.includes(i.path)) || allNavItems[0];

  // ─── Dynamic Theme Mapping ───
  useEffect(() => {
    const root = document.documentElement;
    const path = location.pathname;
    
    let themeColor = "#4763e1"; // Default Blue
    let orbs = ["#e0e7ff", "#f0f9ff", "#f5f3ff"]; // Default Light Blue Orbs

    if (path.includes("/courses")) {
      themeColor = "#10b981"; // Emerald
      orbs = ["#d1fae5", "#ecfdf5", "#f0fdf4"];
    } else if (path.includes("/jobs")) {
      themeColor = "#33aefc"; // Sky Blue
      orbs = ["#e0f2fe", "#f0f9ff", "#f8fafc"];
    } else if (path.includes("/career-match") || path.includes("/career-paths")) {
      themeColor = "#f97316"; // Orange
      orbs = ["#ffedd5", "#fff7ed", "#fffafb"];
    } else if (path.includes("/cv-manager")) {
      themeColor = "#a855f7"; // Purple
      orbs = ["#f3e8ff", "#faf5ff", "#fdf4ff"];
    } else if (path.includes("/ai-assistant")) {
      themeColor = "#6366f1"; // Indigo
      orbs = ["#e0e7ff", "#eef2ff", "#f5f3ff"];
    } else if (path.includes("/admin")) {
      themeColor = "#1e293b"; // Slate/Dark
      orbs = ["#f1f5f9", "#f8fafc", "#ffffff"];
    }

    root.style.setProperty("--theme-color", themeColor);
    root.style.setProperty("--bg-orb-1", orbs[0]);
    root.style.setProperty("--bg-orb-2", orbs[1]);
    root.style.setProperty("--bg-orb-3", orbs[2]);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-x-hidden">
      
      {/* ─── Global Progress Bar ─── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-[var(--color-primary)] z-[100] origin-left shadow-[0_0_15px_var(--color-primary)]"
        style={{ scaleX }}
      />

      {/* ─── Floating Background Mesh ─── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[var(--bg-orb-1)] rounded-full blur-[140px] opacity-40" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-[var(--bg-orb-2)] rounded-full blur-[140px] opacity-40" 
        />
      </div>

      {/* ─── Persistent Menu Trigger & Brand ─── */}
      <div className="fixed top-8 left-8 z-[80] flex items-center gap-4">
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 90, backgroundColor: "var(--theme-color)" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-2xl text-white shadow-2xl shadow-[var(--color-primary)]/30 border border-white/20 transition-all"
        >
          P
        </motion.button>
        <AnimatePresence>
          {!isScrolled && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col"
            >
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-900 italic opacity-80 hover:text-[var(--color-primary)] hover:opacity-100 hover:bg-slate-900/5 px-3 py-1 -ml-3 rounded-lg transition-all cursor-pointer active:scale-95"
              >
                PathFinder
              </button>
              <div className="h-px w-full bg-gradient-to-r from-slate-900/20 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Drawer Sidebar (Overlay) ─── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[85]"
            />
            <motion.aside 
              initial={{ x: -350, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -350, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-6 top-6 bottom-6 z-[90] w-72 flex flex-col bg-white/80 backdrop-blur-3xl rounded-[3rem] border border-white/40 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] p-8"
            >
              <div className="mb-12 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-xl text-white shadow-lg shadow-[var(--color-primary)]/20">
                  P
                </div>
                <span className="text-sm font-black uppercase tracking-[0.3em] text-slate-900 italic">PathFinder</span>
              </div>

              <nav className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
                {allNavItems.map((item) => {
                  const isActive = location.pathname.includes(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-5 p-4 rounded-2xl transition-all duration-300 relative group ${isActive ? "text-white" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="drawer-active"
                          className="absolute inset-0 bg-slate-900 rounded-2xl -z-1 shadow-lg" 
                        />
                      )}
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-6 border-t border-slate-100">
                 <motion.button 
                    whileHover={{ scale: 1.02, backgroundColor: "#fee2e2", color: "#ef4444" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout} 
                    className="w-full flex items-center gap-5 p-4 text-slate-400 rounded-2xl transition-all"
                  >
                    <span className="text-2xl">🚪</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Secure Exit</span>
                  </motion.button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── Mobile Bottom Nav (Legacy Support) ─── */}
      <nav className="fixed bottom-6 left-6 right-6 lg:hidden z-[70] bg-white/80 backdrop-blur-3xl rounded-[2.5rem] border border-white/40 shadow-2xl flex justify-around p-3">
        {allNavItems.slice(0, 5).map((item) => {
          const isActive = location.pathname.includes(item.path);
          return (
            <Link key={item.path} to={item.path} className={`p-4 rounded-2xl text-2xl transition-all ${isActive ? "bg-slate-900 text-white" : "text-slate-400"}`}>
              {item.icon}
            </Link>
          );
        })}
      </nav>

      {/* ─── Main Content Wrapper ─── */}
      <main className="flex-1 px-4 md:px-12 pt-32 pb-32 lg:pb-20 relative z-10">
        <div className="w-full max-w-[2000px] mx-auto space-y-12">
          
          {/* Top Info Bar */}
          <div className="flex justify-between items-center pl-32 lg:pl-32 pr-4 md:px-8">
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: 80 }}
                    className="h-1 bg-[var(--color-primary)] rounded-full shadow-[0_0_15px_var(--color-primary)]" 
                  />
                  <div className="space-y-1">
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400">Trajectory Protocol</p>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-950 italic uppercase tracking-tighter leading-none">{activeItem.name}</h1>
                  </div>
                </div>
             </div>

             <div className="flex items-center gap-4">
                <motion.button 
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    console.log("Triggering Notifications Modal...");
                    setIsNotifModalOpen(true);
                  }} 
                  className="relative w-16 h-16 bg-white/40 backdrop-blur-xl rounded-2xl flex items-center justify-center text-2xl hover:bg-white transition-all shadow-sm border border-white/40 cursor-pointer z-20"
                >
                  🔔 {unreadCount > 0 && <span className="absolute top-4 right-4 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse pointer-events-none" />}
                </motion.button>

                <div className="h-12 w-px bg-slate-200 mx-2 hidden sm:block" />

                <Link to="/profile" className="flex items-center gap-4 bg-white/40 backdrop-blur-xl p-2.5 pr-8 rounded-[2.5rem] border border-white/40 hover:bg-white hover:shadow-xl transition-all">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center text-2xl text-slate-300">
                    {(() => {
                      const rawPic = user?.profileImage || user?.ProfileImage || user?.profilePictureUrl || user?.ProfilePictureUrl;
                      if (rawPic) {
                        const finalPic = resolveMediaUrl(rawPic);
                        return <img src={finalPic} alt="Profile" className="h-full w-full object-cover" />;
                      }
                      return <span>👤</span>;
                    })()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-black text-slate-900 leading-none">{user?.firstName || "Explorer"}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1.5">{isAdmin ? "Admin" : "User"}</p>
                  </div>
                </Link>

                <div className="h-12 w-px bg-slate-200 mx-2 hidden sm:block" />

                <motion.button 
                  whileHover={{ scale: 1.1, backgroundColor: "#fee2e2", color: "#ef4444" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLogout}
                  className="w-16 h-16 bg-white/40 backdrop-blur-xl rounded-2xl flex items-center justify-center text-2xl hover:bg-white transition-all shadow-sm border border-white/40"
                  title="Secure Exit"
                >
                  🚪
                </motion.button>
             </div>
          </div>

          <motion.div 
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", damping: 25 }}
            className="page-frame overflow-hidden !rounded-[4rem]"
          >
            <div className="page-frame-content bg-white/70 backdrop-blur-3xl min-h-[75vh] border border-white/40">
              {children}
            </div>
          </motion.div>
        </div>
      </main>

      <AnimatePresence>
        {isNotifModalOpen && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
              onClick={() => setIsNotifModalOpen(false)} 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white"
            >
              <div className="p-12 border-b themed-border flex justify-between items-center bg-white/50">
                <div className="space-y-2">
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Intelligence</h3>
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-8 themed-bg rounded-full" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Live Neural Updates</p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsNotifModalOpen(false)} 
                  className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-slate-400 hover:themed-text hover:shadow-xl transition-all border border-slate-100"
                >
                  ✕
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar no-scrollbar space-y-6">
                {isLoading ? (
                  <div className="text-center py-24">
                    <motion.div 
                      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="w-12 h-12 border-4 border-[var(--theme-color)] border-t-transparent rounded-full mx-auto mb-6"
                    />
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-300">Synchronizing neural link...</p>
                  </div>
                ) : notifications?.length === 0 ? (
                  <div className="text-center py-24 flex flex-col items-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
                       <span className="text-5xl opacity-20">📡</span>
                    </div>
                    <p className="text-slate-300 font-black uppercase text-[12px] tracking-[0.5em]">Zero Resonance Detected</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {notifications?.map((n, idx) => (
                      <motion.div 
                        key={n.id || idx} 
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => !n.isRead && markAsRead(n.id)} 
                        className={`group relative p-8 rounded-[3rem] border-2 transition-all cursor-pointer ${n.isRead ? "bg-white/40 border-slate-50 opacity-50" : "bg-white border-white shadow-xl hover:shadow-2xl hover:-translate-y-1"}`}
                      >
                        {!n.isRead && (
                          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-12 themed-bg rounded-full shadow-[0_0_15px_var(--theme-color)]" />
                        )}
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-lg font-black text-slate-900 group-hover:themed-text transition-colors">{n.title}</h4>
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Now</span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">{n.message}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-8 bg-slate-50/50 border-t themed-border flex justify-center">
                <button onClick={() => setIsNotifModalOpen(false)} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-colors">Dismiss All Protocols</button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
