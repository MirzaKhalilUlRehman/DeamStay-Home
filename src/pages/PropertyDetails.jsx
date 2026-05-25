import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import PropertyCard from '../components/PropertyCard.jsx';
import { 
  Heart, MapPin, BedDouble, Bath, Maximize, 
  User, Mail, Phone, Calendar, ArrowLeft, Send,
  DollarSign, Calculator, Globe, Star, ShieldAlert,
  MessageCircle, ExternalLink, ShieldCheck
} from 'lucide-react';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, agents, favorites, toggleFavorite, showToast } = useApp();

  const [activeImage, setActiveImage] = useState(0);
  const [property, setProperty] = useState(null);
  const [agent, setAgent] = useState(null);

  // Mortgage Calculator state
  const [homeValue, setHomeValue] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [interestRate, setInterestRate] = useState(4.2);
  const [loanTerm, setLoanTerm] = useState(30);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  // Lead request form state (conformed to direct engagement)
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [messageText, setMessageText] = useState("Hi! I am interested in this luxury property. Please contact me to schedule a viewing or share more details.");

  useEffect(() => {
    const foundProp = properties.find(p => p.id === parseInt(id));
    if (foundProp) {
      setProperty(foundProp);
      setHomeValue(foundProp.price);
      setDownPayment(Math.round(foundProp.price * 0.20)); // default 20% down
      setActiveImage(0);

      const foundAgent = agents.find(a => a.id === foundProp.agentId) || foundProp.agent || agents[0];
      setAgent(foundAgent);
    }
  }, [id, properties, agents]);

  useEffect(() => {
    if (!homeValue) return;
    const loanAmount = parseFloat(homeValue) - parseFloat(downPayment);
    if (loanAmount <= 0) {
      setMonthlyPayment(0);
      return;
    }
    const monthlyRate = (parseFloat(interestRate) / 100) / 12;
    const numberOfPayments = parseFloat(loanTerm) * 12;

    if (monthlyRate === 0) {
      setMonthlyPayment(loanAmount / numberOfPayments);
    } else {
      const calculation = 
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      
      setMonthlyPayment(Math.round(calculation));
    }
  }, [homeValue, downPayment, interestRate, loanTerm]);

  if (!property) {
    return (
      <div className="pt-32 text-center pb-20 min-h-screen">
        <h2 className="font-serif text-2xl font-bold text-white">Property Not Found</h2>
        <p className="text-stone-400 mt-2 text-xs font-mono">This property may have been sold or is temporarily offline.</p>
        <Link to="/properties" className="text-purple-400 font-bold hover:underline inline-block mt-6 text-xs uppercase tracking-wider">Return to Properties</Link>
      </div>
    );
  }

  const isFavorite = favorites.includes(property.id);

  // Lead form submit triggers high-fidelity toast with no raw internal chat redirects
  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!senderName || !senderEmail || !senderPhone) {
      showToast("Please fill in your name, email, and phone number.", "error");
      return;
    }
    showToast(`Inquiry sent! Agent ${agent.name} has been notified and will contact you at ${senderPhone} shortly.`, 'success');
    setSenderName('');
    setSenderEmail('');
    setSenderPhone('');
  };

  // Generate WhatsApp contact link with pre-filled message
  const getWhatsAppLink = (phone, title) => {
    const numbersOnly = phone.replace(/\D/g, '');
    const prefilledMessage = `Hello ${agent ? agent.name : 'Agent'}, I am interested in more details regarding the property: "${title}". Let's arrange a walkthrough.`;
    return `https://wa.me/${numbersOnly}?text=${encodeURIComponent(prefilledMessage)}`;
  };

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(2)}M`;
    }
    return `$${price.toLocaleString()}`;
  };

  const similarProperties = properties
    .filter(p => p.id !== property.id && p.type === property.type)
    .slice(0, 3);

  return (
    <div className="pt-28 pb-20 font-sans min-h-screen text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation back shortcut */}
        <Link to="/properties" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-stone-450 hover:text-purple-400 transition-colors mb-6 uppercase tracking-wider">
          <ArrowLeft size={14} className="text-purple-450" />
          <span>All Properties</span>
        </Link>

        {/* Header Grid Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="text-[10px] font-mono font-bold tracking-widest text-purple-300 uppercase bg-purple-950/20 px-2 py-0.5 rounded border border-purple-500/20">
                {property.type}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500/30" />
              <span className="text-[10px] font-mono text-stone-400 uppercase font-bold tracking-wider">
                Built: {property.yearBuilt}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {property.title}
            </h1>
            <div className="flex items-center gap-1.5 mt-3 text-stone-400">
              <MapPin size={14} className="text-purple-400 shrink-0" />
              <span className="text-xs">{property.address}</span>
            </div>
          </div>

          <div className="flex flex-col sm:items-end justify-between items-start w-full lg:w-auto mt-4 lg:mt-0">
            <span className="text-3xl sm:text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400 tracking-tight">
              {formatPrice(property.price)}
              {property.purpose === 'rent' && <span className="text-xs font-sans font-medium text-stone-400">/mo</span>}
            </span>
            
            <div className="flex gap-2.5 mt-4 w-full sm:w-auto">
              <button 
                onClick={() => toggleFavorite(property.id)}
                className={`py-2 px-5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-transform cursor-pointer shadow-lg hover:scale-[1.02] ${
                  isFavorite 
                    ? 'border-rose-500/50 text-rose-400 bg-rose-500/10' 
                    : 'border-purple-500/25 text-stone-300 hover:border-purple-400 hover:text-white bg-[#080c16]'
                }`}
              >
                <Heart size={14} fill={isFavorite ? "#f43f5e" : "transparent"} className={isFavorite ? "text-rose-500" : "text-stone-400"} />
                <span>{isFavorite ? 'Saved Estate' : 'Save Property'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Panoramic Showcase Element */}
        <div className="grid grid-cols-1 gap-4 mb-12">
          <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden bg-[#05060f] relative shadow-2xl border border-purple-500/15">
            <img 
              src={property.images ? property.images[activeImage] : property.image} 
              className="w-full h-full object-cover transition-opacity duration-300"
              alt={property.title}
              referrerPolicy="no-referrer"
            />
            
            <div className="absolute top-6 left-6 bg-slate-950/85 backdrop-blur-md px-4 py-2 rounded-xl border border-purple-500/20 text-white">
              <span className="text-[9px] font-mono text-purple-400 block tracking-widest uppercase font-bold">Location</span>
              <span className="text-xs font-serif font-bold">{property.location}</span>
            </div>
          </div>

          {/* Sub Gallery Selection (Slide togglers) */}
          {property.images && property.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none justify-center">
              {property.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-24 h-14 rounded-xl overflow-hidden cursor-pointer shrink-0 border-2 transition-all ${
                    activeImage === i 
                      ? 'border-purple-500 scale-95 shadow-lg shadow-purple-500/25' 
                      : 'border-transparent filter brightness-50 hover:brightness-100'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Specs Details Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start mt-10">
          
          {/* Left panel metrics (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            
            {/* Real estate stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#080a1c] p-6 rounded-3xl border border-purple-500/15 shadow-xl backdrop-blur-xs">
              
              <div className="flex flex-col gap-1 bg-transparent">
                <span className="text-[9px] font-mono font-bold text-stone-450 uppercase tracking-wider">BEDROOMS</span>
                <div className="flex items-center gap-2 mt-1">
                  <BedDouble size={18} className="text-purple-400" />
                  <span className="text-sm font-serif font-bold text-white">{property.beds} Rooms</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 border-l border-purple-500/10 sm:pl-4 pl-0">
                <span className="text-[9px] font-mono font-bold text-stone-450 uppercase tracking-wider">BATHROOMS</span>
                <div className="flex items-center gap-2 mt-1">
                  <Bath size={18} className="text-purple-400" />
                  <span className="text-sm font-serif font-bold text-white">{property.baths} Baths</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 border-l border-purple-500/10 sm:pl-4 pl-0 mt-4 sm:mt-0">
                <span className="text-[9px] font-mono font-bold text-stone-450 uppercase tracking-wider">Size</span>
                <div className="flex items-center gap-2 mt-1">
                  <Maximize size={18} className="text-purple-400" />
                  <span className="text-sm font-serif font-bold text-white">{property.area.toLocaleString()} Sq Ft</span>
                </div>
              </div>

            {/* Furnishing */}
              <div className="flex flex-col gap-1 border-l border-purple-500/10 sm:pl-4 pl-0 mt-4 sm:mt-0">
                <span className="text-[9px] font-mono font-bold text-stone-455 uppercase tracking-wider">Furnishing</span>
                <div className="flex items-center gap-2 mt-1">
                  <Globe size={18} className="text-purple-400" />
                  <span className="text-sm font-serif font-bold text-white">{property.furnished ? 'Furnished' : 'Unfurnished'}</span>
                </div>
              </div>

            </div>

            {/* Description Narrative */}
            <div>
              <h3 className="font-serif font-bold text-xl text-white mb-4 border-b border-purple-500/10 pb-2 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full inline-block" />
                Property Description
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-light font-sans">
                {property.description}
              </p>
            </div>

            {/* Curated Conveniences Checklist */}
            <div>
              <h3 className="font-serif font-bold text-xl text-white mb-6 border-b border-purple-500/10 pb-2 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full inline-block" />
                Property Amenities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(property.amenities || ["Exclusive Deck", "Smart System", "Oceanfront", "Gourmet Kitchen", "Private Spa"]).map((amenity, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-purple-950/15 rounded-2xl border border-purple-500/10 text-xs text-stone-200 font-semibold hover:border-purple-500/30 transition-all font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Parameters Table */}
            <div>
              <h3 className="font-serif font-bold text-xl text-white mb-4 border-b border-purple-500/10 pb-2 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full inline-block" />
                Property Details
              </h3>
              <div className="bg-[#05060f]/60 border border-purple-500/15 rounded-3xl overflow-hidden font-mono text-xs">
                <div className="grid grid-cols-2 p-4 border-b border-purple-500/10 hover:bg-purple-950/15 transition-all">
                  <span className="text-stone-400">Property Reference</span>
                  <span className="font-bold text-stone-200">LV-00{property.id}A</span>
                </div>
                <div className="grid grid-cols-2 p-4 border-b border-purple-500/10 hover:bg-purple-950/15 transition-all">
                  <span className="text-stone-400">Property Type</span>
                  <span className="font-bold capitalize text-stone-200">{property.type}</span>
                </div>
                <div className="grid grid-cols-2 p-4 border-b border-purple-500/10 hover:bg-purple-950/15 transition-all">
                  <span className="text-stone-400">Price Valuation</span>
                  <span className="font-bold text-purple-300">${property.price.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 p-4 hover:bg-purple-950/15 transition-all">
                  <span className="text-stone-400">REGULATORY STANDARDS</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    Verified & Authenticated
                  </span>
                </div>
              </div>
            </div>

            {/* Geographic Coordinates map */}
            <div>
              <h3 className="font-serif font-bold text-xl text-white mb-4 border-b border-purple-500/10 pb-2 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full inline-block" />
                Property Location
              </h3>
              <div className="h-64 rounded-3xl bg-[#05060f]/60 relative overflow-hidden border border-purple-500/15 flex items-center justify-center">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:20px_20px] z-0" />
                
                <div className="flex flex-col items-center gap-2.5 relative z-10 select-none">
                  <div className="w-14 h-14 btn-premium rounded-full flex items-center justify-center text-white shadow-2xl border-4 border-[#020205] animate-bounce cursor-pointer">
                    <MapPin size={24} />
                  </div>
                  <span className="bg-[#030712]/92 text-purple-300 font-mono text-[9px] font-bold py-1.5 px-3 rounded-lg border border-purple-500/25 shadow-xl">
                    Location: {property.location}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 bg-[#080a1c] backdrop-blur-md px-3.5 py-2 rounded-xl text-[10px] font-mono border border-purple-500/20 flex items-center gap-3">
                  <span className="text-purple-400 font-bold">● EXACT LOCATION</span>
                  <span className="text-stone-400">Interactive Map Location</span>
                </div>
              </div>
            </div>

            {/* Mortgage Calculator Form */}
            <div>
              <div className="flex items-center gap-2.5 mb-4 max-w-lg">
                <Calculator className="text-purple-400" size={19} />
                <h3 className="font-serif font-bold text-xl text-white">Mortgage Calculator</h3>
              </div>
              <div className="p-6 bg-purple-950/10 border border-purple-500/15 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center backdrop-blur-xs">
                
                {/* Inputs */}
                <div className="flex flex-col gap-4 font-sans text-xs bg-transparent">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-wider">Home Value ($)</label>
                    <input 
                      type="number" 
                      value={homeValue}
                      onChange={(e) => setHomeValue(e.target.value)}
                      className="bg-[#05060f] text-white p-3 rounded-xl border border-purple-500/20 text-xs font-semibold focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-wider">Down Payment ($)</label>
                    <input 
                      type="number" 
                      value={downPayment}
                      onChange={(e) => setDownPayment(e.target.value)}
                      className="bg-[#05060f] text-white p-3 rounded-xl border border-purple-500/20 text-xs font-semibold focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-transparent">
                    <div className="flex flex-col gap-1.5 bg-transparent">
                      <label className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-wider">Interest Rate (%)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        className="bg-[#05060f] text-white p-3 rounded-xl border border-purple-500/20 text-xs font-semibold focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 bg-transparent">
                      <label className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-wider">Loan Term (Years)</label>
                      <select 
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(e.target.value)}
                        className="bg-[#05060f] text-slate-300 p-3 rounded-xl border border-purple-500/20 text-xs font-semibold focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        <option value="15" className="bg-[#0b0c16]">15 Years</option>
                        <option value="20" className="bg-[#0b0c16]">20 Years</option>
                        <option value="30" className="bg-[#0b0c16]">30 Years</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Output visual */}
                <div className="p-6 rounded-2xl bg-[#020205] border border-purple-500/20 text-center flex flex-col items-center">
                  <span className="text-[8px] font-mono text-stone-400 font-bold uppercase tracking-widest block mb-2 font-mono">ESTIMATED MONTHLY PAYMENT</span>
                  <div className="font-serif text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    ${monthlyPayment.toLocaleString()}
                    <span className="text-xs font-sans text-stone-400 font-light">/mo</span>
                  </div>
                  <p className="text-stone-400 text-[10px] leading-relaxed mt-4 font-light font-sans">
                    Computed using standard fixed amortized rate calculations. Actual pricing and rate approvals depend on your lender.
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* Right Sidebar columns (1 col) */}
          <aside className="flex flex-col gap-6">
            
            <div className="glass-panel p-6 rounded-3xl relative shadow-2xl">
              <span className="text-[10px] font-mono font-bold tracking-widest text-purple-400 uppercase block mb-4">
                LISTING AGENT
              </span>

              {agent && (
                <>
                  <div className="flex items-center gap-4 border-b border-purple-500/10 pb-5 mb-5">
                    <img 
                      src={agent.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80"} 
                      alt="" 
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-500/20"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-white text-xs tracking-wider uppercase">{agent.name}</h4>
                      <p className="text-[10px] text-purple-400 font-mono mt-0.5">{agent.role}</p>
                      
                      <div className="flex gap-1 mt-1.5">
                        {[...Array(5)].map((_, i) => <Star key={i} size={11} className="fill-[#a855f7] text-[#a855f7]" />)}
                        <span className="text-[9px] text-stone-400 font-mono ml-1">({agent.rating})</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-stone-300 text-xs leading-relaxed font-sans italic mb-6 font-light">
                    "{agent.bio}"
                  </p>

                  <div className="flex flex-col gap-3 pb-6 text-xs text-stone-350 border-b border-purple-500/10 mb-6 font-mono">
                    <div className="flex items-center gap-2.5 bg-[#05060f]/60 p-2.5 rounded-xl border border-purple-500/10">
                      <Phone size={14} className="text-purple-400" />
                      <div className="flex flex-col">
                        <span className="text-[9px] text-stone-450 font-sans font-bold uppercase">Phone Number</span>
                        <span className="font-bold text-white tracking-wider font-mono text-[11px]">{agent.phone || "+1 (555) 301-4491"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 bg-[#05060f]/60 p-2.5 rounded-xl border border-purple-500/10">
                      <Mail size={14} className="text-purple-400" />
                      <div className="flex flex-col">
                        <span className="text-[9px] text-stone-450 font-sans font-bold uppercase">Email Address</span>
                        <span className="text-stone-200 font-mono text-[11px] truncate w-full max-w-[190px]">{agent.email || "concierge@luxevault.com"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact on WhatsApp CTA: OPENS DIRECT WHATSAPP */}
                  <a 
                    href={getWhatsAppLink(agent.phone || "+1 (555) 301-4491", property.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-zinc-950 font-bold py-3.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer font-sans uppercase mb-4 tracking-wider"
                  >
                    <MessageCircle size={15} />
                    <span>Contact on WhatsApp</span>
                    <ExternalLink size={11} className="opacity-90 ml-0.5" />
                  </a>
                </>
              )}

              {/* Secure lead transmission request */}
              <form onSubmit={handleLeadSubmit} className="flex flex-col gap-4 font-sans border-t border-purple-500/10 pt-5 mt-4">
                <span className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-wider block">Send Message to Agent</span>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[8px] font-mono font-bold text-stone-400 uppercase">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Aria Thorne"
                    className="bg-[#05060f] text-white p-3 rounded-xl text-xs font-semibold focus:outline-none border border-purple-500/20 focus:border-purple-550 placeholder-stone-600"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[8px] font-mono font-bold text-stone-400 uppercase">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="e.g. aria@example.com"
                    className="bg-[#05060f] text-white p-3 rounded-xl text-xs font-semibold focus:outline-none border border-purple-500/20 focus:border-purple-550 placeholder-stone-600"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[8px] font-mono font-bold text-stone-400 uppercase">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 019-2834"
                    className="bg-[#05060f] text-white p-3 rounded-xl text-xs font-semibold focus:outline-none border border-purple-500/20 focus:border-purple-550 placeholder-stone-600"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full btn-premium text-white font-bold py-3.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                >
                  <Send size={13} />
                  <span>Send Message</span>
                </button>

              </form>
            </div>

            {/* Quick Warning Block */}
            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/15 text-[10px] leading-relaxed text-stone-400 flex gap-2.5 w-full font-mono">
              <ShieldAlert size={16} className="text-purple-400 shrink-0 mt-0.5" />
              <span>Feel free to message or call the agent directly. In-person property viewings can be scheduled upon request.</span>
            </div>

          </aside>

        </div>

        {/* Similar properties recommendations */}
        {similarProperties.length > 0 && (
          <div className="border-t border-purple-500/10 pt-20 mt-20">
            <h3 className="font-serif font-black text-2xl mb-10 text-center tracking-tight text-white uppercase">Similar Properties</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarProperties.map(p => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
