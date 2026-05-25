import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { Heart, MapPin, BedDouble, Bath, Maximize } from 'lucide-react';

export default function PropertyCard({ property }) {
  const { favorites, toggleFavorite, darkMode } = useApp();
  const isFavorite = favorites.includes(property.id);

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(2)}M`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <div className="group relative glass-panel glass-panel-hover rounded-[28px] p-3 overflow-hidden flex flex-col h-full hover:-translate-y-1 transition-all duration-300">
      
      {/* Invisible link wrapper across the card */}
      <Link to={`/properties/${property.id}`} className="absolute inset-0 z-0" />

      {/* Media Showcase container */}
      <div className="relative overflow-hidden aspect-video bg-neutral-950 z-10 rounded-[22px] mb-4 border border-luxury-purple/15">
        <img 
          src={property.image} 
          alt={property.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        
        {/* Overlaid parameters */}
        <div className="absolute top-3 left-3 z-20 flex gap-2">
          {property.featured && (
            <span className="bg-gradient-to-r from-blue-600 to-sky-600 text-white font-serif text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg shadow-lg tracking-wider">
              Exclusive
            </span>
          )}
          <span className="bg-neutral-950/85 backdrop-blur-md text-stone-300 font-mono text-[8.5px] font-bold uppercase px-2.5 py-1.5 rounded-lg shadow-sm tracking-wider border border-white/5">
            {property.purpose === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
        </div>

        {/* Favorite toggle absolute button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-neutral-950/90 backdrop-blur-md hover:bg-slate-900 border border-luxury-purple/40 text-stone-300 hover:text-rose-500 transition-all shadow-lg cursor-pointer"
          title={isFavorite ? "Remove from Saved" : "Save Estate"}
        >
          <Heart size={14} fill={isFavorite ? "#f43f5e" : "transparent"} className={isFavorite ? "text-rose-500" : "text-stone-300"} />
        </button>

        {/* Direct dynamic floating price pill */}
        <div className="absolute bottom-3 left-3 z-20 bg-neutral-950/95 backdrop-blur-md border border-luxury-purple/30 px-3.5 py-1.5 rounded-xl shadow-lg">
          <span className="text-sm font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">
            {formatPrice(property.price)}
            {property.purpose === 'rent' && <span className="text-[10px] font-mono text-stone-450 font-normal">/mo</span>}
          </span>
        </div>
      </div>

      {/* Property Details Column */}
      <div className="p-2 flex flex-col justify-between flex-grow z-10">
        
        <div className="mb-4 pointer-events-none">
          <span className="text-[9px] font-mono font-bold tracking-widest text-[#2563eb] dark:text-blue-400 uppercase block mb-1">
            {property.type} CLASSIFICATION
          </span>
          <h3 className="font-serif font-bold text-base dark:text-stone-100 text-slate-900 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-2 dark:text-stone-450 text-slate-550 font-sans">
            <MapPin size={13} className="text-blue-500 shrink-0" />
            <span className="text-xs truncate">{property.location}</span>
          </div>
        </div>

        {/* Technical parameters summary line */}
        <div className="mt-auto flex items-center justify-between p-3 dark:bg-slate-950/50 bg-slate-50 backdrop-blur-xs rounded-2xl dark:text-stone-300 text-slate-700 text-xs font-mono border border-luxury-purple/10 pointer-events-none">
          <div className="text-center flex-1">
            <p className="text-[8px] font-bold dark:text-stone-400 text-slate-500 uppercase tracking-widest leading-none">Beds</p>
            <p className="font-bold text-sm text-blue-600 dark:text-blue-400 mt-1 leading-none">{property.beds}</p>
          </div>
          <div className="w-[1px] h-6 bg-luxury-purple/15"></div>
          <div className="text-center flex-1">
            <p className="text-[8px] font-bold dark:text-stone-400 text-slate-500 uppercase tracking-widest leading-none">Baths</p>
            <p className="font-bold text-sm text-blue-600 dark:text-blue-400 mt-1 leading-none">{property.baths}</p>
          </div>
          <div className="w-[1px] h-6 bg-luxury-purple/15"></div>
          <div className="text-center flex-1">
            <p className="text-[8px] font-bold dark:text-stone-400 text-slate-500 uppercase tracking-widest leading-none">Area</p>
            <p className="font-bold text-sm text-blue-600 dark:text-blue-400 mt-1 whitespace-nowrap leading-none">
              {property.area} <span className="text-[8px] font-normal dark:text-stone-400 text-slate-500">SQFT</span>
            </p>
          </div>
        </div>

        {/* Explicit View Details Action Button */}
        <div className="mt-3 relative z-20">
          <Link 
            to={`/properties/${property.id}`}
            className="w-full inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-mono text-[10px] font-black uppercase tracking-wider py-2.5 rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(37,99,235,0.3)] shadow-md border border-blue-500/20 active:scale-95"
          >
            <span>View Details</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
