import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import PublicLayout from "../components/PublicLayout";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (!formData.email.trim()) return setError("Email zaroori hai"), false;
    if (!formData.password) return setError("Password zaroori hai"), false;
    if (!/\S+@\S+\.\S+/.test(formData.email)) return setError("Valid email daalo"), false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const response = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });
      login(response.data.user, response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login fail ho gaya");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout showFooter={false}>
      <div className="relative flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12 mesh-bg">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] opacity-30" />

        <div className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-2xl backdrop-blur-xl lg:grid-cols-2">
          {/* Left panel - branding */}
          <div className="hidden flex-col justify-center bg-gradient-to-br from-brand-600/20 to-violet-600/10 p-10 lg:flex">
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="mt-4 text-slate-400">
              Sign in to access your dashboard, track interview scores, and continue your AI-powered preparation.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2"><span className="text-brand-400">✓</span> Personalized analytics</li>
              <li className="flex items-center gap-2"><span className="text-brand-400">✓</span> Skill gap insights</li>
              <li className="flex items-center gap-2"><span className="text-brand-400">✓</span> Interview history</li>
            </ul>
          </div>

          {/* Right panel - form */}
          <div className="p-8 sm:p-10">
            <h1 className="text-2xl font-bold text-white">Sign In</h1>
            <p className="mt-2 text-sm text-slate-400">Enter your credentials to continue</p>

            {error && (
              <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className="input-field" autoComplete="email" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="input-field" autoComplete="current-password" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              No account?{" "}
              <Link to="/register" className="font-medium text-brand-400 hover:text-brand-300">Create one free</Link>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Login;
