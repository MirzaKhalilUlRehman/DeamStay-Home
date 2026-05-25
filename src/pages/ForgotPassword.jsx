import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { Mail, ArrowLeft, Send, ShieldCheck } from 'lucide-react';

export default function ForgotPassword() {
  const { showToast } = useApp();
  const [email, setEmail] = useState('');
  const [dispatched, setDispatched] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setDispatched(true);
    showToast(`Private key reset dispatch has been forwarded to ${email}`, 'success');
  };

  return (
    <div className="min-h-[100vh] flex items-center justify-center p-8 bg-slate-50 dark:bg-black font-sans">
      
      {/* Back to entry */}
      <Link to="/login" className="fixed top-6 left-6 z-50 p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-150 dark:border-blue-900/20 text-blue-500 hover:text-blue-600 transition-colors uppercase font-mono text-[9px] font-bold flex items-center gap-1.5 shadow-sm">
        <ArrowLeft size={12} />
        <span>Return to Login</span>
      </Link>

      <div className="w-full max-w-md bg-white dark:bg-[#090e1a]/85 p-8 rounded-3xl border border-slate-200 dark:border-blue-900/25 shadow-2xl glass-panel">
        
        {!dispatched ? (
          /* Input Screen form */
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-xs text-slate-800 dark:text-stone-250">
            <div>
              <span className="text-[10px] font-mono text-blue-500 font-bold uppercase block mb-1">KEY RECOVERY PORTAL</span>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Recover Credentials</h1>
              <p className="text-stone-500 dark:text-stone-400 text-xs mt-0.5 font-light">Type your email to dispatch a security restoration link.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-stone-400 uppercase">VERIFIED EMAIL</label>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-black border border-slate-200 dark:border-blue-950 p-3.5 rounded-xl">
                <Mail size={14} className="text-blue-500 shrink-0" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aria.thorne@example.com" 
                  required
                  className="bg-transparent border-none text-xs w-full focus:outline-none placeholder-stone-500 font-semibold focus:ring-0 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full btn-premium py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow font-sans font-bold"
            >
              <Send size={13} />
              <span>Convene Recovery Dispatch</span>
            </button>
          </form>
        ) : (
          /* Dispatched Success screen layout */
          <div className="text-center flex flex-col items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Dispatch Completed</h2>
              <p className="text-stone-500 dark:text-stone-400 text-xs max-w-xs mt-2 leading-relaxed font-light">
                A private key recovery message has been transmitted to <span className="font-semibold text-blue-500 truncate">{email}</span>. Please verify your inbox folders.
              </p>
            </div>
            
            <Link 
              to="/login"
              className="bg-slate-50 dark:bg-blue-950/20 border border-slate-200 dark:border-blue-900/10 text-xs font-bold py-2.5 px-6 rounded-xl text-slate-705 dark:text-stone-300 hover:text-blue-600 transition-colors"
            >
              Return to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
