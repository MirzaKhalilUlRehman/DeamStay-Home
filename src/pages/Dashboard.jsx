import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import PropertyCard from '../components/PropertyCard.jsx';
import { supabase } from '../supabaseClient.js';
import { 
  FileText, Heart, PlusCircle, Settings, 
  Trash2, User, ChevronRight, Activity, TrendingUp, DollarSign,
  PhoneCall, ShieldCheck, Mail, ArrowUpRight, X, Upload, Loader2
} from 'lucide-react';

export default function Dashboard() {
  const { 
    currentUser, properties, favorites, deleteProperty, showToast, fetchProperties, uploadFileToStorage 
  } = useApp();

  // State configurations for modal adding property
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('villa');
  const [beds, setBeds] = useState('3');
  const [baths, setBaths] = useState('2');
  const [description, setDescription] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftId, setDraftId] = useState(() => self.crypto?.randomUUID ? self.crypto.randomUUID() : Math.random().toString(36).substring(2, 15));

  const resetForm = () => {
    setTitle('');
    setLocation('');
    setPrice('');
    setType('villa');
    setBeds('3');
    setBaths('2');
    setDescription('');
    setUploadedImages([]);
    setDraftId(self.crypto?.randomUUID ? self.crypto.randomUUID() : Math.random().toString(36).substring(2, 15));
  };

  const handleFiles = async (files) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const imageFiles = files.filter(f => {
      const ext = f.name.split('.').pop().toLowerCase();
      return validTypes.includes(f.type) || ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
    });

    if (imageFiles.length === 0) {
      showToast("Only JPG, PNG, and WebP images are allowed.", "error");
      return;
    }

    setIsUploading(true);
    const urls = [];
    for (const file of imageFiles) {
      try {
        const result = await uploadFileToStorage(file, 'properties', draftId);
        if (result) {
          urls.push(result);
        }
      } catch (err) {
        console.error("Upload error:", err);
        showToast("Asset upload failed.", "error");
      }
    }
    
    if (urls.length > 0) {
      setUploadedImages(prev => [...prev, ...urls]);
      showToast(`Uploaded ${urls.length} premium image(s) successfully!`, "success");
    }
    setIsUploading(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validations: all fields required, price must be number
    if (!title || !location || !price || !type || !beds || !baths || !description) {
      showToast("All fields are strictly required.", "error");
      return;
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      showToast("Price must be a valid positive number.", "error");
      return;
    }

    if (uploadedImages.length === 0) {
      showToast("Please drag & drop or select at least one property photograph.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const mainImageObj = uploadedImages[0];
      const mainImagePath = (mainImageObj && typeof mainImageObj === 'object') ? (mainImageObj.url || mainImageObj.path) : mainImageObj;
      const dbImagePaths = uploadedImages.map(img => (img && typeof img === 'object') ? (img.url || img.path) : img);

      const formData = {
        title,
        location,
        price: numPrice,
        type,
        beds: parseInt(beds),
        baths: parseFloat(baths),
        description,
        image: mainImagePath,
        images: dbImagePaths,
        purpose: 'sale',
        address: `${location}, Private Sector`,
        area: 3200, // standard luxurious square feet
        featured: false,
        furnished: true,
        parking: true,
        swimming_pool: true,
        garden: true,
        amenities: ["Bespoke Fittings", "High-Security Escrow", "Luxe Balcony"],
        year_built: 2026,
        status: 'available',
        agent: {
          name: currentUser.name,
          avatar: currentUser.avatar,
          phone: currentUser.phone || "+1 (555) 789-0123",
          email: currentUser.email
        }
      };

      // Direct insertion call as requested: supabase.from('your_table_name').insert([formData])
      const { data, error } = await supabase
        .from('properties')
        .insert([formData])
        .select();

      if (error) {
        throw error;
      }

      showToast("Property listing successfully recorded in live database!", "success");
      
      // Refresh seller's property list as requested
      await fetchProperties();
      
      // Close modal and reset state
      setIsAddModalOpen(false);
      resetForm();

    } catch (err) {
      console.error("Direct Database Insertion Error:", err);
      showToast(`Submission failure: ${err.message || 'Check database access'}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="pt-32 text-center pb-20 font-sans min-h-screen">
        <h2 className="font-serif text-2xl font-bold text-white">Unauthenticated Portal</h2>
        <p className="text-stone-400 text-xs mt-2 font-mono">You must sign in to navigate your custom real estate dashboard.</p>
        <Link to="/login" className="bg-gradient-to-r from-luxury-gold to-luxury-gold-muted text-zinc-950 text-xs font-bold py-3.5 px-6 rounded-xl inline-block mt-6 hover:brightness-110 shadow-lg">
          Authenticate Credentials
        </Link>
      </div>
    );
  }

  // Filter listings published by active user (Seller or Agent)
  const myProperties = properties.filter(p => p.agent?.email === currentUser.email);

  // Filter properties saved in active user's favorites
  const savedProperties = properties.filter(p => favorites.includes(p.id));

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(2)}M`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <div className="pt-28 pb-20 font-sans min-h-screen text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-transparent">
        
        {/* Core welcoming block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-luxury-gold/15 mb-10 gap-4 bg-transparent">
          <div className="flex items-center gap-4 bg-transparent">
            <img 
              src={currentUser.avatar} 
              alt="" 
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-luxury-gold/20 shadow-xl"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-luxury-gold font-bold uppercase tracking-wider">{currentUser.role} CONSOLE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Active Verified Connection" />
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">Greetings, {currentUser.name}</h1>
              <p className="text-stone-400 text-xs mt-0.5">Manage your saved listings, communications, and properties catalog.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 w-full md:w-auto bg-transparent">
            <Link to="/profile" className="flex items-center justify-center p-3.5 rounded-xl border border-luxury-gold/20 text-stone-300 hover:text-luxury-gold transition-colors bg-luxury-card hover:border-luxury-gold shadow-md" title="Profile Configuration">
              <Settings size={16} />
            </Link>
            {(currentUser.role === 'Seller' || currentUser.role === 'Agent') && (
              <>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex-grow md:flex-none flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold px-5 py-3.5 rounded-xl shadow-lg hover:brightness-110 transition-all cursor-pointer border border-emerald-500/20"
                >
                  <PlusCircle size={15} />
                  <span>➕ Add Property</span>
                </button>
                <Link 
                  to="/add-property" 
                  className="flex-grow md:flex-none flex items-center justify-center gap-1.5 bg-gradient-to-r from-luxury-gold to-luxury-gold-muted text-zinc-950 text-xs font-bold px-5 py-3.5 rounded-xl shadow-lg hover:brightness-110 transition-all"
                >
                  <PlusCircle size={15} />
                  <span>Upload Asset Page</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Dynamic transaction metrics panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 bg-transparent">
          
          <div className="bg-luxury-card p-5 rounded-3xl border border-luxury-gold/15 flex items-center justify-between shadow-xl">
            <div>
              <span className="text-[10px] font-mono text-stone-400 font-bold block uppercase">Favorited Estates</span>
              <span className="font-serif text-2xl font-bold text-white mt-1 block">{favorites.length} Items</span>
            </div>
            <div className="p-3.5 rounded-xl bg-rose-500/10 text-rose-455"><Heart size={18} fill="#f43f5e" /></div>
          </div>

          <div className="bg-luxury-card p-5 rounded-3xl border border-luxury-gold/15 flex items-center justify-between shadow-xl">
            <div>
              <span className="text-[10px] font-mono text-stone-400 font-bold block uppercase">Active Publications</span>
              <span className="font-serif text-2xl font-bold text-white mt-1 block">{myProperties.length} Listed</span>
            </div>
            <div className="p-3.5 rounded-xl bg-luxury-gold/10 text-luxury-gold"><FileText size={18} /></div>
          </div>

          <div className="bg-luxury-card p-5 rounded-3xl border border-luxury-gold/15 flex items-center justify-between shadow-xl">
            <div>
              <span className="text-[10px] font-mono text-stone-400 font-bold block uppercase">Concierge Inquiries</span>
              <span className="font-serif text-2xl font-bold text-emerald-400 mt-1 block">Active</span>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400"><ShieldCheck size={18} /></div>
          </div>

          <div className="bg-luxury-card p-5 rounded-3xl border border-luxury-gold/15 flex items-center justify-between shadow-xl">
            <div>
              <span className="text-[10px] font-mono text-stone-400 font-bold block uppercase">Catalog Valuation</span>
              <span className="font-serif text-2xl font-bold text-luxury-gold mt-1 block">
                {myProperties.length > 0 
                  ? formatPrice(myProperties.reduce((acc, p) => acc + p.price, 0)) 
                  : "$0.00"}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-indigo-500/10 text-indigo-400"><TrendingUp size={18} /></div>
          </div>

        </div>

        {/* Double flow grids */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start bg-transparent">
          
          {/* Main Dashboard Panel (Col Span 2) */}
          <div className="lg:col-span-2 flex flex-col gap-10 bg-transparent">
            
            {/* A. My Listed Properties (Seller/Agent Only) */}
            {(currentUser.role === 'Seller' || currentUser.role === 'Agent') && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-serif font-black text-xl text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-luxury-gold rounded-full inline-block" />
                    My Listed Assets ({myProperties.length})
                  </h3>
                  {myProperties.length > 0 && <Link to="/properties" className="text-xs font-bold text-luxury-gold hover:underline font-mono">Market Catalog</Link>}
                </div>

                {myProperties.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {myProperties.map(p => (
                      <div key={p.id} className="bg-luxury-card p-4 rounded-3xl border border-luxury-gold/15 shadow-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 bg-transparent">
                          <img src={p.image} className="w-16 h-12 rounded-xl object-cover shrink-0 border border-luxury-gold/10" alt="" referrerPolicy="no-referrer" />
                          <div>
                            <span className="text-[9px] font-mono text-luxury-gold block font-bold capitalize">{p.type}</span>
                            <h4 className="font-serif text-xs sm:text-sm font-bold text-stone-100 truncate max-w-[150px] sm:max-w-xs">{p.title}</h4>
                            <span className="text-xs font-mono font-semibold block text-stone-400 mt-0.5">${p.price.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link 
                            to={`/properties/${p.id}`} 
                            className="p-2 rounded-lg bg-luxury-bg-deep border border-luxury-gold/10 hover:border-luxury-gold text-stone-200 hover:text-luxury-gold transition-colors"
                            title="Inspect Details"
                          >
                            <ChevronRight size={16} />
                          </Link>
                          <button 
                            onClick={() => deleteProperty(p.id)}
                            className="p-2 rounded-lg bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white transition-colors border border-rose-500/15 cursor-pointer"
                            title="Remove Listing"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-luxury-card border border-luxury-gold/15 p-10 rounded-3xl text-center shadow-xl">
                    <FileText size={32} className="text-stone-500 mx-auto mb-4" />
                    <h4 className="font-serif text-sm font-bold text-stone-200">No Assets Registered</h4>
                    <p className="text-stone-400 text-xs mt-2 max-w-xs mx-auto font-sans leading-relaxed">Upload luxury structures to receive investment questions and dashboard diagnostics.</p>
                    <Link to="/add-property" className="text-xs bg-gradient-to-r from-luxury-gold to-luxury-gold-muted text-zinc-950 font-bold py-2.5 px-5 rounded-lg mt-4 inline-block hover:brightness-110">List first property</Link>
                  </div>
                )}
              </div>
            )}

            {/* B. Saved favorites selection shortcut */}
            <div>
              <div className="flex justify-between items-center mb-6 bg-transparent">
                <h3 className="font-serif font-black text-xl text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-luxury-gold rounded-full inline-block" />
                  My Favorites Vault ({savedProperties.length})
                </h3>
                {savedProperties.length > 0 && <Link to="/favorites" className="text-xs font-bold text-luxury-gold hover:underline font-mono">View Favorites</Link>}
              </div>

              {savedProperties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-transparent">
                  {savedProperties.slice(0, 2).map(p => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              ) : (
                <div className="bg-luxury-card border border-luxury-gold/15 p-10 rounded-3xl text-center shadow-xl">
                  <Heart size={32} className="text-stone-500 mx-auto mb-4" />
                  <h4 className="font-serif text-sm font-bold text-stone-200">No Bookmarked Castles</h4>
                  <p className="text-stone-405 text-xs mt-2 max-w-xs mx-auto">Save properties during exploration to archive them inside this console.</p>
                  <Link to="/properties" className="text-xs text-luxury-gold font-bold hover:underline block mt-3">Browse Estates</Link>
                </div>
              )}
            </div>

          </div>

          {/* Right Sidebar active concierge coordinates */}
          <aside className="flex flex-col gap-6 bg-transparent">
            
            <div className="bg-luxury-card p-6 rounded-3xl border border-luxury-gold/20 shadow-2xl flex flex-col gap-5">
              <div className="pb-3 border-b border-luxury-gold/10">
                <span className="text-[8px] font-mono text-luxury-gold font-bold block mb-1">SOVEREIGN CHANNELS</span>
                <h3 className="font-serif font-bold text-sm text-white">Direct Engagement Guide</h3>
              </div>

              <p className="text-xs text-stone-400 leading-relaxed font-sans -mt-1.5 font-light">
                Secure broker direct dials prevent intermediate spam. All our luxury listings display pre-vetted real WhatsApp redirects and voice lines for instant viewing schedules.
              </p>

              <div className="flex flex-col gap-3 font-mono text-[11px]">
                
                {/* Visual Direct hotline indicator */}
                <div className="flex items-center gap-3 p-3 bg-luxury-bg-deep rounded-2xl border border-luxury-gold/10">
                  <div className="w-8 h-8 rounded-full bg-luxury-gold/10 text-luxury-gold flex items-center justify-center shrink-0">
                    <PhoneCall size={14} />
                  </div>
                  <div className="truncate text-left">
                    <span className="text-[8px] text-stone-450 block leading-none">GLOBAL DIRECT HOTLINE</span>
                    <span className="font-bold text-white tracking-wider leading-none mt-1 inline-block">+1 (555) 301-4491</span>
                  </div>
                </div>

                {/* Concierge private mailbox */}
                <div className="flex items-center gap-3 p-3 bg-luxury-bg-deep rounded-2xl border border-luxury-gold/10">
                  <div className="w-8 h-8 rounded-full bg-luxury-gold/10 text-luxury-gold flex items-center justify-center shrink-0">
                    <Mail size={14} />
                  </div>
                  <div className="truncate text-left">
                    <span className="text-[8px] text-stone-450 block leading-none">CONCIERGE MAILBOX</span>
                    <span className="font-bold text-stone-200 leading-none mt-1 inline-block truncate w-full max-w-[150px]">concierge@luxevault.com</span>
                  </div>
                </div>

              </div>

              <div className="p-3 bg-luxury-gold/5 rounded-2xl border border-luxury-gold/10 text-[9.5px] leading-relaxed text-stone-400 font-mono flex items-start gap-2.5">
                <Activity size={14} className="text-luxury-gold shrink-0 mt-0.5 animate-pulse" />
                <span>Verify escrow accounts and authorization passes before transferring security reserves. No client keys are shared.</span>
              </div>
            </div>

            {/* Quick Live System Activity Feed log */}
            <div className="bg-luxury-card p-6 rounded-3xl border border-luxury-gold/20 shadow-2xl flex flex-col gap-4">
              <h3 className="font-serif font-bold text-xs tracking-wider uppercase text-luxury-gold flex items-center gap-2 font-mono">
                <Activity size={14} className="text-luxury-gold animate-pulse" />
                <span>Secured Perimeter Radar</span>
              </h3>
              
              <div className="flex flex-col gap-3 font-mono text-[9px] text-stone-400">
                <div className="flex justify-between pb-2 border-b border-luxury-gold/15">
                  <span>CONCIERGE COUPLINGS</span>
                  <span className="text-emerald-455">ONLINE</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-luxury-gold/15">
                  <span>SSL HANDSHAKE SYSTEM</span>
                  <span className="text-luxury-gold">ECC SECURE</span>
                </div>
                <p className="text-[9px] leading-relaxed text-[#8C8A85] font-sans italic mt-1 font-light">
                  Encryption logs authenticate direct peer-to-peer messaging coordinates automatically on property details clicks.
                </p>
              </div>
            </div>

          </aside>

        </div>

      </div>

      {/* Dynamic Slide-up form modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn select-none">
          <div className="bg-luxury-card border select-text border-luxury-gold/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative my-8 animate-scaleIn">
            
            {/* Header branding */}
            <div className="p-6 border-b border-luxury-gold/15 bg-black/40 flex justify-between items-center select-none">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30 flex items-center justify-center">
                  <PlusCircle size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-extrabold text-white">➕ Add New Luxury Property</h3>
                  <p className="text-[10px] text-stone-400 font-mono">Direct integration with live properties database table</p>
                </div>
              </div>
              <button 
                onClick={() => { setIsAddModalOpen(false); resetForm(); }}
                className="w-8 h-8 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center border border-luxury-gold/20 transition-all cursor-pointer"
                title="Dismiss form panel"
              >
                <X size={15} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-5">
              
              {/* Section 1: Title and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono font-bold text-[#bfa37a] uppercase tracking-widest">ESTATE TITLE *</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. The Sovereign Horizon Villa" 
                    required
                    className="bg-black/60 border border-luxury-gold/20 p-3.5 rounded-xl text-xs w-full focus:outline-none placeholder-stone-500 font-semibold focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono font-bold text-[#bfa37a] uppercase tracking-widest">CITY DISTRICT LOCATION *</label>
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Beverly Hills, California" 
                    required
                    className="bg-black/60 border border-luxury-gold/20 p-3.5 rounded-xl text-xs w-full focus:outline-none placeholder-stone-500 font-semibold focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold text-white"
                  />
                </div>
              </div>

              {/* Section 2: Price and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono font-bold text-[#bfa37a] uppercase tracking-widest">ACQUISITION PRICE ($) *</label>
                  <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 2450000" 
                    required
                    className="bg-black/60 border border-luxury-gold/20 p-3.5 rounded-xl text-xs w-full focus:outline-none placeholder-stone-500 font-mono focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono font-bold text-[#bfa37a] uppercase tracking-widest">PROPERTY CLASSIFICATION *</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                    className="bg-black/60 border border-luxury-gold/20 p-3.5 rounded-xl text-xs w-full font-semibold focus:outline-none cursor-pointer text-white focus:border-luxury-gold"
                  >
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="apartment">Apartment</option>
                  </select>
                </div>
              </div>

              {/* Section 3: Beds and Baths */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono font-bold text-[#bfa37a] uppercase">BEDROOM COUNT *</label>
                  <select 
                    value={beds} 
                    onChange={(e) => setBeds(e.target.value)} 
                    required
                    className="bg-black/60 border border-luxury-gold/20 p-3 rounded-xl focus:outline-none cursor-pointer text-white"
                  >
                    {[1,2,3,4,5,6,8,10,12].map(n => <option key={n} value={n}>{n} Bedrooms</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono font-bold text-[#bfa37a] uppercase">BATHROOM COUNT *</label>
                  <select 
                    value={baths} 
                    onChange={(e) => setBaths(e.target.value)} 
                    required
                    className="bg-black/60 border border-luxury-gold/20 p-3 rounded-xl focus:outline-none cursor-pointer text-white"
                  >
                    {[1,1.5,2,2.5,3,3.5,4,5,6,8].map(n => <option key={n} value={n}>{n} Bathrooms</option>)}
                  </select>
                </div>
              </div>

              {/* Section 4: Narrative Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono font-bold text-[#bfa37a] uppercase block">ARCHITECTURAL DESCRIPTION *</label>
                <textarea 
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your upscale structure's lighting, premium views, materials, high-end layouts..."
                  required
                  className="bg-black/60 border border-luxury-gold/20 p-4 rounded-xl text-xs w-full focus:outline-none font-sans leading-relaxed text-stone-200 placeholder-stone-500 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold text-white"
                />
              </div>

              {/* Section 5: Drag & Drop Storage Image Picker */}
              <div className="border border-luxury-gold/15 p-4 rounded-2xl bg-black/20 select-none">
                <label className="text-[9px] font-mono font-bold text-[#bfa37a] block mb-2 uppercase tracking-wider">
                  Drag & Drop Property Portrait (Saves directly to Supabase Storage) *
                </label>
                
                <div 
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[140px] ${
                    isDragActive 
                      ? 'border-luxury-gold bg-luxury-gold/10' 
                      : 'border-luxury-gold/25 bg-black/40 hover:border-luxury-gold/50'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
                  onDragLeave={() => setIsDragActive(false)}
                  onDrop={async (e) => {
                    e.preventDefault();
                    setIsDragActive(false);
                    const files = Array.from(e.dataTransfer.files);
                    await handleFiles(files);
                  }}
                  onClick={() => document.getElementById('modal-file-input').click()}
                >
                  <input 
                    id="modal-file-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files);
                      await handleFiles(files);
                    }}
                    className="hidden"
                  />
                  
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 size={24} className="text-luxury-gold animate-spin" />
                      <span className="text-[10px] font-mono text-luxury-gold uppercase tracking-widest mt-1">Sovereign Upload Active...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Upload size={20} className="text-luxury-gold/70 animate-bounce" />
                      <span className="text-[11px] font-bold text-stone-100 block mt-1">Drop luxurious photographs here</span>
                      <span className="text-[9px] text-[#A19D98] block">JPEG / PNG / WebP</span>
                    </div>
                  )}
                </div>

                {/* Image Previews inside modal */}
                {uploadedImages.length > 0 && (
                  <div className="mt-4">
                    <span className="text-[8px] font-mono text-luxury-gold font-bold uppercase tracking-wider block mb-2">
                      UPLOADED FILE PREVIEWS ({uploadedImages.length})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {uploadedImages.map((imgObj, idx) => {
                        const imgUrl = typeof imgObj === 'string' ? imgObj : imgObj.url;
                        return (
                          <div key={idx} className="relative w-16 h-12 rounded-lg overflow-hidden border border-luxury-gold/20 group">
                            <img src={imgUrl} className="w-full h-full object-cover" alt="" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setUploadedImages(prev => prev.filter((_, i) => i !== idx));
                                showToast("Photograph removed from collection.", "info");
                              }}
                              className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-950 text-red-400 rounded flex items-center justify-center text-[8px] border border-red-500/30 cursor-pointer hover:bg-red-900"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons footer */}
              <div className="flex gap-3 justify-end mt-2 pt-4 border-t border-luxury-gold/10 select-none">
                <button 
                  type="button" 
                  onClick={() => { setIsAddModalOpen(false); resetForm(); }}
                  className="px-5 py-3 rounded-xl font-bold bg-neutral-900 border border-neutral-800 text-stone-400 text-xs hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || isUploading}
                  className="px-6 py-3 rounded-xl font-extrabold bg-gradient-to-r from-luxury-gold to-yellow-600 text-neutral-950 text-xs shadow-lg hover:brightness-110 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Syncing Registry...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle size={14} />
                      <span>Register Estate</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
