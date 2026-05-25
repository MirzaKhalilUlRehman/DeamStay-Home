import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { MapPin, Phone, Mail, Send, Award, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const { showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !text) {
      showToast("Please fill in all message details.", "error");
      return;
    }
    showToast(`Inquiry from "${name}" has been forwarded. Our managing partners will contact you within 12 hours.`, "success");
    setName('');
    setEmail('');
    setText('');
  };

  return (
    <div className="pt-24 pb-20 font-sans min-h-screen text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Titles */}
        <div className="text-center max-w-2xl mx-auto mb-16 select-none">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#a855f7] uppercase block mb-3">
            CONVENE ADVISORY
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Secure Communications
          </h1>
          <p className="text-stone-300 text-xs mt-3 select-none leading-relaxed font-light">
            Provide credentials and state objectives below to configure private lines of communication with DreamStay Homes managing partners.
          </p>
        </div>

        {/* Core Double grid panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start mt-10">
          
          {/* Main Form Fields (Col Span 2) */}
          <div className="lg:col-span-2 glass-panel p-8 rounded-3xl shadow-2xl">
            <span className="text-[10px] font-mono text-stone-400 font-bold uppercase block mb-6">TRANSMIT INQUIRY MEMORANDUM</span>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-xs text-stone-200 lg:text-sm">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">INDIVIDUAL NAME</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Duke Thorne"
                    className="bg-[#05060f] border border-purple-550/20 p-3 rounded-xl focus:outline-none placeholder-stone-500 font-semibold focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold text-stone-404 uppercase tracking-widest">PRIVATE SECURE EMAIL</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. duke@example.com"
                    className="bg-[#05060f] border border-purple-550/20 p-3 rounded-xl focus:outline-none placeholder-stone-500 font-semibold focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white font-sans"
                  />
                </div>

              </div>

              <div className="flex flex-col gap-1.5 focus:border-purple-500">
                <label className="text-[10px] font-mono font-bold text-stone-404 uppercase tracking-widest">OBJECTIVE INQUIRY DETAILS</label>
                <textarea 
                  rows={5}
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Describe your target residential portfolio, timeline constraints, or special tax requirements..."
                  className="bg-[#05060f] border border-purple-550/20 p-4 rounded-xl text-xs sm:text-sm focus:outline-none leading-relaxed placeholder-stone-500 text-white font-sans focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/15 text-[11px] leading-relaxed text-stone-400 font-mono">
                Verification checks run dynamically. Hacked entries are blocked. Thank you for respecting DreamStay Homes' strict signature integrity constraints.
              </div>

              <button 
                type="submit"
                className="w-full btn-premium text-white font-bold py-3.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Send size={14} />
                <span>Request Cryptographic line opening</span>
              </button>

            </form>
          </div>

          {/* Right Column Administrative locations (Col Span 1) */}
          <aside className="flex flex-col gap-6">
            
            <div className="glass-panel p-6 rounded-3xl shadow-xl flex flex-col gap-6 font-sans">
              
              <div>
                <span className="text-[10px] font-mono text-purple-400 font-bold block uppercase mb-4">PRIMARY BEVERLY COMPOUNDS</span>
                <div className="flex items-start gap-3 text-xs text-stone-300 font-sans">
                  <MapPin size={16} className="text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-stone-100">Loma Vista Headquarters</span>
                    <span className="text-[11px] block text-stone-400 mt-1 uppercase font-mono leading-relaxed">9405 Loma Vista Drive, CA 90210</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-purple-400 font-bold block uppercase mb-4">MIDDLE EAST HEADQUARTERS</span>
                <div className="flex items-start gap-3 text-xs text-stone-300">
                  <MapPin size={16} className="text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-stone-100 font-sans">Dubai Marina Heights</span>
                    <span className="text-[11px] block text-stone-400 mt-1 uppercase font-mono leading-relaxed">Al Marsa Lane, Marina, UAE</span>
                  </div>
                </div>
              </div>

              <hr className="border-purple-500/10" />

              <div className="flex flex-col gap-3 font-mono text-[11px] text-stone-350">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-purple-400 shrink-0" />
                  <span>+1 (555) 301-4491</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-purple-400 shrink-0" />
                  <span>concierge@luxevault.com</span>
                </div>
              </div>

            </div>

            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/15 text-[11px] leading-relaxed text-stone-400 flex gap-2 w-full font-mono">
              <ShieldCheck size={18} className="text-emerald-405 shrink-0" />
              <span>Security escort protocol is integrated in both locations. Armored transport coordination handles sovereign requests with validation hashes.</span>
            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}
