import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";

const stats = [
  {
    title: "Total Interviews",
    value: "12",
    change: "+3 this month",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
    accent: "from-indigo-500/20 to-indigo-600/5 border-indigo-500/20",
    iconColor: "text-indigo-400",
  },
  {
    title: "Average Score",
    value: "78%",
    change: "+5% vs last month",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
    accent: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    title: "Skills Detected",
    value: "8",
    change: "AI analyzed",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    accent: "from-violet-500/20 to-violet-600/5 border-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    title: "Practice Streak",
    value: "5 days",
    change: "Keep it up!",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      </svg>
    ),
    accent: "from-amber-500/20 to-amber-600/5 border-amber-500/20",
    iconColor: "text-amber-400",
  },
];

const skills = [
  { name: "JavaScript", level: 85 },
  { name: "React", level: 78 },
  { name: "Node.js", level: 72 },
  { name: "MongoDB", level: 68 },
  { name: "Communication", level: 90 },
  { name: "Problem Solving", level: 82 },
];

const recentActivity = [
  { title: "Frontend Developer Mock", score: "82%", date: "2 days ago", status: "Completed" },
  { title: "System Design Round", score: "74%", date: "5 days ago", status: "Completed" },
  { title: "Behavioral Interview", score: "88%", date: "1 week ago", status: "Completed" },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Welcome banner */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-brand-600/10 via-slate-900 to-violet-600/10 p-6 sm:p-8">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="relative">
            <p className="text-sm font-medium text-brand-300">Good to see you back</p>
            <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
              Welcome back, {user?.name || "User"}
            </h1>
            <p className="mt-2 max-w-xl text-slate-400">
              Your interview performance at a glance. Keep practicing to improve your scores.
            </p>
            <button className="btn-primary mt-6 !text-sm" disabled>
              Start New Interview (Coming Soon)
            </button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className={`card bg-gradient-to-br ${stat.accent} border`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{stat.change}</p>
                </div>
                <div className={`rounded-xl bg-slate-900/60 p-2.5 ${stat.iconColor}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          {/* Skills */}
          <div className="card lg:col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Skills Detected</h2>
              <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300">
                AI Powered
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-400">Based on your recent interview sessions</p>

            <div className="mt-6 space-y-4">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-300">{skill.name}</span>
                    <span className="text-slate-500">{skill.level}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-600 to-violet-500 transition-all duration-700"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="card lg:col-span-2">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <p className="mt-1 text-sm text-slate-400">Your latest mock interviews</p>

            <div className="mt-6 space-y-4">
              {recentActivity.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition hover:border-slate-700"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400">{item.score}</p>
                    <p className="text-xs text-slate-500">{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
