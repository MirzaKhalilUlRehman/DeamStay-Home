import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { 
  Mail, Phone, MapPin, Send, Facebook, Instagram, Twitter, Linkedin
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { showToast } = useApp();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    showToast(`Successfully subscribed "${email}" to DreamStay newsletter.`, 'success');
    setEmail('');
  };

  return (
    <footer className="relative dark:bg-black bg-slate-100 text-slate-700 dark:text-stone-300 pt-20 pb-10 border-t dark:border-blue-900/30 border-slate-200 font-sans z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b dark:border-blue-950/30 border-slate-200">
          
          {/* Brand Info Column */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg dark:bg-[#090e1a] bg-blue-50/50 border border-luxury-purple/45 flex items-center justify-center">
                <div className="w-3" />
                <div className="w-3 h-3 border border-blue-500 rotate-45 flex items-center justify-center shrink-0">
                  <span className="font-serif font-extrabold text-[8px] text-blue-500 -rotate-45">D</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif tracking-widest text-[15px] font-bold dark:text-white text-slate-900 uppercase italic">
                  DREAM<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-500 font-bold">STAY</span>
                </span>
                <span className="text-[8px] uppercase tracking-widest text-blue-500 font-mono -mt-1 font-bold">HOMES</span>
              </div>
            </Link>
            <p className="text-xs text-[#52525b] dark:text-stone-400 leading-relaxed font-sans max-w-sm font-light">
              Discover your dream stay with DreamStay Homes. We connect premium buyers and guests with curated, high-end residential listings and holiday stays globally.
            </p>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-lg dark:bg-blue-950/20 bg-blue-50/50 border dark:border-blue-900/10 border-slate-200 dark:hover:border-blue-500 hover:border-blue-500 dark:text-stone-400 text-slate-700 hover:text-blue-500 transition-colors cursor-pointer"><Facebook size={15} /></span>
              <span className="p-2.5 rounded-lg dark:bg-blue-950/20 bg-blue-50/50 border dark:border-blue-900/10 border-slate-200 dark:hover:border-blue-500 hover:border-blue-500 dark:text-stone-400 text-slate-700 hover:text-blue-500 transition-colors cursor-pointer"><Instagram size={15} /></span>
              <span className="p-2.5 rounded-lg dark:bg-blue-950/20 bg-blue-50/50 border dark:border-blue-900/10 border-slate-200 dark:hover:border-blue-500 hover:border-blue-500 dark:text-stone-400 text-slate-700 hover:text-blue-500 transition-colors cursor-pointer"><Twitter size={15} /></span>
              <span className="p-2.5 rounded-lg dark:bg-blue-950/20 bg-blue-50/50 border dark:border-blue-900/10 border-slate-200 dark:hover:border-blue-500 hover:border-blue-500 dark:text-stone-400 text-slate-700 hover:text-blue-500 transition-colors cursor-pointer"><Linkedin size={15} /></span>
            </div>
          </div>

          {/* Quick Nav Options */}
          <div>
            <h3 className="font-bold text-xs tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-6 font-mono">Explorer Links</h3>
            <ul className="flex flex-col gap-3 text-xs">
              <li><Link to="/buy" className="hover:text-blue-500 text-slate-650 dark:text-stone-400 transition-colors">Buy Properties</Link></li>
              <li><Link to="/rent" className="hover:text-blue-500 text-slate-650 dark:text-stone-400 transition-colors">Rent Properties</Link></li>
              <li><Link to="/sell" className="hover:text-blue-500 text-slate-650 dark:text-stone-400 transition-colors">List Your Property</Link></li>
              <li><Link to="/contact" className="hover:text-blue-500 text-slate-650 dark:text-stone-400 transition-colors">Contact Advisor</Link></li>
            </ul>
          </div>

          {/* Property types selection map */}
          <div>
            <h3 className="font-bold text-xs tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-6 font-mono">Properties</h3>
            <ul className="flex flex-col gap-3 text-xs">
              <li><Link to="/villas" className="hover:text-blue-500 text-slate-650 dark:text-stone-400 transition-colors">Villas & Mansions</Link></li>
              <li><Link to="/apartments" className="hover:text-blue-500 text-slate-650 dark:text-stone-400 transition-colors">Skyline Apartments</Link></li>
              <li><Link to="/properties" className="hover:text-blue-500 text-slate-650 dark:text-stone-400 transition-colors">All Properties</Link></li>
            </ul>
          </div>

          {/* Contact Details & Newsletter */}
          <div className="flex flex-col gap-5">
            <h3 className="font-bold text-xs tracking-wider uppercase text-blue-600 dark:text-blue-400 font-mono">Contact Us</h3>
            <div className="flex flex-col gap-3 text-xs text-slate-650 dark:text-stone-400 pb-1">
              <div className="flex items-center gap-2.5">
                <MapPin size={14} className="text-blue-500 dark:text-blue-400 shrink-0" />
                <span>9405 Loma Vista Dr, Beverly Hills, CA</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-blue-500 dark:text-blue-400 shrink-0" />
                <span>+1 (555) 301-4491</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-blue-500 dark:text-blue-400 shrink-0" />
                <span>concierge@dreamstayhomes.com</span>
              </div>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mt-2">
              <label className="text-[10px] text-slate-500 dark:text-stone-400 font-mono font-bold uppercase">Subscribe to Newsletter</label>
              <div className="relative flex items-center dark:bg-blue-950/20 bg-blue-50 border dark:border-blue-900/20 border-slate-200 rounded-xl overflow-hidden p-1">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-xs dark:text-white text-slate-900 focus:outline-none px-3 py-2 w-full placeholder-stone-500 font-sans"
                />
                <button 
                  type="submit"
                  className="btn-premium text-white p-2.5 rounded-lg transition-all flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <Send size={12} />
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Legal copyrights */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 text-[11px] text-slate-500 dark:text-stone-550 font-mono">
          <p>© {new Date().getFullYear()} DreamStay Homes Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-500 text-slate-605 dark:text-stone-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-500 text-slate-605 dark:text-stone-500 transition-colors">Advisory Terms</a>
            <a href="#" className="hover:text-blue-500 text-slate-605 dark:text-stone-500 transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-blue-500 text-slate-605 dark:text-stone-500 transition-colors">Sitemap</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
