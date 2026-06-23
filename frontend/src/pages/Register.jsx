import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import PublicLayout from "../components/PublicLayout";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) return setError("Name zaroori hai"), false;
    if (!formData.email.trim()) return setError("Email zaroori hai"), false;
    if (!/\S+@\S+\.\S+/.test(formData.email)) return setError("Valid email daalo"), false;
    if (!formData.password) return setError("Password zaroori hai"), false;
    if (formData.password.length < 6) return setError("Password kam se kam 6 characters ka hona chahiye"), false;
    if (formData.password !== formData.confirmPassword) return setError("Passwords match nahi kar rahe"), false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      setSuccess(response.message || "Account created successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Registration fail ho gaya");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout showFooter={false}>
      <div className="relative flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12 mesh-bg">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] opacity-30" />

        <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          <h1 className="text-2xl font-bold text-white">Create Your Account</h1>
          <p className="mt-2 text-sm text-slate-400">Start your AI interview journey today — it's free</p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
          )}
          {success && (
            <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              {success} Redirecting to sign in...
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" className="input-field" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className="input-field" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min 6 characters" className="input-field" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password" className="input-field" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-brand-400 hover:text-brand-300">Sign in</Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Register;
