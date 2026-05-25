import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Link } from 'react-router-dom';
import { Search, Star, Phone, Mail, Award, Globe } from 'lucide-react';

export default function Agents() {
  const { agents } = useApp();
  const [searchWord, setSearchWord] = useState('');

  const filteredAgents = agents.filter(a => {
    const term = searchWord.toLowerCase();
    return (
      a.name.toLowerCase().includes(term) ||
      a.specialty.toLowerCase().includes(term) ||
      a.languages.some(lang => lang.toLowerCase().includes(term))
    );
  });

  return (
    <div className="pt-24 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page title */}
        <div className="text-center max-w-2xl mx-auto mb-16 select-none">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#A8A29E] uppercase block mb-3">
            VERIFIED BROKER SYSTEM
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-stone-100">
            Principal Managing Partners
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs mt-3 leading-relaxed">
            Our trusted real estate representatives handle luxury transactions. Reach out directly to discuss advisory questions securely.
          </p>
        </div>

        {/* Search tool bar */}
        <div className="w-full max-w-md mx-auto mb-12 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-2.5 rounded-2xl flex items-center gap-2 shadow-sm">
          <Search size={16} className="text-stone-400" />
          <input 
            type="text" 
            placeholder="Search representative by name, language, or specialty..." 
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            className="bg-transparent border-none focus:outline-none w-full text-xs placeholder-stone-400"
          />
        </div>

        {/* Dynamic cards array */}
        {filteredAgents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAgents.map(agent => (
              <div 
                key={agent.id} 
                className="group relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-804 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo Frame */}
                  <div className="flex items-center gap-4 border-b border-stone-50 dark:border-zinc-850 pb-5 mb-5 select-none">
                    <img 
                      src={agent.image} 
                      alt={agent.name} 
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-500/15"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="font-bold text-stone-900 dark:text-stone-150 uppercase text-xs tracking-wider line-clamp-1">{agent.name}</h3>
                      <p className="text-[11px] text-amber-500 font-mono mt-0.5">{agent.role}</p>
                      
                      <div className="flex gap-1 text-amber-500 mt-1">
                        {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="#eab308" className="text-amber-550" />)}
                        <span className="text-[9px] text-stone-400 font-mono font-bold ml-1">({agent.rating})</span>
                      </div>
                    </div>
                  </div>

                  {/* Body description */}
                  <div className="flex flex-col gap-3 mb-6">
                    <p className="text-stone-500 dark:text-stone-400 text-xs lines-clamp-3 leading-relaxed font-sans">
                      "{agent.bio}"
                    </p>
                    
                    <div className="flex items-center gap-1.5 text-xs text-stone-60 leading-none capitalize font-medium dark:text-stone-300">
                      <Award size={13} className="text-amber-500" />
                      <span>{agent.specialty}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-stone-500 leading-none">
                      <Globe size={13} className="text-stone-400" />
                      <span className="text-[11px] font-mono text-stone-400">{agent.languages.join(", ")}</span>
                    </div>
                  </div>
                </div>

                {/* Foot panel coordinates */}
                <div className="border-t border-stone-50 dark:border-zinc-850 pt-4 flex justify-between items-center text-xs mt-auto">
                  <span className="text-[11px] font-mono text-stone-400">{agent.activeListings} Active Portfolios</span>
                  
                  <Link 
                    to={`/agents/${agent.id}`}
                    className="font-bold text-amber-500 text-xs hover:underline flex items-center gap-1 font-sans"
                  >
                    <span>Analyze Credentials</span>
                    <span>→</span>
                  </Link>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-xs text-stone-400 font-mono uppercase bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl">
            No matching brokers listed
          </div>
        )}

      </div>
    </div>
  );
}
