import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { 
  Building, DollarSign, MapPin, BedDouble, Bath, 
  Maximize, Upload, Sparkles, Send, ArrowLeft, ShieldCheck, Grid, Trash2, Loader2
} from 'lucide-react';

const presetImages = [
  { id: 'villa', label: 'Bespoke Villa compound', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&h=600&q=80' },
  { id: 'apartment', label: 'Tribeca Luxury Penthouse', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&h=600&q=80' },
  { id: 'home', label: 'Suburban Forest Sanctuary', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&h=600&q=80' },
  { id: 'room', label: 'Minimalist Duplex loft', url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&h=600&q=80' },
  { id: 'commercial', label: 'Sovereign Business Center', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&h=600&q=80' }
];

export default function AddProperty() {
  const { addProperty, currentUser, showToast, uploadFileToStorage } = useApp();
  const navigate = useNavigate();

  // Core properties states
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [purpose, setPurpose] = useState('sale'); // sale, rent
  const [type, setType] = useState('villa');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [beds, setBeds] = useState('2');
  const [baths, setBaths] = useState('2');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');
  const [yearBuilt, setYearBuilt] = useState('2026');
  
  // Custom images upload state
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [draftId] = useState(() => self.crypto?.randomUUID ? self.crypto.randomUUID() : Math.random().toString(36).substring(2, 15));

  const processFiles = async (files) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const imageFiles = files.filter(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      return validTypes.includes(file.type) || ['jpg', 'jpeg', 'png', 'webp'].includes(extension);
    });

    if (imageFiles.length === 0) {
      showToast("Please drop or select JPG, PNG, or WebP images.", "error");
      return;
    }

    setIsProcessing(true);

    const newImages = [];
    for (const file of imageFiles) {
      try {
        const result = await uploadFileToStorage(file, 'properties', draftId);
        if (result) {
          newImages.push(result);
        }
      } catch (err) {
        console.error("Error reading file:", err);
        showToast("Asset upload failed.", "error");
      }
    }

    setUploadedImages(prev => [...prev, ...newImages]);
    setIsProcessing(false);
    showToast(`Processed ${imageFiles.length} luxury photograph(s) successfully.`, "success");
  };

  const handleRemoveImage = (indexToRemove) => {
    setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
    showToast("Photograph removed from collection.", "info");
  };

  // Amenities checklist
  const [amenities, setAmenities] = useState({
    "Infinity Pool": false,
    "Wine Cellar": false,
    "Private Elevator": false,
    "Concierge 24/7": false,
    "Heated Driveway": false,
    "Home Automation": false,
    "Private Cinema": false,
    "Hot Tub": false
  });

  const handleAmenityChange = (key) => {
    setAmenities(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      showToast("Access Denied. You must authenticate first.", "error");
      navigate('/login');
      return;
    }

    if (!title || !price || !location || !area) {
      showToast("Please fill in all core fields", "error");
      return;
    }

    if (uploadedImages.length === 0) {
      showToast("Please upload at least one premium image for this listing.", "error");
      return;
    }

    // Determine finalized image URL
    const finalImage = uploadedImages[0];

    // Filter checklist values
    const selectedAmenities = Object.keys(amenities).filter(k => amenities[k]);

    const propertyData = {
      title,
      price: parseInt(price),
      purpose,
      type,
      location,
      address: address || `${location}, Earth Coordinates`,
      beds: parseInt(beds),
      baths: parseFloat(baths),
      area: parseInt(area),
      image: finalImage,
      images: uploadedImages,
      featured: false,
      furnished: selectedAmenities.includes("Premium Furnished") || true,
      parking: true,
      swimmingPool: selectedAmenities.includes("Infinity Pool"),
      garden: true,
      description: description || `Located in prime ${location}, this newly uploaded ${type} offers stellar modern architecture with bespoke fittings.`,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : ["Floor-to-ceiling glass", "Fitted Wardrobes", "Private Deck", "Miele Appliances"],
      yearBuilt: parseInt(yearBuilt),
      status: "available"
    };

    setIsProcessing(true);
    const newId = await addProperty(propertyData);
    setIsProcessing(false);
    if (newId) {
      navigate(`/properties/${newId}`);
    }
  };

  return (
    <div className="pt-24 pb-20 font-sans min-h-screen text-stone-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb back navigation */}
        <Link to="/properties" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-stone-400 hover:text-purple-400 transition-colors uppercase mb-8 cursor-pointer">
          <ArrowLeft size={14} className="text-purple-450" />
          <span>Exit To Collector</span>
        </Link>

        <div className="glass-panel rounded-3xl p-8 shadow-2xl">
          
          <div className="flex items-start gap-4 pb-6 border-b border-purple-500/10 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-purple-950/20 text-purple-400 flex items-center justify-center shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-white">Upload Premium Listing</h1>
              <p className="text-stone-400 text-xs mt-0.5 font-light">Let's publish your upscale asset securely into DreamStay Homes' global market channels.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-xs text-stone-200">
            
            {/* Section 1: Core parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-purple-500/10">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-stone-404 uppercase tracking-widest">ESTATE TITLE</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Sapphire Sea Sanctuary" 
                  required
                  className="bg-[#05060f] border border-purple-550/20 p-3.5 rounded-xl text-xs w-full focus:outline-none placeholder-stone-500 font-semibold focus:border-purple-550 focus:ring-1 focus:ring-purple-550 text-white font-sans"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-stone-404 uppercase tracking-widest">LIQUID RESERVE ($)</label>
                <input 
                  type="number" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 1850000" 
                  required
                  className="bg-[#05060f] border border-purple-550/20 p-3.5 rounded-xl text-xs w-full focus:outline-none placeholder-stone-500 font-mono text-white focus:border-purple-550 focus:ring-1 focus:ring-purple-550"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-stone-404 uppercase tracking-widest">TRANSACTION DISPATCH</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button" 
                    onClick={() => setPurpose('sale')}
                    className={`py-3.5 rounded-xl text-xs font-bold uppercase cursor-pointer transition-all ${purpose === 'sale' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md' : 'bg-purple-950/20 text-stone-400'}`}
                  >
                    Listed for Sale
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setPurpose('rent')}
                    className={`py-3.5 rounded-xl text-xs font-bold uppercase cursor-pointer transition-all ${purpose === 'rent' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md' : 'bg-purple-950/20 text-stone-400'}`}
                  >
                    Listed for Rent
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-stone-404 uppercase tracking-widest">CLASSIFICATION TYPE</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="bg-[#05060f] border border-purple-550/20 p-3.5 rounded-xl text-xs w-full font-semibold focus:outline-none cursor-pointer text-white focus:ring-1 focus:ring-purple-500"
                >
                  <option value="villa" className="bg-[#0b0c16]">Estate Villa</option>
                  <option value="apartment" className="bg-[#0b0c16]">Apartment Penthouse</option>
                  <option value="home" className="bg-[#0b0c16]">Suburban House</option>
                  <option value="room" className="bg-[#0b0c16]">Studio Room Loft</option>
                  <option value="commercial" className="bg-[#0b0c16]">Commercial Center</option>
                </select>
              </div>

            </div>

            {/* Section 2: Layout specs and dimensions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-purple-500/10">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono font-bold text-stone-400 uppercase">BEDROOMS</label>
                <select value={beds} onChange={(e) => setBeds(e.target.value)} className="bg-[#05060f] border border-purple-550/15 p-3 rounded-xl focus:outline-none cursor-pointer text-white">
                  {[1,2,3,4,5,6,8,12].map(n => <option key={n} value={n} className="bg-[#0b0c16]">{n} Suites</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono font-bold text-stone-400 uppercase">BATHROOMS</label>
                <select value={baths} onChange={(e) => setBaths(e.target.value)} className="bg-[#05060f] border border-purple-550/15 p-3 rounded-xl focus:outline-none cursor-pointer text-white">
                  {[1,1.5,2,2.5,3,3.5,4,5,6,8,10].map(n => <option key={n} value={n} className="bg-[#0b0c16]">{n} Baths</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono font-bold text-stone-400 uppercase">LAND SIZES (SQ FT)</label>
                <input 
                  type="number" 
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. 5400" 
                  required
                  className="bg-[#05060f] border border-purple-550/15 p-3 rounded-xl focus:outline-none font-mono font-semibold text-white focus:border-purple-550"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono font-bold text-stone-400 uppercase">YEAR BUILT</label>
                <input 
                  type="number" 
                  value={yearBuilt}
                  onChange={(e) => setYearBuilt(e.target.value)}
                  className="bg-[#05060f] border border-purple-550/15 p-3 rounded-xl focus:outline-none font-mono text-white focus:border-purple-550"
                />
              </div>

            </div>

            {/* Section 3: Visual assets selectors */}
            <div className="pb-6 border-b border-purple-500/10">
              <label className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest block mb-2 font-mono">
                Portraits & Images (Upload at least 5 images recommended)
              </label>
              
              <div 
                id="drop-zone"
                className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[220px] select-none ${
                  isDragging 
                    ? 'border-purple-500 bg-purple-950/40 shadow-[0_0_20px_rgba(168,85,247,0.2)]' 
                    : 'border-purple-500/20 bg-[#05060f] hover:border-purple-500/50 hover:bg-[#07091b]/50'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={async (e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const files = Array.from(e.dataTransfer.files);
                  await processFiles(files);
                }}
                onClick={() => document.getElementById('file-upload-input').click()}
              >
                <input 
                  id="file-upload-input"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files);
                    await processFiles(files);
                  }}
                  className="hidden"
                />
                
                <div className="flex flex-col items-center gap-4">
                  {isProcessing ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 size={32} className="text-purple-400 animate-spin" />
                      <span className="text-xs font-mono text-purple-300 font-bold uppercase tracking-wider mt-2">Processing assets...</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-2xl bg-purple-950/20 text-purple-400 flex items-center justify-center transition-transform hover:scale-110">
                        <Upload size={24} className="animate-pulse" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Drag and drop your luxury photographs</span>
                        <span className="text-[10px] text-stone-400 block mt-1 font-light leading-relaxed">
                          Supports JPG, PNG, and WebP. You can select multiple files at once.
                        </span>
                      </div>
                      <button 
                        type="button"
                        className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/25 border border-purple-500/25 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider text-purple-300 transition-colors cursor-pointer"
                      >
                        Or browse files
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Image Preview Area */}
              {uploadedImages.length > 0 && (
                <div className="mt-6 animate-fadeIn">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                      PREVIEW ASSETS ({uploadedImages.length} uploaded)
                    </span>
                    <button 
                      type="button" 
                      onClick={() => { setUploadedImages([]); showToast("Cleared all previews.", "info"); }}
                      className="text-[9px] font-mono text-rose-400 hover:text-rose-300 uppercase tracking-widest font-bold border-b border-rose-500/20 cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {uploadedImages.map((imgObj, index) => {
                      const imgUrl = typeof imgObj === 'string' ? imgObj : imgObj.url;
                      return (
                        <div key={index} className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-purple-500/20 group animate-fadeIn">
                          <img 
                            src={imgUrl} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                            alt={`Asset ${index + 1}`} 
                          />
                          
                          {/* Index badge */}
                          <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-[8px] font-mono font-bold text-stone-300">
                            #{index + 1} {index === 0 && "COVER"}
                          </span>

                          {/* Delete button wrapper */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(index);
                            }}
                            className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-950/85 hover:bg-red-900 border border-red-500/40 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                            title="Remove photograph"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Locations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-purple-500/10">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-stone-400 uppercase">CITY DISTRICT LOCATION</label>
                <div className="flex items-center gap-2 bg-[#05060f] border border-purple-500/15 p-3 rounded-xl">
                  <MapPin size={14} className="text-purple-400 shrink-0" />
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Beverly Hills, California" 
                    required
                    className="bg-transparent border-none text-xs w-full focus:outline-none placeholder-stone-500 focus:ring-0 text-white font-sans"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold text-stone-400 uppercase">STREET ADDRESS (MAPPED CONCIERGE)</label>
                <div className="flex items-center gap-2 bg-[#05060f] border border-purple-500/15 p-3 rounded-xl">
                  <MapPin size={14} className="text-purple-400 shrink-0" />
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 9405 Loma Vista Dr" 
                    className="bg-transparent border-none text-xs w-full focus:outline-none placeholder-stone-500 focus:ring-0 text-white font-sans"
                  />
                </div>
              </div>

            </div>

            {/* Section 5: Description narrative */}
            <div className="pb-6 border-b border-purple-500/10">
              <label className="text-[10px] font-mono font-bold text-stone-400 uppercase block mb-1.5">
                ARCHITECTURAL NARRATIVE
              </label>
              <textarea 
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Give a detailed editorial summary describing the lights, materials, view vectors, pools, layouts..."
                className="bg-[#05060f] border border-purple-550/20 p-4 rounded-xl text-xs w-full focus:outline-none font-sans leading-relaxed text-stone-105 placeholder-stone-500 lg:text-sm text-white focus:border-purple-550 focus:ring-1 focus:ring-purple-550"
              />
            </div>

            {/* Section 6: Curated checklist */}
            <div>
              <label className="text-[10px] font-mono font-bold text-stone-404 uppercase tracking-widest block mb-4">
                SELECT PRIMARY LUXURY UPGRADES
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.keys(amenities).map(key => (
                  <label key={key} className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#05060f]/60 border border-purple-500/15 cursor-pointer text-xs font-semibold hover:border-purple-400 transition-all select-none">
                    <input 
                      type="checkbox" 
                      checked={amenities[key]}
                      onChange={() => handleAmenityChange(key)}
                      className="rounded border-purple-550/20 text-purple-600 focus:ring-purple-500 h-4 w-4 bg-transparent cursor-pointer"
                    />
                    <span className="truncate leading-none text-stone-300 font-sans">{key}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Warnings and triggers submission */}
            <div className="p-4 bg-purple-950/20 border border-purple-500/15 rounded-2xl flex items-start gap-3 mt-4 text-[11px] leading-relaxed text-stone-400 font-mono">
              <ShieldCheck size={16} className="text-purple-400 shrink-0 mt-0.5" />
              <span>By requesting deployment, you authorize DreamStay Homes managing lawyers to trigger background tax checks on deeds of custody. Zero fake registries permitted.</span>
            </div>

            <button 
              type="submit"
              className="mt-4 btn-premium text-white font-bold py-4 px-12 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Building size={15} />
              <span>Request Listing Publication</span>
            </button>

          </form>

        </div>
        
      </div>
    </div>
  );
}
