import { Link } from "react-router-dom";

const Logo = ({ to = "/", size = "md" }) => {
  const sizes = {
    sm: { box: "h-8 w-8 text-sm", text: "text-base" },
    md: { box: "h-9 w-9 text-base", text: "text-lg" },
    lg: { box: "h-11 w-11 text-lg", text: "text-xl" },
  };

  const s = sizes[size] || sizes.md;

  return (
    <Link to={to} className="group flex items-center gap-3">
      <div
        className={`flex ${s.box} items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 font-bold text-white shadow-lg shadow-brand-600/30 transition group-hover:shadow-brand-500/40`}
      >
        H
      </div>
      <span className={`${s.text} font-bold tracking-tight text-white`}>
        Hire<span className="gradient-text">Sense</span>
        <span className="ml-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
          AI
        </span>
      </span>
    </Link>
  );
};

export default Logo;
