import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import PropertyCard from '../components/PropertyCard.jsx';
import { 
  Search, ShieldCheck, Compass, Award, Building, 
  MapPin, Send, Star, ArrowRight, Activity, Users, DollarSign
} from 'lucide-react';
import { initialTestimonials } from '../data.js';
import { motion } from 'motion/react';

export default function Home() {
  const { properties, agents, searchQuery, setSearchQuery, showToast } = useApp();
  const navigate = useNavigate();

  // Search parameters local states
  const [purpose, setPurpose] = useState('buy');
  const [type, setType] = useState('all');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('all');

  // Filter listings
  const featuredProperties = properties.filter(p => p.featured).slice(0, 3);
  const latestProperties = properties.slice(0, 4);

  const handleSearch = (e) => {
    e.preventDefault();

    let minPrice = '';
    let maxPrice = '';

    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-');
      minPrice = min;
      maxPrice = max || '';
    }

    setSearchQuery({
      purpose,
      type,
      location,
      minPrice,
      maxPrice,
      beds: 'all'
    });

    showToast("Searching for properties...", "info");
    navigate('/properties');
  };

  const handleLocationClick = (loc) => {
    setSearchQuery({
      purpose: 'all',
      type: 'all',
      location: loc,
      minPrice: '',
      maxPrice: '',
      beds: 'all'
    });
    showToast(`Filtering listings in ${loc}...`, 'info');
    navigate('/properties');
  };

  // Shared framer motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="font-sans bg-transparent pb-12">
      
      {/* 1. Dramatic Hero Section with Glassmorphism Search */}
      <section className="relative min-h-[92vh] flex items-center justify-center bg-black pt-20 overflow-hidden">
        
        {/* Background ambient asset image */}
        <div className="absolute inset-0 opacity-30 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&h=1080&q=80" 
            alt="Estate"
            className="w-full h-full object-cover filter brightness-50 scale-105"
            referrerPolicy="no-referrer"
          />
          {/* Dark luxury gradient screen */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-[#020205]/65 to-transparent" />
        </div>

        {/* Decorative Radial Glowing Flares */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Hero Content */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center select-none pt-10"
        >
          
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-purple-500/25 backdrop-blur-md mb-6 hover:border-purple-500/50 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.1)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-purple-200 uppercase">
              FIND YOUR DREAM LUXURY HOME
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="font-serif text-3xl sm:text-5xl lg:text-7xl font-semibold text-white tracking-tight leading-tight max-w-4xl text-center"
          >
            Luxury Listings of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400 italic font-normal">
              Unmatched Distinction
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-sm sm:text-base text-stone-300 font-sans max-w-2xl mt-5 text-center leading-relaxed font-light"
          >
            We list only the finest modern homes, beachfront villas, and city penthouse apartments designed with premium quality.
          </motion.p>

          {/* Search Intake Panel */}
          <motion.div 
            variants={itemVariants}
            className="w-full max-w-4xl mt-12 bg-[#090b1c]/50 backdrop-blur-xl p-5 rounded-[32px] shadow-[0_0_40px_rgba(147,51,234,0.12)] border border-purple-500/20 relative z-20"
          >
            <form onSubmit={handleSearch} className="flex flex-col gap-4">
              
              {/* Buy / Rent tab buttons */}
              <div className="flex justify-between items-center pb-4 border-b border-purple-500/10">
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setPurpose('buy')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      purpose === 'buy' 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md shadow-purple-500/15' 
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Buy Home
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPurpose('rent')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      purpose === 'rent' 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md shadow-purple-500/15' 
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Rent Home
                  </button>
                </div>
                
                <span className="hidden sm:inline text-[10px] font-mono text-purple-300 font-medium tracking-widest uppercase">
                  ACTIVE LISTINGS: 1,402 PROPERTIES
                </span>
              </div>

              {/* Advanced core selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                
                {/* Location String Input */}
                <div className="flex flex-col gap-1.5 p-2.5 rounded-2xl hover:bg-purple-950/20 transition-colors border border-transparent hover:border-purple-500/10">
                  <label className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-widest">
                    LOCATION
                  </label>
                  <div className="flex items-center gap-1.5 mt-1 text-stone-200">
                    <MapPin size={15} className="text-purple-400 shrink-0" />
                    <input 
                      type="text" 
                      placeholder="e.g. Beverly Hills or Dubai" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-transparent border-none text-xs focus:outline-none w-full placeholder-stone-500 text-white font-semibold focus:ring-0"
                    />
                  </div>
                </div>

                {/* Property Type Dropdown */}
                <div className="flex flex-col gap-1.5 p-2.5 rounded-2xl hover:bg-purple-950/20 transition-colors border border-transparent hover:border-purple-500/10">
                  <label className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-widest">
                    PROPERTY TYPE
                  </label>
                  <select 
                     value={type}
                     onChange={(e) => setType(e.target.value)}
                     className="bg-transparent border-none text-xs text-white focus:outline-none w-full mt-2 font-semibold font-sans cursor-pointer focus:ring-0"
                  >
                    <option value="all" className="bg-[#0b0c16]">All Structures</option>
                    <option value="villa" className="bg-[#0b0c16]">Villas</option>
                    <option value="apartment" className="bg-[#0b0c16]">Apartments</option>
                    <option value="home" className="bg-[#0b0c16]">Residential Houses</option>
                    <option value="room" className="bg-[#0b0c16]">Studio Lofts</option>
                    <option value="commercial" className="bg-[#0b0c16]">Commercial Spaces</option>
                  </select>
                </div>

                {/* Price brackets filter */}
                <div className="flex flex-col gap-1.5 p-2.5 rounded-2xl hover:bg-purple-950/20 transition-colors border border-transparent hover:border-purple-500/10">
                  <label className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-widest">
                    PRICE RANGE
                  </label>
                  <select 
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="bg-transparent border-none text-xs text-white focus:outline-none w-full mt-2 font-semibold font-sans cursor-pointer focus:ring-0"
                  >
                    <option value="all" className="bg-[#0b0c16]">Any Price</option>
                    <option value="0-5000" className="bg-[#0b0c16]">Below $5,000 / mo</option>
                    <option value="5000-1000000" className="bg-[#0b0c16]">$5,000 - $1.00M</option>
                    <option value="1000000-3000000" className="bg-[#0b0c16]">$1.00M - $3.00M</option>
                    <option value="3000000-6000000" className="bg-[#0b0c16]">$3.00M - $6.00M</option>
                    <option value="6000000-50000000" className="bg-[#0b0c16]">$6.00M+</option>
                  </select>
                </div>

                {/* Trigger Action submit */}
                <div className="flex items-center justify-center lg:pl-4">
                  <button 
                    type="submit"
                    className="w-full btn-premium font-bold text-xs py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Search size={15} />
                    <span>Search Listings</span>
                  </button>
                </div>

              </div>
            </form>
          </motion.div>

        </motion.div>

      </section>

      {/* 2. Key Trust Statistics Grid */}
      <section className="bg-[#020205]/80 backdrop-blur-md border-y border-purple-500/10 py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            <div className="flex flex-col gap-1.5">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">$2.85B</span>
              <span className="text-[10px] font-mono text-stone-400 font-bold tracking-widest uppercase">TRANSACTED BY OUR TEAM</span>
            </div>

            <div className="flex flex-col gap-1.5 border-l border-purple-500/10">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-purple-400">140+</span>
              <span className="text-[10px] font-mono text-stone-400 font-bold tracking-widest uppercase">PRESTIGE PROPERTIES</span>
            </div>

            <div className="flex flex-col gap-1.5 border-l border-purple-500/10">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">99.4%</span>
              <span className="text-[10px] font-mono text-stone-400 font-bold tracking-widest uppercase">CUSTOMER SATISFACTION</span>
            </div>

            <div className="flex flex-col gap-1.5 border-l border-purple-500/10">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-purple-400">36</span>
              <span className="text-[10px] font-mono text-stone-400 font-bold tracking-widest uppercase">COUNTRIES REACHED</span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Featured Properties section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-between items-end mb-12">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#a855f7] uppercase">
              FEATURED LISTINGS
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white">
              Featured Properties
            </h2>
          </div>
          <Link to="/properties" className="group flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 font-sans uppercase tracking-wider transition-colors">
            <span>View All Properties</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 text-purple-400" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map(p => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      {/* 4. Luxury Location Bento-Grid */}
      <section className="bg-[#05060f]/60 backdrop-blur-md py-20 border-y border-purple-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-mono font-bold tracking-widest text-purple-400 uppercase block mb-3">
              POPULAR LOCATIONS
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white pb-1">
              Luxury Neighborhoods
            </h2>
            <p className="text-stone-400 text-xs font-sans mt-3">
              Explore dynamic listings across top luxury hotspots. Select any neighborhood to see active options live from the database.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Beverly Hills',
                tag: 'CALIFORNIA',
                alias: 'Beverly Hills Estates',
                landmark: 'Loma Vista & Rodeo Dr',
                style: 'Modernist Compounds',
                avgPrice: '$4.8M Avg',
                image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=650&h=450&q=80',
                span: 'md:col-span-2 col-span-1'
              },
              {
                name: 'Malibu',
                tag: 'COASTLINE',
                alias: 'Malibu Coastal',
                landmark: 'Pacific Coast Highway',
                style: 'Beachfront Compounds',
                avgPrice: '$6.8M Avg',
                image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=450&h=450&q=80',
                span: 'col-span-1'
              },
              {
                name: 'Tribeca',
                tag: 'NEW YORK',
                alias: 'Tribeca Lofts',
                landmark: 'Greenwich St Duplexes',
                style: 'Industrial Penthouses',
                avgPrice: '$2.4M Avg',
                image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=450&h=450&q=80',
                span: 'col-span-1'
              },
              {
                name: 'Chicago',
                tag: 'METROPOLIS',
                alias: 'Chicago Skyline',
                landmark: 'Magnificent Mile',
                style: 'Bespoke Studio Lofts',
                avgPrice: '$3.5k/mo Avg',
                image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=450&h=450&q=80',
                span: 'col-span-1'
              },
              {
                name: 'Dubai',
                tag: 'MIDDLE EAST',
                alias: 'Dubai Marina',
                landmark: 'Superyacht Bay Corridors',
                style: 'Ultramodern Skylines',
                avgPrice: '$4.5k/mo Avg',
                image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=650&h=450&q=80',
                span: 'md:col-span-2 col-span-1'
              },
              {
                name: 'Aspen',
                tag: 'COLORADO',
                alias: 'Aspen Chalets',
                landmark: 'Silver Queen Mountain',
                style: 'Alpine Wood Chalets',
                avgPrice: '$1.5M Avg',
                image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=450&h=440&q=80',
                span: 'col-span-1'
              }
            ].map((loc, idx) => {
              const count = properties.filter(p => p.location && p.location.toLowerCase().includes(loc.name.toLowerCase())).length;
              return (
                <div 
                  key={idx}
                  onClick={() => handleLocationClick(loc.name)}
                  className={`group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-xl border border-amber-500/15 transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(212,175,55,0.15)] ${loc.span}`}
                >
                  <img 
                    src={loc.image} 
                    alt={loc.alias} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    referrerPolicy="no-referrer"
                  />
                  {/* Premium overlay gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040714]/95 via-[#040714]/40 to-transparent group-hover:via-[#040714]/55 transition-all duration-500" />
                  
                  {/* Subtle top-right badge */}
                  <div className="absolute top-5 right-5 flex flex-col items-end gap-1.5 z-10">
                    <div className="px-2.5 py-1 rounded-md bg-[#040714]/90 backdrop-blur-md border border-amber-500/20 shadow-md">
                      <span className="text-[8px] font-mono tracking-widest text-[#d4af37] font-bold uppercase">{loc.tag}</span>
                    </div>
                    <div className="px-2 py-0.5 rounded-md bg-amber-500 text-[#040714] text-[8px] font-mono font-bold tracking-wider uppercase">
                      {loc.avgPrice}
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 text-white transition-all duration-300 group-hover:translate-x-1">
                    <span className="text-[9px] font-mono text-amber-300 font-bold block uppercase tracking-widest mb-1">{loc.style}</span>
                    <h3 className="font-serif text-xl font-semibold tracking-tight text-white group-hover:text-amber-400 transition-colors leading-tight">{loc.alias}</h3>
                    <p className="text-[10px] text-stone-300 font-sans font-light mt-0.5">{loc.landmark}</p>
                    
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${count > 0 ? 'bg-amber-400 animate-pulse' : 'bg-stone-500'}`} />
                        <span className="text-[10px] text-stone-300 font-mono tracking-wider uppercase">
                          {count} active {count === 1 ? 'placement' : 'placements'}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold tracking-wider font-mono text-amber-400 group-hover:text-white transition-all">
                        EXPLORE →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. Historical Ethos & Value Propositions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 font-sans">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col gap-5">
            <span className="text-[10px] font-mono font-bold tracking-widest text-purple-400 uppercase">
              WHY WORK WITH US
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-snug">
              Premium Quality. <br/>Vetted Modern Masterpieces.
            </h2>
            <p className="text-stone-300 text-xs leading-relaxed font-light">
              DreamStay Homes is a boutique luxury real estate platform. We match modern buyers with audited, high-quality owners cleanly, privately, and securely.
            </p>

            <div className="flex flex-col gap-4 mt-4 text-xs font-sans">
              
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(147,51,234,0.15)]">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-200">Verified Listings</h4>
                  <p className="text-stone-400 mt-1 leading-relaxed">All sellers are verified by our team. Every listing on our platform undergoes professional verification and inspection before publishing.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(147,51,234,0.15)]">
                  <Compass size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-200">Luxury Tours</h4>
                  <p className="text-stone-400 mt-1 leading-relaxed">Our agents schedule private virtual walks, multi-lingual guidance, and local host escorts for physical viewings.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(147,51,234,0.15)]">
                  <Award size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-200">Escrow & Closing Support</h4>
                  <p className="text-stone-400 mt-1 leading-relaxed">We assist with closing coordinates, legal escrow frameworks, and fast bank pre-approvals.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Luxury Promotional Visual Collage */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative border border-purple-500/15">
              <img src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&h=1000&q=80" alt="Estates Layout" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              {/* Overlay Glass widget */}
              <div className="absolute bottom-8 left-8 right-8 glass-panel p-6 rounded-2xl border border-purple-500/20 flex justify-between items-center text-white">
                <div>
                  <span className="text-[10px] font-mono text-purple-350 block tracking-widest uppercase">DISCRETION GUARANTEED</span>
                  <span className="font-serif text-sm font-semibold tracking-wide text-stone-100">DreamStay Homes Advisory Services</span>
                </div>
                <div className="w-10 h-10 btn-premium rounded-xl flex items-center justify-center text-white font-bold transition-transform cursor-pointer" onClick={() => { showToast("Advisory line active", "info"); }}>
                  →
                </div>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* 6. Active Managing Partners (Agents) */}
      <section className="bg-[#05060f]/60 backdrop-blur-md py-20 border-y border-purple-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-purple-400 uppercase block">
                MEET OUR REPRESENATIVES
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-1">
                Our Luxury Agents
              </h2>
            </div>
            <Link to="/agents" className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1 font-mono uppercase tracking-wider">
              <span>View Roster</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {agents.slice(0, 3).map(agent => (
              <div key={agent.id} className="group glass-panel glass-panel-hover p-6 rounded-[32px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 border-b border-purple-500/10 pb-4 mb-4">
                    <img src={agent.image} className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-500/30" alt={agent.name} referrerPolicy="no-referrer" />
                    <div>
                      <h3 className="font-semibold text-stone-100 text-xs sm:text-sm uppercase tracking-wide">{agent.name}</h3>
                      <p className="text-[10px] text-purple-400 font-mono mt-0.5">{agent.role}</p>
                    </div>
                  </div>
                  <p className="text-stone-300 text-xs font-sans line-clamp-3 leading-relaxed mb-6 font-light">
                    {agent.bio}
                  </p>
                </div>
                <div className="flex justify-between items-center text-xs mt-auto">
                  <span className="text-[11px] text-stone-400 font-mono">{agent.activeListings} Active Listings</span>
                  <Link to={`/agents/${agent.id}`} className="font-bold text-purple-400 hover:text-purple-300 transition-colors text-xs font-mono">
                    CONTACT →
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. Client Testimonial Endorsements */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 font-sans">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-mono font-bold tracking-widest text-purple-400 uppercase block">
            WHAT OUR CLIENTS SAY
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2">
            Client Testimonials
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {initialTestimonials.map(t => (
            <div key={t.id} className="glass-panel glass-panel-hover p-8 rounded-[32px] flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-purple-400 mb-6">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} size={15} fill="#a855f7" className="text-[#a855f7]" />)}
                </div>
                <p className="text-stone-300 text-xs sm:text-sm italic leading-relaxed mb-8 font-light">
                  "{t.quote}"
                </p>
              </div>
              <div className="flex items-center gap-3 mt-auto border-t border-purple-500/10 pt-4">
                <img src={t.avatar} className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/20" alt={t.name} referrerPolicy="no-referrer" />
                <div>
                  <h4 className="font-bold text-stone-100 text-xs font-sans">{t.name}</h4>
                  <p className="text-[10px] text-stone-400 font-mono mt-0.5">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
