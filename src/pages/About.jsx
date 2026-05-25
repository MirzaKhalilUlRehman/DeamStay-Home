import React from 'react';
import { Compass, ShieldCheck, Globe, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="pt-24 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Title banner */}
        <div className="text-center max-w-3xl mx-auto mb-20 select-none">
          <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase block mb-3">
            VERIFIED BRAND CHARTER
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-stone-100">
            For Portfolios of <br/>
            <span className="text-amber-500 italic font-normal">Sovereign Excellence</span>
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-5 leading-relaxed font-light">
            Founded in 2018 in Beverly Hills, DreamStay Homes serves as the premier real estate broker index and verification engine for ultra-high-net-worth property transfers. Unlike legacy open listing boards, we focus purely on vetting, privacy, and frictionless transaction routing.
          </p>
        </div>

        {/* Section A: Photo Collage section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&h=800&q=80" 
              className="w-full h-full object-cover" 
              alt="Estates layout" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-[10px] font-mono font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
              OUR INTUITION METRICS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold dark:text-white">
              We vet characters as thoroughly as structures.
            </h2>
            <p className="text-stone-550 dark:text-stone-400 text-xs sm:text-sm leading-relaxed font-light">
              DreamStay Homes aligns with luxury advisors globally to maintain discretion. Every listed duplex, chalet, coastline villa, or corporate tower undergoes legal auditing before publication. We ensure complete structural compliance with zero anonymous registry placeholders.
            </p>

            <div className="grid grid-cols-2 gap-4 border-t border-stone-100 dark:border-zinc-800 pt-6">
              <div>
                <span className="font-serif text-2xl font-bold text-amber-500 block">$2.8B+</span>
                <span className="text-[9px] font-mono text-stone-400 font-bold uppercase block mt-1">Escorws transacted</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-zinc-900 dark:text-white block">100%</span>
                <span className="text-[9px] font-mono text-stone-400 font-bold uppercase block mt-1">Legal compliance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section B: Values criteria listing */}
        <div className="bg-stone-50 dark:bg-zinc-90 w-full rounded-3xl p-10 border border-zinc-150/40 dark:border-zinc-900 mb-20">
          <div className="text-center max-w-md mx-auto mb-10 select-none">
            <span className="text-[9px] font-mono text-amber-500 uppercase font-bold tracking-widest block mb-2">INTEGRITY MATRIX</span>
            <h3 className="font-serif text-xl font-bold">Uncompromising Rules</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <ShieldCheck size={18} />
              </div>
              <h4 className="font-bold text-stone-800 dark:text-stone-200 text-xs uppercase font-sans">discretion priority</h4>
              <p className="text-stone-405 dark:text-stone-400 text-xs font-light leading-relaxed">
                We safeguard identities. Financial records, coordinate logs, and private chats are encrypted and stored client-side.
              </p>
            </div>

            <div className="flex flex-col gap-3 border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-800 pt-6 md:pt-0 md:pl-8">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Compass size={18} />
              </div>
              <h4 className="font-bold text-stone-800 dark:text-stone-200 text-xs uppercase font-sans">concierge support</h4>
              <p className="text-stone-405 dark:text-stone-400 text-xs font-light leading-relaxed">
                Viewing requests catalog armored escalations, helicopter transfers, and verified advisors directly.
              </p>
            </div>

            <div className="flex flex-col gap-3 border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-805 pt-6 md:pt-0 md:pl-8">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Globe size={18} />
              </div>
              <h4 className="font-bold text-stone-800 dark:text-stone-200 text-xs uppercase font-sans">Elite locations global</h4>
              <p className="text-stone-405 dark:text-stone-400 text-xs font-light leading-relaxed">
                From Malibu oceanfront estates to skylines penthouses in NY and Dubai Marina, we index only sovereign properties.
              </p>
            </div>

          </div>
        </div>

        {/* C. CTA redirect action */}
        <div className="text-center py-6">
          <Link 
            to="/properties"
            className="inline-flex items-center gap-2 bg-zinc-950 hover:bg-stone-850 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 font-bold py-4 px-10 rounded-2xl text-xs shadow-md shadow-zinc-950/15"
          >
            <span>Convene Residential Portfolios</span>
            <span>→</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
