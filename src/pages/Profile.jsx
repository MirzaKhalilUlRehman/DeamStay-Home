import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { ArrowLeft, User, Mail, Phone, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser, updateProfile, showToast } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [role, setRole] = useState(currentUser?.role || 'Buyer');
  const [notifFlag, setNotifFlag] = useState(true);

  if (!currentUser) {
    return (
      <div className="pt-32 text-center pb-20 font-sans min-h-screen">
        <h2 className="text-2xl font-bold text-white">Unauthenticated Portal</h2>
        <p className="text-stone-400 text-xs mt-2 font-mono">Sign in to edit your verified DreamStay account credentials.</p>
        <Link to="/login" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold py-3.5 px-6 rounded-xl inline-block mt-6 hover:brightness-110 shadow-lg">
          Authenticate Credentials
        </Link>
      </div>
    );
  }

  const handleSave = (e) => {
    e.preventDefault();
    if (!name) {
      showToast("Please enter individual name.", "error");
      return;
    }
    updateProfile({ name, phone, bio, role });
    navigate('/dashboard');
  };

  return (
    <div className="pt-24 pb-20 font-sans min-h-screen text-stone-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#3b82f6] hover:text-blue-400 transition-colors uppercase mb-8">
          <ArrowLeft size={14} />
          <span>Exit To Console</span>
        </Link>

        <div className="bg-[#090e1a]/85 border border-blue-900/25 p-8 rounded-3xl shadow-2xl glass-panel text-stone-100">
          
          <div className="flex items-start gap-4 pb-6 border-b border-blue-950 mb-8 items-center">
            <img src={currentUser.avatar} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/20" alt="" referrerPolicy="no-referrer" />
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">{currentUser.role} SETTINGS</span>
              <h1 className="text-2xl font-bold text-white">Profile Credentials</h1>
            </div>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-6 text-xs text-stone-300">
            
            {/* Split layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-blue-950">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-stone-400 uppercase">FULL MEMBER NAME</label>
                <div className="flex items-center gap-2 bg-black border border-blue-950 p-3 rounded-xl">
                  <User size={14} className="text-blue-500 shrink-0" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-transparent border-none text-xs w-full focus:outline-none font-semibold text-white focus:ring-0"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 opacity-60">
                <label className="text-[10px] font-mono font-bold text-stone-400 uppercase">EMAIL (SECURE RIGID)</label>
                <div className="flex items-center gap-2 bg-neutral-900 border border-blue-950 p-3 rounded-xl">
                  <Mail size={14} className="text-blue-500 shrink-0" />
                  <input 
                    type="email" 
                    value={currentUser.email}
                    disabled
                    className="bg-transparent border-none text-xs w-full focus:outline-none font-semibold text-stone-400 focus:ring-0"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-stone-400 uppercase">CONTACT MOBILE</label>
                <div className="flex items-center gap-2 bg-black border border-blue-950 p-3 rounded-xl">
                  <Phone size={14} className="text-blue-500 shrink-0" />
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="bg-transparent border-none text-xs w-full focus:outline-none text-white font-semibold focus:ring-0"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-stone-400 uppercase">PROFILE ACCESS PRIVILEGE</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bg-black border border-blue-950 p-3 rounded-xl focus:outline-none text-xs font-semibold text-white cursor-pointer"
                >
                  <option value="Buyer">Buyer Seeker Role</option>
                  <option value="Seller">Seller Lister Role</option>
                  <option value="Agent">Verified Roster Broker</option>
                </select>
              </div>

            </div>

            {/* Profile Bio */}
            <div className="pb-6 border-b border-blue-950">
              <label className="text-[10px] font-mono font-bold text-stone-400 uppercase block mb-1.5">MEMBER BIOGRAPHICAL DISCLOSURE</label>
              <textarea 
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Disclose a brief overview of your family office investment priorities or brokerage specialty..."
                className="bg-black border border-blue-950 p-3.5 rounded-xl w-full text-xs focus:outline-none leading-relaxed text-white focus:ring-0"
              />
            </div>

            {/* Switch option indicators */}
            <div className="flex flex-col gap-4 font-sans text-stone-300">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest block mb-1">TRANSMISSION SUMMARY</span>
              
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={notifFlag}
                  onChange={() => setNotifFlag(!notifFlag)}
                  className="rounded border-blue-900 text-blue-600 focus:ring-blue-500 h-4 w-4 bg-transparent cursor-pointer"
                />
                <span className="text-xs font-semibold">Broadcast email summaries when agents answer listings inquiry</span>
              </label>
            </div>

            {/* Actions triggers */}
            <button 
              type="submit"
              className="mt-4 w-full btn-premium py-4 px-12 rounded-2xl text-xs flex items-center justify-center gap-2 shadow font-sans font-bold text-white cursor-pointer"
            >
              <CheckCircle size={15} />
              <span>Perform Profile Update</span>
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}
