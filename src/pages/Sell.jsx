import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Building, DollarSign, MapPin, Sparkles, ShieldCheck, CheckCircle2, Upload, Trash2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sell() {
  const { addProperty, currentUser, showToast, uploadFileToStorage } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [purpose, setPurpose] = useState('sale'); // sale, rent
  const [type, setType] = useState('villa');
  const [location, setLocation] = useState('');
  const [beds, setBeds] = useState('3');
  const [baths, setBaths] = useState('2.5');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');

  // Custom images upload state
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [draftId, setDraftId] = useState(() => self.crypto?.randomUUID ? self.crypto.randomUUID() : Math.random().toString(36).substring(2, 15));

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
        console.error("Error upload file in Sell:", err);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !price || !location || !area) {
      showToast("Please fill in all core fields", "error");
      return;
    }

    if (uploadedImages.length === 0) {
      showToast("Please upload at least one premium image for this listing.", "error");
      return;
    }

    const finalImage = uploadedImages[0];

    const propertyData = {
      title,
      price: parseInt(price),
      purpose,
      type,
      location,
      address: `${location}, Prime District`,
      beds: parseInt(beds),
      baths: parseFloat(baths),
      area: parseInt(area),
      image: finalImage,
      images: uploadedImages,
      featured: false,
      furnished: true,
      parking: true,
      swimmingPool: true,
      garden: true,
      description: description || `Welcome to ${title}, a newly listed luxury ${type} located in beautiful ${location}. Built with state of the art materials and bespoke architecture.`,
      amenities: ["Ocean View", "Private Security", "Smart Control Lounge", "Wine Cellar"],
      yearBuilt: 2026,
      status: "available"
    };

    const newId = await addProperty(propertyData);
    setSubmittedId(newId);
    setSubmitted(true);
    showToast("Luxury Listing submitted for verification!", "success");
  };

  const resetForm = () => {
    setTitle('');
    setPrice('');
    setLocation('');
    setArea('');
    setDescription('');
    setUploadedImages([]);
    setSubmitted(false);
    setDraftId(self.crypto?.randomUUID ? self.crypto.randomUUID() : Math.random().toString(36).substring(2, 15));
  };

  if (submitted) {
    return (
      <div className="pt-28 pb-20 font-sans min-h-screen text-slate-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="glass-panel rounded-3xl p-8 border border-emerald-500/30 text-center shadow-2xl flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={36} className="animate-bounce" />
            </div>
            
            <div>
              <span className="text-[10px] font-mono text-emerald-400 font-extrabold uppercase tracking-widest block mb-2">SUBMISSION RECEIVED</span>
              <h2 className="font-serif text-2xl font-bold text-white">Listing Registered Successfully</h2>
              <p className="text-stone-300 text-xs mt-3 leading-relaxed font-light">
                Your property listing <span className="font-bold text-white">"{title}"</span> has been submitted successfully with Reference ID <span className="font-mono text-purple-305">LUXE-LV00{submittedId}</span>. Our team will verify the details shortly.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full mt-2">
              <Link to={`/properties/${submittedId}`} className="w-full btn-premium py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center text-white cursor-pointer">
                View Property Page
              </Link>
              <button 
                onClick={resetForm}
                className="w-full bg-[#0a0c1e] hover:bg-[#11132a] text-stone-300 hover:text-white py-3 rounded-xl text-xs font-semibold uppercase tracking-wider border border-purple-500/10 cursor-pointer"
              >
                List Another Property
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 font-sans min-h-screen text-stone-100">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Banner header */}
        <div className="mb-10 text-center sm:text-left">
          <span className="text-[10px] font-mono tracking-widest text-[#a855f7] uppercase font-bold block mb-1">
            SELL OR RENT YOUR HOME
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-white">
            List Your Property
          </h1>
          <p className="text-stone-300 text-xs mt-1">
            Fill out the form below to list your property for sale or rent on our platform.
          </p>
        </div>

        {/* Sell Form Panel */}
        <div className="glass-panel p-8 rounded-3xl shadow-2xl relative">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-xs text-stone-200">
            
            {/* Section A: Title and Reserve */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-purple-500/10">
              
              <div className="flex flex-col gap-1.5 focus:border-purple-500">
                <label className="text-[9px] font-mono font-black text-stone-400 uppercase tracking-widest">
                  PROPERTY TITLE
                </label>
                <div className="flex items-center gap-2 bg-[#05060f] border border-purple-500/15 p-3 rounded-xl">
                  <Building size={14} className="text-purple-400 shrink-0" />
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Modern Beachside Villa..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-transparent border-none text-xs focus:outline-none w-full placeholder-stone-605 text-white font-semibold focus:ring-0"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 focus:border-purple-500">
                <label className="text-[9px] font-mono font-black text-stone-400 uppercase tracking-widest">
                  PRICE ($)
                </label>
                <div className="flex items-center gap-2 bg-[#05060f] border border-purple-500/15 p-3 rounded-xl">
                  <DollarSign size={14} className="text-purple-400 shrink-0" />
                  <input 
                    type="number"
                    required
                    placeholder="e.g. 2950000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-transparent border-none text-xs focus:outline-none w-full placeholder-stone-605 text-white font-mono focus:ring-0"
                  />
                </div>
              </div>

            </div>

            {/* Section B: Classified selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-purple-500/10">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-widest">LISTING TYPE</label>
                <select 
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="bg-[#05060f] border border-purple-500/15 p-3 rounded-xl text-xs font-semibold focus:outline-none text-white cursor-pointer"
                >
                  <option value="sale" className="bg-[#0b0c16]">For Sale</option>
                  <option value="rent" className="bg-[#0b0c16]">For Rent</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono font-bold text-stone-444 uppercase tracking-widest">PROPERTY CATEGORY</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="bg-[#05060f] border border-purple-500/15 p-3 rounded-xl text-xs font-semibold focus:outline-none text-white cursor-pointer"
                >
                  <option value="villa" className="bg-[#0b0c16]">Villas</option>
                  <option value="apartment" className="bg-[#0b0c16]">Apartments</option>
                  <option value="home" className="bg-[#0b0c16]">Residential Houses</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono font-black text-stone-400 uppercase tracking-widest">
                  PROPERTY LOCATION
                </label>
                <div className="flex items-center gap-2 bg-[#05060f] border border-purple-500/15 p-2.5 rounded-xl">
                  <MapPin size={14} className="text-purple-400 shrink-0" />
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Beverly Hills, CA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-transparent border-none text-xs focus:outline-none w-full placeholder-stone-605 text-white font-semibold focus:ring-0"
                  />
                </div>
              </div>

            </div>

            {/* Section C: Dimensional layout numbers */}
            <div className="grid grid-cols-3 gap-4 pb-6 border-b border-purple-500/10 font-mono">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[8px] font-sans font-bold text-stone-400 uppercase">BEDROOMS</label>
                <select value={beds} onChange={(e) => setBeds(e.target.value)} className="bg-[#05060f] border border-purple-500/15 p-2.5 rounded-xl focus:outline-none text-white font-sans cursor-pointer">
                  {['1', '2', '3', '4', '5', '8', '12'].map(n => <option key={n} value={n} className="bg-[#0b0c16]">{n} Beds</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[8px] font-sans font-bold text-stone-404 uppercase">BATHROOMS</label>
                <select value={baths} onChange={(e) => setBaths(e.target.value)} className="bg-[#05060f] border border-purple-500/15 p-2.5 rounded-xl focus:outline-none text-white font-sans cursor-pointer">
                  {['1', '1.5', '2', '2.5', '3', '4', '6'].map(n => <option key={n} value={n} className="bg-[#0b0c16]">{n} Baths</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[8px] font-sans font-bold text-stone-400 uppercase">AREA (SQ FT)</label>
                <input 
                  type="number"
                  required
                  placeholder="e.g. 4500"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="bg-[#05060f] border border-purple-500/15 p-3 rounded-xl focus:outline-none text-white"
                />
              </div>

            </div>

            {/* Section C2: Visual assets uploader */}
            <div className="pb-6 border-b border-purple-500/10">
              <label className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest block mb-2 font-mono">
                Portraits & Images (Upload at least 5 images recommended)
              </label>
              
              <div 
                id="drop-zone-sell"
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
                onClick={() => document.getElementById('file-upload-input-sell').click()}
              >
                <input 
                  id="file-upload-input-sell"
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

            {/* Section D: Narrative */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono font-bold text-stone-404 uppercase tracking-widest block">
                PROPERTY DESCRIPTION
              </label>
              <textarea 
                rows={4}
                placeholder="Describe the property, amenities, nearby schools, views, and unique features..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-[#05060f] border border-purple-500/15 p-4 rounded-xl text-xs sm:text-sm focus:outline-none leading-relaxed text-slate-100 placeholder-stone-605"
              />
            </div>

            <div className="p-4 bg-purple-950/20 border border-purple-500/15 rounded-2xl flex items-start gap-3 mt-2 text-[10px] leading-relaxed text-stone-400 font-mono">
              <ShieldCheck size={16} className="text-purple-400 shrink-0 mt-0.5" />
              <span>By submitting this form, you verify that all details provided are accurate and truthful.</span>
            </div>

            <button 
              type="submit"
              className="btn-premium text-white font-bold py-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer uppercase tracking-widest mt-2"
            >
              <span>Submit Property Listing</span>
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
