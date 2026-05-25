import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import PropertyCard from '../components/PropertyCard.jsx';
import { 
  Search, Sliders, Grid, List, MapPin, BedDouble, 
  Bath, Maximize, Filter, X, ChevronDown, Sparkles
} from 'lucide-react';

export default function Properties() {
  const { properties, searchQuery, setSearchQuery, showToast } = useApp();

  // Grid / List Toggle
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Dynamic filter state
  const [selectedPurpose, setSelectedPurpose] = useState(searchQuery.purpose || 'all'); // buy, rent, all
  const [selectedType, setSelectedType] = useState(searchQuery.type || 'all');
  const [locationInput, setLocationInput] = useState(searchQuery.location || '');
  const [minPrice, setMinPrice] = useState(searchQuery.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(searchQuery.maxPrice || '');
  const [beds, setBeds] = useState(searchQuery.beds || 'all');
  const [baths, setBaths] = useState('all');
  const [minSize, setMinSize] = useState('');
  const [maxSize, setMaxSize] = useState('');
  
  // Custom boolean luxury tags
  const [furnished, setFurnished] = useState(false);
  const [parking, setParking] = useState(false);
  const [swimmingPool, setSwimmingPool] = useState(false);
  const [garden, setGarden] = useState(false);

  // Sorting State
  const [sortOption, setSortOption] = useState('latest'); // latest, price-asc, price-desc, popular

  // Synchronize internal filter states if search context changes
  useEffect(() => {
    setSelectedPurpose(searchQuery.purpose || 'all');
    setSelectedType(searchQuery.type || 'all');
    setLocationInput(searchQuery.location || '');
    setMinPrice(searchQuery.minPrice || '');
    setMaxPrice(searchQuery.maxPrice || '');
    setBeds(searchQuery.beds || 'all');
  }, [searchQuery]);

  // Compute filtered properties
  const filteredProperties = properties.filter(prop => {
    // Purpose: Buy/Rent
    if (selectedPurpose !== 'all' && prop.purpose !== selectedPurpose) return false;

    // Structure classification matches
    if (selectedType !== 'all' && prop.type !== selectedType) return false;

    // Location index containment
    if (locationInput && !prop.location.toLowerCase().includes(locationInput.toLowerCase())) return false;

    // Liquid Pricing minimums and ceilings
    if (minPrice && prop.price < parseInt(minPrice)) return false;
    if (maxPrice && prop.price > parseInt(maxPrice)) return false;

    // Beds / Baths counts matched
    if (beds !== 'all' && prop.beds < parseInt(beds)) return false;
    if (baths !== 'all' && prop.baths < parseInt(baths)) return false;

    // Sq Ft dimensions
    if (minSize && prop.area < parseInt(minSize)) return false;
    if (maxSize && prop.area > parseInt(maxSize)) return false;

    // Luxury checkbox parameters
    if (furnished && !prop.furnished) return false;
    if (parking && !prop.parking) return false;
    if (swimmingPool && !prop.swimmingPool) return false;
    if (garden && !prop.garden) return false;

    return true;
  });

  // Sort filtered properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    if (sortOption === 'popular') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    // Default 'latest' by descending ID
    return b.id - a.id;
  });

  const clearFilters = () => {
    setSelectedPurpose('all');
    setSelectedType('all');
    setLocationInput('');
    setMinPrice('');
    setMaxPrice('');
    setBeds('all');
    setBaths('all');
    setMinSize('');
    setMaxSize('');
    setFurnished(false);
    setParking(false);
    setSwimmingPool(false);
    setGarden(false);
    setSearchQuery({
      purpose: 'all',
      type: 'all',
      location: '',
      minPrice: '',
      maxPrice: '',
      beds: 'all'
    });
    showToast("Filters reset to default view.", "info");
  };

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(2)}M`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <div className="pt-24 min-h-screen pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6 border-b border-purple-500/10 gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-purple-400 uppercase block mb-1">
              AVAILABLE PROPERTIES
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-100">
              Explore Our Listings
            </h1>
            <p className="text-stone-400 text-xs mt-1">
              We found <span className="font-semibold text-purple-300">{sortedProperties.length} luxury homes</span> matching your criteria.
            </p>
          </div>

          {/* Grid/List layout toggle + Sorting panel */}
          <div className="flex gap-4 items-center w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1 bg-[#080c16] p-1.5 rounded-xl border border-purple-500/15">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-purple-950/40 text-purple-400 shadow-xs' : 'text-stone-400'}`}
                title="Grid Layout"
              >
                <Grid size={15} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-purple-950/40 text-purple-400 shadow-xs' : 'text-stone-400'}`}
                title="Detail List Layout"
              >
                <List size={15} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-purple-300 font-mono font-bold uppercase hidden lg:block">Sort By:</span>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-[#080c16] border border-purple-500/15 text-xs font-semibold px-4 py-2.5 rounded-xl focus:outline-none text-white cursor-pointer focus:ring-1 focus:ring-purple-500"
              >
                <option value="latest" className="bg-[#0b0c16]">Newest Listings</option>
                <option value="price-asc" className="bg-[#0b0c16]">Price: Low to High</option>
                <option value="price-desc" className="bg-[#0b0c16]">Price: High to Low</option>
                <option value="popular" className="bg-[#0b0c16]">Most Popular</option>
              </select>
            </div>

            <button 
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden p-2.5 rounded-xl btn-premium text-white flex items-center justify-center shadow-lg cursor-pointer"
            >
              <Filter size={16} />
            </button>
          </div>
        </div>

        {/* Core Double Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* A. Left Sidebar Filter panel (Desktop Only) */}
          <aside className="hidden lg:block glass-panel p-6 rounded-3xl flex flex-col gap-6">
            <div className="flex justify-between items-center pb-4 border-b border-purple-500/10">
              <span className="font-serif font-bold text-sm tracking-wide flex items-center gap-2 text-stone-100">
                <Sliders size={16} className="text-purple-400" />
                <span>Search Filters</span>
              </span>
              <button 
                onClick={clearFilters}
                className="text-[10px] font-mono font-bold text-stone-400 hover:text-purple-400 hover:underline uppercase cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Purpose Buy/Rent */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">Listing Type</label>
              <div className="grid grid-cols-3 gap-1 bg-[#05060f] p-1 rounded-xl border border-purple-500/10">
                {['all', 'buy', 'rent'].map((b) => (
                  <button 
                    key={b}
                    onClick={() => setSelectedPurpose(b)}
                    className={`py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      selectedPurpose === b 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-sm' 
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {b === 'all' ? 'All' : b === 'buy' ? 'Buy' : 'Rent'}
                  </button>
                ))}
              </div>
            </div>

            {/* Location district search */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">Location</label>
              <div className="flex items-center gap-2 bg-[#05060f] border border-purple-500/15 p-2.5 rounded-xl">
                <MapPin size={14} className="text-purple-400 shrink-0" />
                <input 
                  type="text" 
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="e.g. Beverly Hills" 
                  className="bg-transparent border-none text-xs focus:outline-none w-full placeholder-stone-500 text-white font-sans focus:ring-0"
                />
              </div>
            </div>

            {/* Classification */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">Property Type</label>
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-[#05060f] border border-purple-500/15 p-2.5 rounded-xl text-xs font-semibold focus:outline-none text-white cursor-pointer focus:ring-1 focus:ring-purple-500"
              >
                <option value="all" className="bg-[#0b0c16]">All Property Types</option>
                <option value="villa" className="bg-[#0b0c16]">Villas</option>
                <option value="apartment" className="bg-[#0b0c16]">Apartments & Penthouses</option>
                <option value="home" className="bg-[#0b0c16]">Residential Houses</option>
                <option value="room" className="bg-[#0b0c16]">Studio Lofts</option>
                <option value="commercial" className="bg-[#0b0c16]">Commercial Spaces</option>
              </select>
            </div>

            {/* Pricing liquid thresholds */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">PRICE RANGE ($)</label>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="number" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min" 
                  className="bg-[#05060f] border border-purple-500/15 p-2.5 rounded-xl text-xs focus:outline-none placeholder-stone-550 text-white min-w-0"
                />
                <input 
                  type="number" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max" 
                  className="bg-[#05060f] border border-purple-500/15 p-2.5 rounded-xl text-xs focus:outline-none placeholder-stone-550 text-white min-w-0"
                />
              </div>
            </div>

            {/* Beds counts */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">Bedrooms</label>
              <div className="grid grid-cols-5 gap-1 bg-[#05060f] p-1 rounded-xl border border-purple-500/10">
                {['all', '1', '3', '5', '6'].map((b) => (
                  <button 
                    key={b}
                    onClick={() => setBeds(b)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      beds === b 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xs' 
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {b === 'all' ? 'All' : `${b}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Area Size */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">Square Footage (Sq Ft)</label>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="number" 
                  value={minSize}
                  onChange={(e) => setMinSize(e.target.value)}
                  placeholder="Min SqFt" 
                  className="bg-[#05060f] border border-purple-500/15 p-2.5 rounded-xl text-xs focus:outline-none placeholder-stone-550 text-white font-mono min-w-0"
                />
                <input 
                  type="number" 
                  value={maxSize}
                  onChange={(e) => setMaxSize(e.target.value)}
                  placeholder="Max SqFt" 
                  className="bg-[#05060f] border border-purple-500/15 p-2.5 rounded-xl text-xs focus:outline-none placeholder-stone-550 text-white font-mono min-w-0"
                />
              </div>
            </div>

            <hr className="border-purple-500/10" />

            {/* Premium Amenity Booleans checkboxes */}
            <div className="flex flex-col gap-3 font-sans">
              <label className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest block mb-1">
                Property Features
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-stone-300 hover:text-white transition-colors">
                <input 
                  type="checkbox" 
                  checked={furnished} 
                  onChange={() => setFurnished(!furnished)} 
                  className="rounded border-purple-550/20 text-purple-600 focus:ring-purple-500 h-4 w-4 bg-transparent cursor-pointer"
                />
                <span className="select-none">Fully Furnished</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-stone-300 hover:text-white transition-colors">
                <input 
                  type="checkbox" 
                  checked={parking} 
                  onChange={() => setParking(!parking)} 
                  className="rounded border-purple-550/20 text-purple-600 focus:ring-purple-500 h-4 w-4 bg-transparent cursor-pointer"
                />
                <span className="select-none">Private Garage</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-stone-300 hover:text-white transition-colors">
                <input 
                  type="checkbox" 
                  checked={swimmingPool} 
                  onChange={() => setSwimmingPool(!swimmingPool)} 
                  className="rounded border-purple-550/20 text-purple-600 focus:ring-purple-500 h-4 w-4 bg-transparent cursor-pointer"
                />
                <span className="select-none">Swimming Pool</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-stone-300 hover:text-white transition-colors">
                <input 
                  type="checkbox" 
                  checked={garden} 
                  onChange={() => setGarden(!garden)} 
                  className="rounded border-purple-550/20 text-purple-600 focus:ring-purple-500 h-4 w-4 bg-transparent cursor-pointer"
                />
                <span className="select-none">Private Garden</span>
              </label>
            </div>

          </aside>

          {/* B. Core Properties Presentation (Col Span 3) */}
          <main className="lg:col-span-3">
            {sortedProperties.length > 0 ? (
              viewMode === 'grid' ? (
                /* Grid view display */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {sortedProperties.map(property => (
                    <div key={property.id} className="animate-fadeIn">
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>
              ) : (
                /* List view display */
                <div className="flex flex-col gap-6">
                  {sortedProperties.map(property => (
                    <div 
                      key={property.id} 
                      className="group relative glass-panel glass-panel-hover rounded-3xl overflow-hidden flex flex-col sm:flex-row gap-5 p-4"
                    >
                      {/* Image Frame */}
                      <div className="sm:w-64 max-h-[180px] rounded-2xl overflow-hidden shrink-0 aspect-video sm:aspect-auto border border-purple-500/10">
                        <img src={property.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" referrerPolicy="no-referrer" />
                      </div>
                      
                      {/* Detail Frame */}
                      <div className="flex flex-col justify-between flex-grow">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] font-mono font-bold text-purple-400 block tracking-widest uppercase">{property.type} CLASSIFICATION</span>
                            <span className="text-sm font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                              {formatPrice(property.price)}
                              {property.purpose === 'rent' && <span className="text-[10px] font-normal text-stone-400">/mo</span>}
                            </span>
                          </div>
                          
                          <h3 className="font-serif font-bold text-base text-stone-100 mt-1 hover:text-purple-400 transition-colors">
                            {property.title}
                          </h3>

                          <p className="text-stone-300 text-xs lines-clamp-2 mt-2 font-sans font-light">
                            {property.description}
                          </p>
                        </div>

                        {/* Specs Ribbon */}
                        <div className="border-t border-purple-500/10 pt-3 mt-4 flex justify-between items-center text-xs font-mono text-stone-300">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1"><BedDouble size={14} className="text-purple-400" /> {property.beds} Beds</span>
                            <span className="flex items-center gap-1"><Bath size={14} className="text-purple-400" /> {property.baths} Baths</span>
                            <span className="flex items-center gap-1"><Maximize size={14} className="text-purple-400" /> {property.area.toLocaleString()} SqFt</span>
                          </div>
                          
                          <button 
                            onClick={(e) => { e.preventDefault(); }}
                            className="bg-purple-950/20 hover:bg-purple-900/50 hover:text-white border border-purple-500/20 px-3 py-1.5 rounded-lg text-purple-300 font-mono text-[10px] uppercase font-bold transition-all cursor-pointer"
                          >
                            View Portfolio
                          </button>
                        </div>
                      </div>
                      <a href={`/properties/${property.id}`} className="absolute inset-0 z-0 opacity-0" />
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* Empty state layout */
              <div className="glass-panel p-16 rounded-3xl text-center flex flex-col items-center">
                <Filter size={48} className="text-purple-500/50 mb-6 animate-pulse" />
                <h3 className="font-serif text-xl font-bold text-stone-100">No Properties Found</h3>
                <p className="text-stone-404 text-xs max-w-sm mt-3 font-sans font-light">
                  We couldn't find any listings that match your search filters. Try adjusting your features or clearing your keywords!
                </p>
                <button 
                  onClick={clearFilters}
                  className="btn-premium text-white text-xs font-bold py-3 px-6 rounded-xl mt-6 cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </main>
        </div>

      </div>

      {/* C. Mobile Slider Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end animate-fadeIn" onClick={() => setShowMobileFilters(false)}>
          <div className="bg-[#05060f] w-full max-h-[85vh] overflow-y-auto rounded-t-3xl p-6 border-t border-purple-500/25" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-purple-500/10">
              <span className="font-serif font-bold text-sm text-stone-150">Search Filters</span>
              <button onClick={() => setShowMobileFilters(false)} className="p-1 rounded-full bg-purple-950/20 text-stone-300 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Copy of core filters for mobile layout */}
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-2">
                {['all', 'buy', 'rent'].map((b) => (
                  <button 
                    key={b}
                    onClick={() => setSelectedPurpose(b)}
                    className={`py-2 rounded-xl text-xs font-bold uppercase cursor-pointer ${selectedPurpose === b ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black shadow-lg' : 'bg-purple-950/20 text-stone-300'}`}
                  >
                    {b === 'all' ? 'All' : b === 'buy' ? 'Buy' : 'Rent'}
                  </button>
                ))}
              </div>

              {/* District */}
              <div>
                <label className="text-[10px] font-mono font-bold text-stone-400 mb-1.5 block">Location</label>
                <input 
                  type="text" 
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="e.g. Los Angeles" 
                  className="bg-[#080a1c] border border-purple-500/15 p-3 rounded-xl text-xs w-full focus:outline-none placeholder-stone-500 text-white"
                />
              </div>

              {/* Type */}
              <div>
                <label className="text-[10px] font-mono font-bold text-stone-400 mb-1.5 block font-bold">Property Type</label>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-[#080a1c] border border-purple-500/15 p-3 rounded-xl text-xs w-full focus:outline-none text-white cursor-pointer"
                >
                  <option value="all" className="bg-[#0b0c16]">All Property Types</option>
                  <option value="villa" className="bg-[#0b0c16]">Villas</option>
                  <option value="apartment" className="bg-[#0b0c16]">Apartments</option>
                  <option value="home" className="bg-[#0b0c16]">Houses</option>
                  <option value="room" className="bg-[#0b0c16]">Studios</option>
                  <option value="commercial" className="bg-[#0b0c16]">Commercial</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="text-[10px] font-mono font-bold text-stone-400 mb-1.5 block">Price Range ($)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="bg-[#080a1c] border border-purple-500/15 p-3 rounded-xl text-xs focus:outline-none text-white" />
                  <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="bg-[#080a1c] border border-purple-500/15 p-3 rounded-xl text-xs focus:outline-none text-white" />
                </div>
              </div>

              <div className="flex gap-3 mt-4 justify-between">
                <button onClick={clearFilters} className="text-xs font-bold py-3 px-6 rounded-xl border border-purple-500/20 text-stone-300 cursor-pointer">Reset</button>
                <button onClick={() => setShowMobileFilters(false)} className="btn-premium text-white text-xs font-bold py-3 px-12 rounded-xl flex-grow cursor-pointer">Apply Filters</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
