import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const DashboardSidebar = () => {
  const location = useLocation();

  const links = [
    {
      to: "/dashboard",
      label: "Overview",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
    },
    {
      to: "/resume/upload",
      label: "Upload Resume",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      ),
    },
    {
      to: "/resume/analysis",
      label: "Resume Analysis",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      ),
    },
    {
      to: "/interview",
      label: "AI Interview",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      ),
    },
  ];

  const isActive = (link) => {
    if (link.to === "/interview") {
      return location.pathname.startsWith("/interview");
    }
    return location.pathname === link.to;
  };

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-slate-800 bg-surface-900 lg:block">
      <div className="flex h-full flex-col p-6">
        <Logo to="/dashboard" size="sm" />

        <nav className="mt-10 flex-1 space-y-1">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Menu
          </p>
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive(link)
                  ? "bg-brand-500/10 text-brand-300"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              {link.icon}
              {link.label}
              {link.badge && (
                <span className="ml-auto rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-500">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <Link
          to="/interview"
          className="rounded-xl border border-brand-500/30 bg-gradient-to-br from-brand-600/10 to-violet-600/5 p-4 transition hover:border-brand-500/50"
        >
          <p className="text-xs font-semibold text-brand-300">AI Interview</p>
          <p className="mt-1 text-xs text-slate-400">Personalized questions from your resume</p>
        </Link>
      </div>
    </aside>
  );
};

const DashboardHeader = ({ title = "Dashboard", subtitle = "Overview" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-surface-900/90 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="lg:hidden">
          <Logo to="/dashboard" size="sm" />
        </div>

        <div className="hidden lg:block">
          <h2 className="text-sm font-medium text-slate-400">{title}</h2>
          <p className="text-lg font-semibold text-white">{subtitle}</p>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/" className="hidden text-sm text-slate-400 hover:text-white sm:block">
            Home
          </Link>

          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 text-sm font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

const DashboardLayout = ({ children, title, subtitle }) => {
  return (
    <div className="flex min-h-screen bg-surface-900">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col">
        <DashboardHeader title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
