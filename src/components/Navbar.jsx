import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { 
  Menu, X, Heart, PlusCircle, 
  User, Sun, Moon, LogOut, FileText, Settings, PhoneCall
} from 'lucide-react';

export default function Navbar() {
  const { 
    currentUser, logout, favorites, 
    darkMode, toggleDarkMode 
  } = useApp();
  
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowUserDropdown(false);
  }, [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? `${darkMode ? 'bg-black/92 border-b border-blue-900/40 text-white shadow-[0_4px_25px_rgba(37,99,235,0.15)]' : 'bg-white/92 border-b border-slate-200 text-slate-900 shadow-[0_4px_25px_rgba(15,23,42,0.05)]'} backdrop-blur-md py-3` 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center bg-transparent">
          
          {/* Logo Mark with luxury gold border details */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#020617] to-black border border-luxury-purple/40 flex items-center justify-center shadow-lg hover:border-blue-400 transition-all duration-300">
              <div className="w-3.5 h-3.5 border-2 border-blue-500 rotate-45 flex items-center justify-center">
                <span className="font-serif font-extrabold text-[10px] text-blue-500 -rotate-45">D</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif tracking-widest text-lg font-bold dark:text-white text-slate-900 uppercase italic">
                DREAM<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-500">STAY</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#3b82f6] font-mono -mt-1 font-bold">HOMES</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-5 lg:gap-6">
            <Link to="/" className={`text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-luxury-purple ${location.pathname === '/' ? 'text-luxury-purple border-b-2 border-luxury-purple pb-0.5' : 'dark:text-stone-300 text-slate-750'}`}>
              Home
            </Link>
            <Link to="/buy" className={`text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-luxury-purple ${location.pathname === '/buy' ? 'text-luxury-purple border-b-2 border-luxury-purple pb-0.5' : 'dark:text-stone-300 text-slate-755'}`}>
              Buy
            </Link>
            <Link to="/rent" className={`text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-luxury-purple ${location.pathname === '/rent' ? 'text-luxury-purple border-b-2 border-luxury-purple pb-0.5' : 'dark:text-stone-300 text-slate-755'}`}>
              Rent
            </Link>
            <Link to="/sell" className={`text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-luxury-purple ${location.pathname === '/sell' ? 'text-luxury-purple border-b-2 border-luxury-purple pb-0.5' : 'dark:text-stone-300 text-slate-755'}`}>
              Sell
            </Link>
            <Link to="/apartments" className={`text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-luxury-purple ${location.pathname === '/apartments' ? 'text-luxury-purple border-b-2 border-luxury-purple pb-0.5' : 'dark:text-stone-300 text-slate-755'}`}>
              Apartments
            </Link>
            <Link to="/villas" className={`text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-luxury-purple ${location.pathname === '/villas' ? 'text-luxury-purple border-b-2 border-luxury-purple pb-0.5' : 'dark:text-stone-300 text-slate-755'}`}>
              Villas
            </Link>
            <Link to="/contact" className={`text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-luxury-purple ${location.pathname === '/contact' ? 'text-luxury-purple border-b-2 border-luxury-purple pb-0.5' : 'dark:text-stone-300 text-slate-755'}`}>
              Contact
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Quick Consultation Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full dark:bg-blue-950/20 bg-blue-50 border border-luxury-purple/30 text-[10px] font-mono text-luxury-purple uppercase font-bold shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <PhoneCall size={10} className="text-blue-500 animate-pulse" />
              <span>Premium Support</span>
            </div>

            {/* Dark Mode Theme Indicator with blue class triggers */}
            <button 
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl dark:text-stone-400 text-slate-600 dark:hover:text-luxury-purple hover:text-luxury-purple dark:hover:bg-blue-950/20 hover:bg-blue-50/50 transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {currentUser ? (
              <>
                {/* Saved Collection shortcut */}
                <Link 
                  to="/favorites" 
                  className="p-2.5 rounded-xl dark:text-stone-400 text-slate-600 dark:hover:text-luxury-purple hover:text-luxury-purple dark:hover:bg-blue-950/20 hover:bg-blue-50/50 relative transition-colors"
                  title="Saved Homes"
                >
                  <Heart size={18} />
                  {favorites.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                      {favorites.length}
                    </span>
                  )}
                </Link>

                {/* Listing Agent/Seller helper link */}
                {(currentUser.role === 'Seller' || currentUser.role === 'Agent') && (
                  <Link 
                    to="/add-property" 
                    className="flex justify-center items-center gap-2 btn-premium text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg"
                  >
                    <PlusCircle size={14} />
                    <span>List Property</span>
                  </Link>
                )}

                {/* User Dropdown controls */}
                <div className="relative">
                  <button 
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 border border-luxury-purple/25 rounded-full p-1 pl-1 pr-3.5 dark:hover:border-luxury-purple hover:border-blue-400 transition-all bg-luxury-bg-deep cursor-pointer"
                  >
                    <img 
                      src={currentUser.avatar} 
                      alt="" 
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-left">
                      <span className="text-[10px] font-bold dark:text-white text-slate-900 block leading-tight max-w-[85px] truncate">{currentUser.name}</span>
                      <span className="text-[8px] font-black text-luxury-purple block leading-tight uppercase font-mono">{currentUser.role}</span>
                    </div>
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-3.5 w-56 dark:bg-neutral-950 bg-white backdrop-blur-md rounded-2xl shadow-2xl border border-luxury-purple/20 py-3 z-50 animate-fadeIn text-slate-900 dark:text-white">
                      <div className="px-4 py-2 border-b border-luxury-purple/10 mb-2">
                        <span className="text-[9px] text-luxury-purple font-mono block uppercase">Premium Member</span>
                        <span className="text-xs font-bold dark:text-white text-slate-900 truncate block">{currentUser.name}</span>
                      </div>
                      <Link to="/dashboard" className="flex items-center gap-2.5 px-4 py-2 dark:text-stone-350 text-slate-700 dark:hover:bg-blue-950/20 hover:bg-slate-50 hover:text-luxury-purple text-xs font-semibold">
                        <FileText size={14} className="dark:text-stone-400 text-slate-500" />
                        Dashboard Area
                      </Link>
                      <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2 dark:text-stone-350 text-slate-700 dark:hover:bg-blue-950/20 hover:bg-slate-50 hover:text-luxury-purple text-xs font-semibold">
                        <Settings size={14} className="dark:text-stone-400 text-slate-500" />
                        Account Settings
                      </Link>
                      <hr className="my-2 border-luxury-purple/10" />
                      <button 
                        onClick={() => { logout(); navigate('/'); }}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-rose-500 hover:bg-rose-500/5 text-xs font-semibold cursor-pointer"
                      >
                        <LogOut size={14} />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className="text-xs font-semibold dark:text-stone-300 text-slate-700 dark:hover:text-luxury-purple hover:text-luxury-purple px-3 py-2 transition-all font-mono uppercase tracking-wider"
                >
                  Log In
                </Link>
                <Link 
                  to="/signup" 
                  className="btn-premium text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg font-sans"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <button 
              onClick={toggleDarkMode}
              className="p-2 dark:text-stone-400 text-slate-650 dark:hover:text-luxury-purple hover:text-luxury-purple cursor-pointer"
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 rounded-xl dark:bg-neutral-950 bg-white dark:text-white text-slate-900 border border-luxury-purple/20 cursor-pointer"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden dark:bg-black/95 bg-[#f8fafc]/98 backdrop-blur-md border-b border-luxury-purple/20 px-4 pt-4 pb-6 flex flex-col gap-4 animate-fadeIn">
          <Link to="/" className="text-xs uppercase tracking-wider font-bold dark:text-stone-200 text-slate-800 hover:text-luxury-purple">Home</Link>
          <Link to="/buy" className="text-xs uppercase tracking-wider font-bold dark:text-stone-200 text-slate-800 hover:text-luxury-purple">Buy</Link>
          <Link to="/rent" className="text-xs uppercase tracking-wider font-bold dark:text-stone-200 text-slate-800 hover:text-luxury-purple">Rent</Link>
          <Link to="/sell" className="text-xs uppercase tracking-wider font-bold dark:text-stone-200 text-slate-800 hover:text-luxury-purple">Sell</Link>
          <Link to="/apartments" className="text-xs uppercase tracking-wider font-bold dark:text-stone-200 text-slate-800 hover:text-luxury-purple">Apartments</Link>
          <Link to="/villas" className="text-xs uppercase tracking-wider font-bold dark:text-stone-200 text-slate-800 hover:text-luxury-purple">Villas</Link>
          <Link to="/contact" className="text-xs uppercase tracking-wider font-bold dark:text-stone-200 text-slate-800 hover:text-luxury-purple">Contact</Link>
          
          <hr className="border-luxury-purple/10" />

          {currentUser ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 p-2 dark:bg-blue-950/20 bg-blue-50 rounded-xl border border-luxury-purple/10">
                <img src={currentUser.avatar} className="w-9 h-9 rounded-full object-cover" alt="" referrerPolicy="no-referrer" />
                <div>
                  <span className="font-bold block text-xs dark:text-white text-slate-900 leading-tight">{currentUser.name}</span>
                  <span className="text-[9px] font-bold text-luxury-purple uppercase font-mono">{currentUser.role}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Link to="/dashboard" className="p-2.5 rounded-xl dark:bg-blue-950/20 bg-blue-10/20 text-center text-xs font-semibold dark:text-stone-200 text-slate-700 border border-luxury-purple/10 hover:border-blue-400">
                  Dashboard
                </Link>
                <Link to="/favorites" className="p-2.5 rounded-xl dark:bg-blue-950/20 bg-blue-10/20 text-center text-xs font-semibold dark:text-stone-200 text-slate-700 border border-luxury-purple/10 hover:border-blue-400">
                  Saved ({favorites.length})
                </Link>
              </div>

              {(currentUser.role === 'Seller' || currentUser.role === 'Agent') && (
                <Link 
                  to="/add-property" 
                  className="btn-premium text-white text-center text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"
                >
                  <PlusCircle size={15} />
                  List New Property
                </Link>
              )}

              <button 
                onClick={() => { logout(); navigate('/'); }}
                className="w-full text-center py-2 text-xs font-bold text-rose-500 border border-rose-500/20 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 cursor-pointer"
              >
                Logout Account
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link 
                to="/login" 
                className="text-center font-bold dark:text-stone-200 text-slate-700 py-2.5 border border-luxury-purple/20 rounded-xl text-xs dark:bg-blue-950/20 bg-blue-50/50"
              >
                Log In
              </Link>
              <Link 
                to="/signup" 
                className="text-center font-bold btn-premium text-white py-3 rounded-xl text-xs"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
