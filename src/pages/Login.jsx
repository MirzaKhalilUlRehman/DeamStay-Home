import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { supabase } from '../supabaseClient.js';
import logo from "../assets/logo.png";
import {
  Mail, Lock, ArrowRight, ArrowLeft
} from 'lucide-react';

export default function Login() {
  const { login, showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Buyer'); // Buyer, Seller, Agent
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      showToast("Please enter connection credentials.", "error");
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMsg(error.message);
        showToast(error.message, "error");
        setIsLoading(false);
        return;
      }

      if (!data.session) {
        setErrorMsg("Please confirm your email address before signing in.");
        showToast("Access blocked: Session is unestablished.", "error");
        setIsLoading(false);
        return;
      }

      const success = await login(email, password, role);
      if (success) {
        showToast("Logged in successfully!", "success");
        navigate('/'); // Redirect the user to the Home page ('/')
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#020617] text-slate-100 font-sans">

      {/* Back button shortcut */}
      <Link to="/" className="fixed top-6 left-6 z-50 p-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-blue-500/20 text-[#3b82f6] hover:text-[#3b82f6]/80 transition-colors uppercase font-mono text-[9px] font-bold flex items-center gap-1.5 shadow-md">
        <ArrowLeft size={12} />
        <span>Return Home</span>
      </Link>

      {/* Column A: Editorial layout representation */}
      <div className="hidden lg:flex flex-col justify-between bg-[#090e1a] border-r border-blue-500/10 p-16 select-none relative overflow-hidden text-white">

        {/* Background artwork */}
        <div className="absolute inset-0 opacity-15">
          <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&h=1200&q=80" className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020205] to-transparent" />
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="DreamStay Logo"
              className="w-20 h-20 object-contain rounded-full border-2 border-luxury-purple/30 shadow-lg"
            />

            <div className="flex flex-col">
              <span className="font-serif tracking-widest text-lg font-bold text-white">
                DREAM
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-500">
                  STAY
                </span>
              </span>

              <span className="text-[9px] uppercase tracking-widest text-[#3b82f6] font-mono -mt-1 font-bold">
                HOMES
              </span>
            </div>
          </Link>
        </div>

        <div className="relative z-10 max-w-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-950/20 border border-blue-500/25 rounded-full w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-blue-300 font-bold">PREMIUM MEMBER GATEWAY</span>
          </div>
          <h2 className="font-serif text-3xl font-semibold leading-tight text-white">
            Connecting premium buyers with elite properties.
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed font-light">
            Authenticate to sync properties locally with your custom watchlist, manage active residential portfolios, and engage with verified specialist agents.
          </p>
        </div>

        <p className="text-[10px] font-mono text-stone-500 relative z-10">
          © {new Date().getFullYear()} DreamStay Homes Inc. Elegant living.
        </p>

      </div>

      {/* Column B: Forms card layout */}
      <div className="flex items-center justify-center p-8 bg-[#020205]/40">
        <div className="w-full max-w-md flex flex-col gap-8 glass-panel p-8 rounded-3xl shadow-2xl">

          <div className="text-center sm:text-left">
            <span className="text-[10px] font-mono text-blue-400 font-bold block mb-1">MEMBER ACCESS PORTAL</span>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-stone-400 text-xs mt-0.5 font-light">Please sign in with your email and password.</p>
          </div>

          {location.state?.successMessage && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-2xl text-[11px] leading-relaxed animate-fadeIn font-sans">
              <span className="font-mono text-[9px] font-black block uppercase tracking-widest text-[#10b981] mb-1">REGISTRATION COMPLETED</span>
              {location.state.successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-xs text-stone-200">

            {/* User Role selection segment */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-widest block mb-1">
                CHOOSE INTENDED VIEW ROLE
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Buyer', label: 'Buyer' },
                  { id: 'Seller', label: 'Seller' },
                  { id: 'Agent', label: 'Agent' }
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${role === r.id
                      ? 'border-blue-500 bg-blue-500/10 text-blue-300 shadow-md'
                      : 'border-blue-500/10 hover:border-blue-500/30 text-stone-400'
                      }`}
                  >
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">EMAIL ADDRESS</label>
              <div className="flex items-center gap-2 bg-[#05060f] border border-blue-500/15 p-3 rounded-xl">
                <Mail size={14} className="text-blue-400 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="bg-transparent border-none text-xs w-full focus:outline-none placeholder-stone-500 font-semibold focus:ring-0 text-white"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">PASSWORD SECURE</label>
                <span className="text-[10px] font-bold text-blue-400 hover:underline cursor-pointer" onClick={() => showToast("Password restoration code transmitted.", "info")}>Forgot Key?</span>
              </div>
              <div className="flex items-center gap-2 bg-[#05060f] border border-blue-500/15 p-3 rounded-xl">
                <Lock size={14} className="text-blue-400 shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="bg-transparent border-none text-xs w-full focus:outline-none placeholder-stone-500 focus:ring-0 text-white"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-premium text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50 font-sans"
            >
              <span>{isLoading ? "AUTHENTICATING..." : "Access Secure Portal"}</span>
              <ArrowRight size={14} />
            </button>

            {errorMsg && (
              <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl font-mono text-center text-[10px] uppercase tracking-wider animate-fadeIn">
                {errorMsg}
              </div>
            )}

          </form>

          <div className="flex flex-col gap-4 font-sans select-none">

            <p className="text-center text-xs text-stone-400 mt-2 font-light">
              New seeker to DreamStay Homes? <Link to="/signup" className="text-blue-400 font-bold hover:underline">Register Credentials</Link>
            </p>

          </div>

        </div>
      </div>

    </div>
  );
}
