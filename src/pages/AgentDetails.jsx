import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import PropertyCard from '../components/PropertyCard.jsx';
import { 
  ArrowLeft, Phone, Mail, Award, Globe, Star, 
  Send, ShieldCheck, Heart, Trash2, Calendar,
  MessageCircle, ExternalLink, ShieldAlert
} from 'lucide-react';

export default function AgentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agents, properties, showToast } = useApp();

  const [agent, setAgent] = useState(null);
  const [reviews, setReviews] = useState([]);
  
  // Local review additions state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  // Contact form States
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const foundAgent = agents.find(a => a.id === parseInt(id));
    if (foundAgent) {
      setAgent(foundAgent);
      setReviews(foundAgent.reviews || []);
    }
  }, [id, agents]);

  if (!agent) {
    return (
      <div className="pt-32 text-center pb-20 min-h-screen">
        <h2 className="font-serif text-2xl font-bold text-white">Partner Not Located</h2>
        <p className="text-stone-400 mt-2 text-xs font-mono">The representative key may be archived or relocated.</p>
        <Link to="/agents" className="text-luxury-gold font-bold hover:underline inline-block mt-4 text-xs tracking-wider uppercase">Return to Roster</Link>
      </div>
    );
  }

  // Filter properties active under this broker
  const agentProperties = properties.filter(
    p => p.agentId === agent.id || p.agent?.name?.toLowerCase() === agent.name.toLowerCase()
  );

  const handleContactAgent = (e) => {
    e.preventDefault();
    if (!message || !senderName) {
      showToast("Please provide your name and message.", "error");
      return;
    }
    showToast(`Request transmitted! Agent ${agent.name} has been notified and will reach out to you over Phone or WhatsApp shortly.`, 'success');
    setMessage('');
    setSenderName('');
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewText) {
      showToast("Please fill in author name and evaluation text.", "error");
      return;
    }
    const nextReview = {
      id: Date.now(),
      author: reviewAuthor,
      rating: parseInt(reviewRating),
      text: reviewText,
      date: "Today, " + new Date().toLocaleDateString()
    };
    setReviews([nextReview, ...reviews]);
    showToast("Thank you for submitting a representative evaluation.", "success");
    setReviewAuthor('');
    setReviewText('');
  };

  // Generate WhatsApp contact link with pre-filled message
  const getWhatsAppLink = (phone, agentName) => {
    const numbersOnly = phone.replace(/\D/g, '');
    const prefilledMessage = `Hello ${agentName}, I am interested in scheduling a consultation for your listed portfolios of DreamStay Homes Estates.`;
    return `https://wa.me/${numbersOnly}?text=${encodeURIComponent(prefilledMessage)}`;
  };

  return (
    <div className="pt-28 pb-20 font-sans min-h-screen text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation back shortcut */}
        <Link to="/agents" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-stone-400 hover:text-luxury-gold transition-colors mb-8 uppercase tracking-wider">
          <ArrowLeft size={14} className="text-luxury-gold" />
          <span>All Advisors</span>
        </Link>

        {/* 1. Main Bio Layout Column grids */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16 items-start">
          
          {/* Main Info (Col Span 2) */}
          <div className="lg:col-span-2 bg-luxury-card p-6 sm:p-8 rounded-3xl border border-luxury-gold/15 shadow-2xl flex flex-col gap-8">
            
            {/* Header section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-luxury-gold/10 pb-6 mb-2">
              <img 
                src={agent.image} 
                className="w-24 h-24 rounded-full object-cover ring-4 ring-luxury-gold/30 shadow-xl" 
                alt="" 
                referrerPolicy="no-referrer" 
              />
              <div className="text-center sm:text-left flex flex-col justify-center">
                <span className="text-[10px] font-mono text-luxury-gold font-bold uppercase tracking-widest">{agent.role}</span>
                <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mt-1">{agent.name}</h1>
                
                <div className="flex justify-center sm:justify-start items-center gap-1 text-luxury-gold mt-2">
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#d4af37" className="text-luxury-gold" />)}
                  <span className="text-xs text-stone-400 ml-1 font-mono font-bold">({agent.rating}) Verified Ratings</span>
                </div>
              </div>
            </div>

            {/* Specialties and experience grids */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-luxury-bg-deep border border-luxury-gold/10 text-xs text-stone-450">
                <span className="text-[9px] font-mono text-stone-400 block mb-1">EXPERIENCE BASE</span>
                <span className="font-sans font-bold text-stone-200 text-sm">{agent.experience || "10+ Years"}</span>
              </div>
              <div className="p-4 rounded-xl bg-luxury-bg-deep border border-luxury-gold/10 text-xs text-stone-450">
                <span className="text-[9px] font-mono text-stone-400 block mb-1">PORTFOLIO DOMAIN</span>
                <span className="font-sans font-bold text-stone-200 text-sm truncate block">{agent.specialty}</span>
              </div>
              <div className="p-4 rounded-xl bg-luxury-bg-deep border border-luxury-gold/10 text-xs text-stone-450">
                <span className="text-[9px] font-mono text-stone-400 block mb-1">LINGUAL SKILLS</span>
                <span className="font-mono font-bold text-stone-200 text-xs block">{agent.languages.join(", ")}</span>
              </div>
            </div>

            {/* Narratives bio text */}
            <div>
              <h3 className="font-serif font-bold text-lg text-white mb-3">Core Credentials Ethos</h3>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-sans font-light">
                {agent.bio}
              </p>
            </div>

            {/* Form list Reviews section */}
            <div className="border-t border-luxury-gold/10 pt-8 mt-4 flex flex-col gap-8">
              <h3 className="font-serif font-bold text-lg text-white">Member Valuations ({reviews.length})</h3>

              {reviews.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {reviews.map(rev => (
                    <div key={rev.id} className="p-5 bg-luxury-bg-deep border border-luxury-gold/10 rounded-2xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-xs text-stone-200 font-sans">{rev.author}</span>
                        <span className="text-[10px] text-stone-400 font-mono">{rev.date || "Verified Evaluation"}</span>
                      </div>
                      <div className="flex gap-0.5 text-luxury-gold mb-2">
                        {[...Array(rev.rating)].map((_, i) => <Star key={i} size={11} fill="#d4af37" className="text-luxury-gold" />)}
                      </div>
                      <p className="text-xs text-stone-400 leading-relaxed italic">
                        "{rev.text}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-stone-450 font-mono text-xs">No client reviews registered</div>
              )}

              {/* Add review form */}
              <form onSubmit={handleAddReview} className="bg-luxury-bg-deep p-5 rounded-3xl border border-luxury-gold/10 flex flex-col gap-4">
                <span className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-wider block">Write Advisor Assessment</span>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 bg-transparent">
                    <label className="text-[8px] font-mono font-bold text-stone-400 uppercase">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      placeholder="e.g. Carlton Hughes"
                      className="bg-luxury-bg-dark text-white p-3 rounded-lg text-xs font-semibold focus:outline-none border border-luxury-gold/15 focus:border-luxury-gold placeholder-stone-605"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 bg-transparent">
                    <label className="text-[8px] font-mono font-bold text-stone-400 uppercase">Rating Score</label>
                    <select 
                      value={reviewRating}
                      onChange={(e) => setReviewRating(e.target.value)}
                      className="bg-luxury-bg-dark text-stone-300 p-3 rounded-lg text-xs font-semibold focus:outline-none border border-luxury-gold/15 focus:border-luxury-gold"
                    >
                      <option value="5" className="bg-luxury-bg-dark">Excellent 5/5</option>
                      <option value="4" className="bg-luxury-bg-dark">Great 4/5</option>
                      <option value="3" className="bg-luxury-bg-dark">Mediocre 3/5</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 bg-transparent">
                  <label className="text-[8px] font-mono font-bold text-stone-400 uppercase">Your Evaluation Text</label>
                  <textarea 
                    rows={3}
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Provide detailed feedback describing their responsiveness, advisory expertise and negotiation strategies..."
                    className="bg-luxury-bg-dark text-white p-3 rounded-lg text-xs leading-relaxed focus:outline-none placeholder-stone-605 border border-luxury-gold/15 focus:border-luxury-gold resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="bg-gradient-to-r from-luxury-gold to-luxury-gold-muted text-zinc-950 text-xs font-bold py-2.5 px-6 rounded-xl self-end transition-all hover:brightness-110 cursor-pointer"
                >
                  Publish Advisor Review
                </button>
              </form>
            </div>

          </div>

          {/* Right Sidebar Contacts form (Col Span 1) */}
          <aside className="flex flex-col gap-6">
            
            <div className="bg-luxury-card p-6 rounded-3xl border border-luxury-gold/15 shadow-2xl">
              <span className="text-[10px] font-mono font-bold tracking-widest text-luxury-gold uppercase block mb-4">
                CONVENE ADVISOR DIRECT
              </span>

              <div className="flex flex-col gap-3 pb-6 text-xs text-stone-300 border-b border-luxury-gold/10 mb-6 font-mono">
                <div className="flex items-center gap-2.5 bg-luxury-bg-deep p-2.5 rounded-xl border border-luxury-gold/10">
                  <Phone size={14} className="text-luxury-gold shrink-0" />
                  <div className="text-left">
                    <span className="text-[8px] text-stone-405 block font-sans">DIRECT VOICE LINE</span>
                    <span className="font-bold text-white tracking-wider font-mono">{agent.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 bg-luxury-bg-deep p-2.5 rounded-xl border border-luxury-gold/10">
                  <Mail size={14} className="text-luxury-gold shrink-0" />
                  <div className="text-left">
                    <span className="text-[8px] text-stone-405 block font-sans">ADVISOR EMAIL</span>
                    <span className="text-stone-200 mt-1 block truncate w-full max-w-[170px]">{agent.email}</span>
                  </div>
                </div>
              </div>

              {/* Contact on WhatsApp Direct Redirector option */}
              <a 
                href={getWhatsAppLink(agent.phone, agent.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-zinc-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer font-sans uppercase mb-4 tracking-wider"
              >
                <MessageCircle size={15} />
                <span>Contact on WhatsApp</span>
                <ExternalLink size={11} className="opacity-90 ml-0.5" />
              </a>

              {/* Direct email simulation form */}
              <form onSubmit={handleContactAgent} className="flex flex-col gap-4 border-t border-luxury-gold/10 pt-5 mt-4">
                <span className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-wider block">Convene Email Request</span>
                
                <div className="flex flex-col gap-1.5 bg-transparent">
                  <label className="text-[8px] font-mono font-bold text-stone-400 uppercase">Your Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Duke Sterling"
                    className="bg-luxury-bg-dark text-white p-3 rounded-lg text-xs focus:outline-none border border-luxury-gold/15 focus:border-luxury-gold placeholder-stone-605"
                  />
                </div>

                <div className="flex flex-col gap-1.5 bg-transparent">
                  <label className="text-[8px] font-mono font-bold text-stone-450 uppercase">ADVISORY INQUIRY TEXT</label>
                  <textarea 
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Suggest meeting timeline, list assets under consideration, or request details..."
                    className="bg-luxury-bg-dark text-white p-3 rounded-lg text-xs leading-relaxed focus:outline-none border border-luxury-gold/15 focus:border-luxury-gold placeholder-stone-605 resize-none font-sans"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-luxury-gold to-luxury-gold-muted text-zinc-950 font-bold py-3 px-6 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer hover:brightness-110 shadow-lg shadow-luxury-gold/10"
                >
                  <Send size={13} />
                  <span>Request Advising Meeting</span>
                </button>

              </form>

            </div>

            <div className="p-4 bg-luxury-gold/5 border border-luxury-gold/15 rounded-2xl flex items-start gap-2.5 text-[10px] leading-relaxed text-stone-400 font-mono">
              <ShieldAlert size={16} className="text-luxury-gold shrink-0 mt-0.5" />
              <span>Sovereign advisor credentials are checked weekly. Communications going through DreamStay Homes networks undergo automatic cryptographic signatures hashing.</span>
            </div>

          </aside>

        </div>

        {/* 2. Matched Properties portfolios */}
        <div className="border-t border-luxury-gold/15 pt-16">
          <h2 className="font-serif font-black text-2xl mb-10 text-center tracking-tight text-white uppercase sm:text-3xl">Active Portfolios Under {agent.name}</h2>
          
          {agentProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-transparent">
              {agentProperties.map(prop => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-stone-400 text-xs font-mono uppercase bg-luxury-card border border-luxury-gold/15 rounded-2xl">
              No matching portfolios registered under this partner
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
