import { Link } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";

const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: "AI Mock Interviews",
    desc: "Realistic AI-driven interviews tailored to your role, experience level, and target company.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "Performance Analytics",
    desc: "Detailed score breakdowns, skill gap analysis, and progress tracking over time.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      </svg>
    ),
    title: "Skill Detection",
    desc: "AI automatically identifies your strengths and areas to improve from every session.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "24/7 Availability",
    desc: "Practice anytime, anywhere. No scheduling needed — your AI interviewer is always ready.",
  },
];

const steps = [
  { num: "01", title: "Create Account", desc: "Sign up in seconds and set up your profile." },
  { num: "02", title: "Start Interview", desc: "Choose a role and begin your AI mock interview." },
  { num: "03", title: "Get Insights", desc: "Review scores, skills detected, and personalized feedback." },
];

const stats = [
  { value: "10K+", label: "Interviews Conducted" },
  { value: "95%", label: "User Satisfaction" },
  { value: "500+", label: "Companies Targeted" },
  { value: "4.9★", label: "Average Rating" },
];

const Home = () => {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden mesh-bg">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
              </span>
              AI-Powered Interview Platform
            </div>

            <h1 className="animate-slide-up text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Ace Every Interview with{" "}
              <span className="gradient-text">Intelligent Practice</span>
            </h1>

            <p className="animate-slide-up mx-auto mt-6 max-w-2xl text-lg text-slate-400 sm:text-xl" style={{ animationDelay: "0.1s" }}>
              HireSense AI simulates real interviews, analyzes your responses, and
              gives actionable feedback — so you walk in prepared and confident.
            </p>

            <div className="animate-slide-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ animationDelay: "0.2s" }}>
              <Link to="/register" className="btn-primary w-full sm:w-auto">
                Start Free Trial
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a href="#how-it-works" className="btn-secondary w-full sm:w-auto">
                See How it Works
              </a>
            </div>
          </div>

          {/* Hero preview card */}
          <div className="animate-slide-up relative mx-auto mt-16 max-w-4xl" style={{ animationDelay: "0.3s" }}>
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-brand-600/20 to-violet-600/20 blur-2xl" />
            <div className="card relative overflow-hidden border-slate-700/50 p-0">
              <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900/80 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-slate-500">HireSense Dashboard Preview</span>
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-3">
                {[
                  { label: "Interviews", val: "12", color: "text-indigo-400" },
                  { label: "Avg Score", val: "78%", color: "text-emerald-400" },
                  { label: "Skills", val: "8", color: "text-violet-400" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-slate-500">{item.label}</p>
                    <p className={`mt-1 text-3xl font-bold ${item.color}`}>{item.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-slate-800 bg-slate-900/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:grid-cols-4 sm:px-6 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="section-title">Everything You Need to Succeed</h2>
            <p className="section-subtitle mx-auto">
              Powerful AI tools designed for students, job seekers, and professionals.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="card-hover group">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 transition group-hover:bg-brand-500/20">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-slate-800 bg-slate-900/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="section-title">How HireSense AI Works</h2>
            <p className="section-subtitle mx-auto">
              Three simple steps from signup to interview-ready.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.num} className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-violet-600 text-xl font-bold text-white shadow-lg shadow-brand-600/30">
                  {step.num}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing placeholder */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="section-subtitle mx-auto">Start free. Upgrade when you are ready.</p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
            <div className="card">
              <h3 className="text-lg font-semibold text-white">Free</h3>
              <p className="mt-2 text-4xl font-bold text-white">₹0<span className="text-base font-normal text-slate-400">/mo</span></p>
              <ul className="mt-6 space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> 3 mock interviews / month</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Basic skill analysis</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Dashboard access</li>
              </ul>
              <Link to="/register" className="btn-secondary mt-8 block w-full text-center">Get Started</Link>
            </div>

            <div className="card relative border-brand-500/50 bg-gradient-to-b from-brand-600/10 to-transparent">
              <span className="absolute -top-3 right-6 rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white">Popular</span>
              <h3 className="text-lg font-semibold text-white">Pro</h3>
              <p className="mt-2 text-4xl font-bold text-white">₹499<span className="text-base font-normal text-slate-400">/mo</span></p>
              <ul className="mt-6 space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Unlimited interviews</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Advanced AI feedback</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Company-specific prep</li>
              </ul>
              <Link to="/register" className="btn-primary mt-8 block w-full text-center">Start Pro Trial</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-800 py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Transform Your Interview Game?
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Join thousands of candidates preparing smarter with HireSense AI.
          </p>
          <Link to="/register" className="btn-primary mt-8 inline-flex">
            Create Free Account
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Home;
