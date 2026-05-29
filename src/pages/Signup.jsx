import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { supabase } from '../supabaseClient.js';
import logo from "../assets/logo.png";
import {
  Mail, Lock, ArrowRight, User, ArrowLeft
} from 'lucide-react';

export default function Signup() {
  const { showToast } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Buyer'); // Buyer, Seller, Agent
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name || !email || !password) {
      showToast("Please complete all registration parameters.", "error");
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setErrorMsg(error.message);
        showToast(error.message, "error");
        setIsLoading(false);
        return;
      }

      // Force sign out immediately to prevent auto-login if email auto-confirm has enabled sessions
      await supabase.auth.signOut();

      // Store credentials/profile information in local storage to be read upon actual login sync
      const userProfile = {
        name,
        email,
        role,
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80",
        phone: "+1 (555) 902-1234",
        bio: `Elite ${role} on the DreamStay Homes portal.`,
        listingsCount: 0,
        savedCount: 0
      };

      // Persist in local storage so dynamic sync can construct the Supabase Profile record on first login
      localStorage.setItem('luxe_user', JSON.stringify(userProfile));

      showToast("Account created successfully.", "success");
      navigate('/login', {
        state: {
          email: email,
          successMessage: "Your account has been created. Please log in with your email and password to secure access."
        }
      });
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected registration error occurred.');
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

      {/* Column A: Information column */}
      <div className="hidden lg:flex flex-col justify-between bg-[#090e1a] border-r border-blue-500/10 p-16 select-none relative overflow-hidden text-white">

        {/* Ambient image background */}
        <div className="absolute inset-0 opacity-15">
          <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&h=1200&q=80" className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020205] to-transparent" />
        </div>

        <Link to="/" className="flex items-center gap-3 relative z-10 w-fit">
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
        </Link>

        <div className="relative z-10 max-w-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-950/20 border border-blue-500/25 rounded-full w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-blue-300 font-bold">SOVEREIGN PRIVILEGES</span>
          </div>
          <h2 className="font-serif text-3xl font-semibold leading-tight text-white">
            Register your private client account or broker profile.
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed font-light">
            Gain immediate verified credentials to publish villas, list apartments, bookmark saved assets, and send secure inquiries to real estate representatives.
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
            <span className="text-[10px] font-mono text-blue-400 font-bold block mb-1">MEMBERSHIP PRIVILEGES</span>
            <h1 className="text-2xl font-bold text-white">Create Access Key</h1>
            <p className="text-stone-400 text-xs mt-0.5 font-light">Please fulfill the verification credentials below.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-xs text-stone-200">

            {/* User role options selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-widest block mb-1">
                INTENDED MARKET ROLE
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Buyer', label: 'Buyer Seeking' },
                  { id: 'Seller', label: 'Seller Lister' },
                  { id: 'Agent', label: 'Verified Broker' }
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`p-3 rounded-xl border text-[10px] font-extrabold uppercase tracking-wide leading-tight transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${role === r.id
                      ? 'border-blue-500 bg-blue-500/10 text-blue-300 shadow-md'
                      : 'border-blue-500/10 hover:border-blue-500/30 text-stone-400'
                      }`}
                  >
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Handle Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">FULL INDIVIDUAL NAME</label>
              <div className="flex items-center gap-2 bg-[#05060f] border border-blue-500/15 p-3 rounded-xl">
                <User size={14} className="text-blue-400 shrink-0" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aria Thorne"
                  required
                  className="bg-transparent border-none text-xs w-full focus:outline-none placeholder-stone-500 font-semibold focus:ring-0 text-white"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">SECURE EMAIL ADDRESS</label>
              <div className="flex items-center gap-2 bg-[#05060f] border border-blue-500/15 p-3 rounded-xl">
                <Mail size={14} className="text-blue-400 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aria@example.com"
                  required
                  className="bg-transparent border-none text-xs w-full focus:outline-none placeholder-stone-500 font-semibold focus:ring-0 text-white"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">PASSWORD CHOOSE</label>
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
              <span>{isLoading ? "CREATING ACCOUNT..." : "Register Credentials"}</span>
              <ArrowRight size={14} />
            </button>

            {errorMsg && (
              <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl font-mono text-center text-[10px] uppercase tracking-wider animate-fadeIn">
                {errorMsg}
              </div>
            )}

          </form>

          <p className="text-center text-xs text-stone-400 mt-2">
            Already registered with DreamStay? <Link to="/login" className="text-blue-400 font-bold hover:underline">Sign In Portal</Link>
          </p>

        </div>
      </div>

    </div>
  );
}
