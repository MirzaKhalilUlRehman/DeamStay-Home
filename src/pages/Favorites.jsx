import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import PropertyCard from '../components/PropertyCard.jsx';
import { Heart, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const { properties, favorites, showToast } = useApp();

  const savedProperties = properties.filter(p => favorites.includes(p.id));

  return (
    <div className="pt-24 min-h-screen pb-20 font-sans text-stone-100 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper Header Layout */}
        <div className="flex justify-between items-end pb-6 border-b border-purple-500/10 mb-10">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#a855f7] uppercase block">
              SECURE DEPOSITORY CLOSET
            </span>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white mt-1">
              My Favorites Vault
            </h1>
            <p className="text-stone-400 text-xs mt-1">
              Currently preserving <span className="font-semibold text-purple-300">{savedProperties.length} bookmarked archives</span> securely.
            </p>
          </div>

          <Link to="/properties" className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase font-mono tracking-wider">
            Browse Estates
          </Link>
        </div>

        {savedProperties.length > 0 ? (
          /* Grid mapping */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedProperties.map(property => (
              <div key={property.id} className="animate-fadeIn">
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        ) : (
          /* High fidelity empty states visual fallback */
          <div className="glass-panel p-16 rounded-3xl text-center flex flex-col items-center">
            <Heart size={44} className="text-purple-500/60 mb-6 animate-pulse" />
            <h3 className="font-serif text-xl font-bold text-white">No Retained Portfolios</h3>
            <p className="text-stone-400 text-xs mt-3 max-w-sm mx-auto font-sans font-light">
              You haven't bookmark-saved any listings to this secure catalog yet. Browse our market catalog to find magnificent properties!
            </p>
            <Link 
              to="/properties" 
              className="mt-6 btn-premium text-white text-xs font-bold py-3.5 px-8 rounded-xl"
            >
              Convene Collections
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
