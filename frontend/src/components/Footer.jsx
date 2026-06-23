import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-surface-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo to="/" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              AI-powered interview preparation platform. Practice smarter,
              analyze deeper, and land your dream job with confidence.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Product
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li><a href="/#features" className="hover:text-white">Features</a></li>
              <li><a href="/#how-it-works" className="hover:text-white">How it Works</a></li>
              <li><a href="/#pricing" className="hover:text-white">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Account
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li><Link to="/login" className="hover:text-white">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white">Register</Link></li>
              <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} HireSense AI. All rights reserved.
          </p>
          <p className="text-sm text-slate-500">
            Built with React + AI · KnightByte IO
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
