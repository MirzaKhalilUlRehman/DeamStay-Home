import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import PropertyCard from '../components/PropertyCard.jsx';
import { Search, MapPin, Sparkles, DollarSign } from 'lucide-react';

export default function Villas() {
  const { properties } = useApp();
  
  // Real-time search/filter states
  const [location, setLocation] = useState('');
  const [purpose, setPurpose] = useState('all'); // all, buy, rent
  const [priceMax, setPriceMax] = useState('');

  // Initial filter for villas/estates
  const baseVillas = properties.filter(p => p.type === 'villa' || p.type === 'estate');

  // Dynamic real-time filtration
  const filteredVillas = baseVillas.filter(prop => {
    if (location && !prop.location.toLowerCase().includes(location.toLowerCase())) {
      return false;
    }
    if (purpose !== 'all' && prop.purpose !== purpose) {
      return false;
    }
    if (priceMax && prop.price > parseInt(priceMax)) {
      return false;
    }
    return true;
  });

  return (
    <div className="pt-28 pb-20 font-sans min-h-screen text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner header */}
        <div className="mb-10 text-center sm:text-left">
          <span className="text-[10px] font-mono tracking-widest text-[#a855f7] uppercase font-bold block mb-1">
            LUXURY VILLAS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-white">
            Villas & Mansions
          </h1>
          <p className="text-stone-300 text-xs mt-1">
            Explore beautiful luxury villas, spacious mansions, and beach sanctuaries.
          </p>
        </div>

        {/* Real-Time Interactive Search/Filter bar */}
        <div className="bg-[#090b1c]/60 border border-purple-500/20 p-5 rounded-3xl mb-12 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            
            {/* Search Location */}
            <div className="flex flex-col gap-1.5 focus:border-purple-505">
              <label className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-widest">
                LOCATION
              </label>
              <div className="flex items-center gap-2 bg-[#05060f] border border-purple-500/15 p-3 rounded-xl">
                <MapPin size={14} className="text-purple-400 shrink-0" />
                <input 
                  type="text"
                  placeholder="Filter by location (e.g. Beverly Hills)..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent border-none text-xs focus:outline-none w-full placeholder-stone-605 text-white font-semibold focus:ring-0"
                />
              </div>
            </div>

            {/* Purpose selects Rent/Buy */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono font-bold text-stone-404 uppercase tracking-widest">
                LISTING STATUS
              </label>
              <div className="flex justify-between items-center bg-[#05060f] border border-purple-500/15 p-1 rounded-xl">
                {['all', 'buy', 'rent'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPurpose(p)}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all tracking-wider ${
                      purpose === p 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md' 
                        : 'text-stone-450 hover:text-stone-200'
                    }`}
                  >
                    {p === 'all' ? 'All' : p === 'buy' ? 'Buy' : 'Rent'}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Budget Limit */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono font-bold text-stone-404 uppercase tracking-widest">
                MAX BUDGET ($)
              </label>
              <div className="flex items-center gap-2 bg-[#05060f] border border-purple-500/15 p-3 rounded-xl">
                <DollarSign size={14} className="text-purple-400 shrink-0" />
                <input 
                  type="number"
                  placeholder="Any budget..."
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="bg-transparent border-none text-xs focus:outline-none w-full placeholder-stone-600 text-white font-mono focus:ring-0"
                />
              </div>
            </div>

          </div>
          
          <div className="mt-4 flex justify-between items-center text-[10px] text-stone-500 font-mono">
            <span>REAL-TIME SEARCH FILTER</span>
            <span className="text-purple-400 font-bold">{filteredVillas.length} matches detected</span>
          </div>
        </div>

        {/* Listings Display Grid */}
        {filteredVillas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVillas.map(p => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="glass-panel p-16 rounded-3xl text-center flex flex-col items-center">
            <Sparkles size={36} className="text-purple-500/50 mb-4 animate-pulse" />
            <h3 className="font-serif text-lg font-bold text-white">No Villas Found</h3>
            <p className="text-stone-400 text-xs mt-2 max-w-xs font-sans font-light">
              We couldn't find any villas matching your current search options. Try widening your price range or clearing filters.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
