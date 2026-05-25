import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProperties, initialAgents, initialTestimonials } from '../data.js';
import { supabase } from '../supabaseClient.js';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Database State
  const [properties, setProperties] = useState([]);
  const [agents, setAgents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  
  // Auth State
  const [currentUser, setCurrentUser] = useState(null);

  // Theme & Dark mode state (Default to gorgeous dark/neutral light theme with dark mode toggling)
  const [darkMode, setDarkMode] = useState(true);

  // Toast notification state
  const [toasts, setToasts] = useState([]);

  // Search/Filter helper states
  const [searchQuery, setSearchQuery] = useState({
    purpose: 'buy', // buy, rent
    type: 'all', // all, apartment, villa, home, room, commercial
    location: '',
    minPrice: '',
    maxPrice: '',
    beds: 'all'
  });

  const fetchProperties = async () => {
    try {
      const { data: dbProps, error: propError } = await supabase
        .from('properties')
        .select('*')
        .order('id', { ascending: false });

      if (propError) {
        console.error("Error loading properties:", propError);
        setProperties([]);
        return;
      }

      if (dbProps && dbProps.length > 0) {
        // Collect all custom storage paths that require signed urls (do not start with http or data:)
        const pathsToSign = new Set();
        dbProps.forEach(p => {
          if (p.image && !p.image.startsWith('http') && !p.image.startsWith('data:')) {
            pathsToSign.add(p.image);
          }
          if (Array.isArray(p.images)) {
            p.images.forEach(img => {
              if (img && typeof img === 'string' && !img.startsWith('http') && !img.startsWith('data:')) {
                pathsToSign.add(img);
              }
            });
          }
        });

        const signedUrlsMap = {};
        if (pathsToSign.size > 0) {
          try {
            const { data: signedData, error: signedError } = await supabase.storage
              .from('properties-img')
              .createSignedUrls(Array.from(pathsToSign), 86400); // 24 hours
            
            if (!signedError && signedData) {
              signedData.forEach(item => {
                if (item.signedUrl) {
                  signedUrlsMap[item.path] = item.signedUrl;
                }
              });
            }
          } catch (e) {
            console.error("Error signing URLs:", e);
          }
        }

        const mapped = dbProps.map(p => {
          const viewImage = (p.image && signedUrlsMap[p.image]) || p.image;
          const viewImages = Array.isArray(p.images)
            ? p.images.map(img => (typeof img === 'string' && signedUrlsMap[img]) || img)
            : [];

          return {
            ...p,
            yearBuilt: p.year_built,
            swimmingPool: p.swimming_pool,
            storage_image: p.image,         // Keep exact DB file path
            storage_images: p.images,       // Keep exact DB file paths
            image: viewImage,                // Client sees signed URL
            images: viewImages               // Client sees signed URLs
          };
        });
        setProperties(mapped);
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.error("Error loading properties:", err);
      setProperties([]);
    }
  };

  // Load initial static data or localStorage & setup auth state sync
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('luxe_darkmode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
    setAgents(initialAgents);

    // Initial properties fetch fallback
    const fetchPropertiesAndSync = async (session) => {
      // 1. Fetch properties from database
      await fetchProperties();

      // If session exists, fetch profile and favorites
      if (session) {
        const email = session.user.email;
        const uid = session.user.id;

        // Fetch profile
        try {
          const { data: profileData, error: profileErr } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', uid)
            .maybeSingle();

          if (profileData && !profileErr) {
            const normalized = {
              ...profileData,
              listingsCount: profileData.listings_count,
              savedCount: profileData.saved_count
            };
            setCurrentUser(normalized);
          } else {
            // Profile doesn't exist yet, insert default
            const defaultProfile = {
              id: uid,
              name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
              email: email,
              role: "Buyer",
              avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
              phone: "+1 (555) 789-0123",
              bio: "Active seeker of premium lifestyle venues.",
              listings_count: 0,
              saved_count: 0
            };
            const { error: insertErr } = await supabase.from('profiles').insert(defaultProfile);
            if (!insertErr) {
              const normalized = {
                ...defaultProfile,
                listingsCount: 0,
                savedCount: 0
              };
              setCurrentUser(normalized);
            }
          }
        } catch (profileCatchError) {
          console.error("Error syncing profile:", profileCatchError);
        }

        // Fetch favorites
        try {
          const { data: favsData, error: favsErr } = await supabase
            .from('favorites')
            .select('property_id')
            .eq('user_id', uid);

          if (favsData && !favsErr) {
            setFavorites(favsData.map(f => f.property_id));
          } else {
            setFavorites([]);
          }
        } catch (favsCatchError) {
          console.error("Error fetching favorites:", favsCatchError);
          setFavorites([]);
        }

      } else {
        setCurrentUser(null);
        // Load local guest favorites
        const savedFavorites = localStorage.getItem('luxe_favorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        } else {
          setFavorites([1, 3]);
        }
      }
    };

    // Listen for auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchPropertiesAndSync(session);
    });

    // Check current session to run on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchPropertiesAndSync(session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const showToast = (message, type = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Auth Handlers (stub callbacks for compatibility)
  const login = async (email, password, role) => {
    try {
      const sessionUser = (await supabase.auth.getSession()).data.session?.user;
      if (sessionUser) {
        // Fetch profile to see if it exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sessionUser.id)
          .maybeSingle();

        const cachedUser = localStorage.getItem('luxe_user');
        const parsedCache = cachedUser ? JSON.parse(cachedUser) : null;

        if (existingProfile) {
          // Update the role if user passed it
          await supabase
            .from('profiles')
            .update({ role: role || existingProfile.role || 'Buyer' })
            .eq('id', sessionUser.id);
        } else {
          // Insert a new profile record
          const defaultProfile = {
            id: sessionUser.id,
            name: parsedCache?.name || email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
            email: email,
            role: role || parsedCache?.role || "Buyer",
            avatar: parsedCache?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
            phone: parsedCache?.phone || "+1 (555) 789-0123",
            bio: parsedCache?.bio || "Active seeker of premium lifestyle venues.",
            listings_count: 0,
            saved_count: 0
          };
          await supabase.from('profiles').insert(defaultProfile);
        }

        // Fetch fresh profile state
        const { data: profileVal } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sessionUser.id)
          .maybeSingle();

        if (profileVal) {
          setCurrentUser({
            ...profileVal,
            listingsCount: profileVal.listings_count,
            savedCount: profileVal.saved_count
          });
        }
      }
    } catch (e) {
      console.error("Login update error:", e);
    }
    return true;
  };

  const signup = async (name, email, password, role) => {
    return true;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Supabase signOut error:", e);
    }
    setCurrentUser(null);
    localStorage.removeItem('luxe_user');
    showToast("Signed out successfully.", "info");
  };

  const updateProfile = async (updatedFields) => {
    if (!currentUser) return;
    const sessionUser = (await supabase.auth.getSession()).data.session?.user;
    if (!sessionUser) return;

    // Map updated fields to database snake_case
    const dbProfile = {};
    if (updatedFields.name !== undefined) dbProfile.name = updatedFields.name;
    if (updatedFields.role !== undefined) dbProfile.role = updatedFields.role;
    if (updatedFields.avatar !== undefined) dbProfile.avatar = updatedFields.avatar;
    if (updatedFields.phone !== undefined) dbProfile.phone = updatedFields.phone;
    if (updatedFields.bio !== undefined) dbProfile.bio = updatedFields.bio;
    if (updatedFields.listingsCount !== undefined) dbProfile.listings_count = updatedFields.listingsCount;
    if (updatedFields.savedCount !== undefined) dbProfile.saved_count = updatedFields.savedCount;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(dbProfile)
        .eq('id', sessionUser.id);
      if (error) throw error;

      const newUser = { ...currentUser, ...updatedFields };
      setCurrentUser(newUser);
      showToast("Profile settings updated successfully.", "success");
    } catch (e) {
      console.error("Error updating profile:", e);
      showToast("Failed to update profile settings.", "error");
    }
  };

  // Favorites System
  const toggleFavorite = async (id) => {
    if (!currentUser) {
      // Allow local guest favoriting
      let newFavs;
      if (favorites.includes(id)) {
        newFavs = favorites.filter(favId => favId !== id);
        showToast("Removed from saved list.", "info");
      } else {
        newFavs = [...favorites, id];
        showToast("Property saved to favorites!", "success");
      }
      setFavorites(newFavs);
      localStorage.setItem('luxe_favorites', JSON.stringify(newFavs));
      return;
    }

    const sessionUser = (await supabase.auth.getSession()).data.session?.user;
    if (!sessionUser) return;

    let newFavs;
    if (favorites.includes(id)) {
      newFavs = favorites.filter(favId => favId !== id);
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', sessionUser.id)
        .eq('property_id', id);
      if (error) {
        showToast("Error updating favorites.", "error");
        return;
      }
      showToast("Removed from saved list.", "info");
    } else {
      newFavs = [...favorites, id];
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: sessionUser.id, property_id: id });
      if (error) {
        showToast("Error updating favorites.", "error");
        return;
      }
      showToast("Property saved to favorites!", "success");
    }
    setFavorites(newFavs);
  };

  // Storage Helpers with multi-path try-chain and fail-safe Client Base64 Fallback
  const uploadFileToStorage = async (file, featureName = 'properties', itemId = 'temp') => {
    const session = await supabase.auth.getSession();
    const sessionUser = session.data.session?.user;
    if (!sessionUser) {
      throw new Error("You must be authenticated to upload files.");
    }
    const userId = sessionUser.id;
    const fileExt = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const fileUuid = self.crypto?.randomUUID ? self.crypto.randomUUID() : Math.random().toString(36).substring(2, 15);

    // List of candidate paths to attempt in order
    const candidatePaths = [
      `${userId}/${featureName}/${itemId}/${fileUuid}.${fileExt}`, // 1. Deep item path
      `${userId}/${fileUuid}.${fileExt}`,                         // 2. Shallow user path
      `public/${fileUuid}.${fileExt}`                             // 3. Flat public path
    ];

    let lastError = null;

    for (const filePath of candidatePaths) {
      try {
        const { error } = await supabase.storage
          .from('properties-img')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type || 'image/jpeg'
          });

        if (!error) {
          // Successfully uploaded! Get direct Public URL (works perfectly for public buckets)
          try {
            const { data: pubData } = supabase.storage
              .from('properties-img')
              .getPublicUrl(filePath);

            if (pubData && pubData.publicUrl) {
              console.log(`Successfully uploaded & resolved public URL: ${pubData.publicUrl}`);
              return {
                path: filePath,
                url: pubData.publicUrl
              };
            }
          } catch (pubErr) {
            console.warn("Public URL retrieval failed, attempting signed URL fallback:", pubErr);
          }

          // Get signed URL to show immediately (fallback for private buckets)
          try {
            const { data: signData, error: signError } = await supabase.storage
              .from('properties-img')
              .createSignedUrl(filePath, 315360000); // 10 years expiration for long life

            if (!signError && signData) {
              console.log(`Successfully uploaded & signed asset: ${filePath}`);
              return {
                path: filePath,
                url: signData.signedUrl
              };
            }
          } catch (signErr) {
            console.warn("Signed URL creation failed, returning raw path:", signErr);
            return {
              path: filePath,
              url: filePath
            };
          }
        } else {
          lastError = error;
          console.warn(`Upload attempt failed for ${filePath}:`, error.message);
        }
      } catch (err) {
        lastError = err;
        console.warn(`Exception during upload for ${filePath}:`, err);
      }
    }

    // If we reached here, all storage bucket uploads failed (e.g. strict RLS policies, bucket configs).
    // Let's activate our beautiful, self-healing client-side Base64 fallback!
    console.info("All Supabase Storage uploads failed or were blocked. Activating Base64 fallback...");
    try {
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });

      return {
        path: base64Data,
        url: base64Data
      };
    } catch (fallbackErr) {
      console.error("Base64 fallback processing failed:", fallbackErr);
      throw lastError || fallbackErr;
    }
  };

  const deleteStorageFiles = async (pImage, pImages) => {
    const pathsToDelete = [];
    if (pImage && !pImage.startsWith('http') && !pImage.startsWith('data:')) {
      pathsToDelete.push(pImage);
    }
    if (Array.isArray(pImages)) {
      pImages.forEach(img => {
        if (img && typeof img === 'string' && !img.startsWith('http') && !img.startsWith('data:')) {
          if (!pathsToDelete.includes(img)) {
            pathsToDelete.push(img);
          }
        }
      });
    }

    if (pathsToDelete.length > 0) {
      try {
        const { error: delError } = await supabase.storage
          .from('properties-img')
          .remove(pathsToDelete);
        if (delError) {
          console.error("Error removing files from Supabase Storage:", delError);
        } else {
          console.log("Successfully deleted assets from storage:", pathsToDelete);
        }
      } catch (err) {
        console.error("Exception during storage deletion:", err);
      }
    }
  };

  // Properties Listings Handlers
  const addProperty = async (propertyData) => {
    const sessionUser = (await supabase.auth.getSession()).data.session?.user;
    if (!sessionUser) {
      showToast("Please authenticate to upload assets.", "error");
      return null;
    }

    // Extract URLs if properties were passed as objects (prefer full URLs as requested)
    const mainImagePath = (propertyData.image && typeof propertyData.image === 'object') 
      ? (propertyData.image.url || propertyData.image.path) 
      : propertyData.image;
    const additionalImagePaths = Array.isArray(propertyData.images)
      ? propertyData.images.map(img => (img && typeof img === 'object') ? (img.url || img.path) : img)
      : [];

    const newProperty = {
      title: propertyData.title,
      price: propertyData.price,
      purpose: propertyData.purpose,
      type: propertyData.type,
      location: propertyData.location,
      address: propertyData.address,
      beds: propertyData.beds,
      baths: propertyData.baths,
      area: propertyData.area,
      image: mainImagePath,
      images: additionalImagePaths,
      featured: propertyData.featured || false,
      furnished: propertyData.furnished || false,
      parking: propertyData.parking || false,
      swimming_pool: propertyData.swimmingPool || false,
      garden: propertyData.garden || false,
      description: propertyData.description,
      amenities: propertyData.amenities,
      year_built: propertyData.yearBuilt,
      status: propertyData.status || 'available',
      agent: {
        name: currentUser?.name || 'Vanguard Agent',
        avatar: currentUser?.avatar || '',
        phone: currentUser?.phone || "+1 (555) 123-4567",
        email: currentUser?.email || ''
      }
    };

    try {
      const { data, error } = await supabase
        .from('properties')
        .insert(newProperty)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // Sign the newly added property's image URLs so we can load it instantly
        let viewImage = data.image;
        let viewImages = Array.isArray(data.images) ? data.images : [];

        try {
          const pathsToSign = [];
          if (data.image && !data.image.startsWith('http') && !data.image.startsWith('data:')) {
            pathsToSign.push(data.image);
          }
          if (Array.isArray(data.images)) {
            data.images.forEach(img => {
              if (img && typeof img === 'string' && !img.startsWith('http') && !img.startsWith('data:')) {
                pathsToSign.push(img);
              }
            });
          }

          if (pathsToSign.length > 0) {
            const { data: signedData, error: signedError } = await supabase.storage
              .from('properties-img')
              .createSignedUrls(pathsToSign, 86400);

            if (!signedError && signedData) {
              const signedMap = {};
              signedData.forEach(item => {
                if (item.signedUrl) signedMap[item.path] = item.signedUrl;
              });

              viewImage = signedMap[data.image] || data.image;
              viewImages = data.images.map(img => signedMap[img] || img);
            }
          }
        } catch (signErr) {
          console.error("Error signing newly added listing image:", signErr);
        }

        const mapped = {
          ...data,
          yearBuilt: data.year_built,
          swimmingPool: data.swimming_pool,
          storage_image: data.image,
          storage_images: data.images,
          image: viewImage,
          images: viewImages
        };
        setProperties(prev => [mapped, ...prev]);
        showToast("Listing published successfully to Marketplace!", "success");
        return mapped.id;
      }
    } catch (e) {
      console.error("Error listing property:", e);
      showToast("Failed to upload property.", "error");
    }
    return null;
  };

  const deleteProperty = async (id) => {
    try {
      const targetProperty = properties.find(p => p.id === id);

      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      if (error) throw error;

      if (targetProperty) {
        await deleteStorageFiles(targetProperty.storage_image, targetProperty.storage_images);
      }

      setProperties(prev => prev.filter(p => p.id !== id));
      showToast("Listing deleted from your dashboard.", "info");
    } catch (e) {
      console.error("Error deleting property:", e);
      showToast("Failed to delete property listing.", "error");
    }
  };

  const updateProperty = async (id, updatedDetails) => {
    const dbFormat = {};
    if (updatedDetails.title !== undefined) dbFormat.title = updatedDetails.title;
    if (updatedDetails.price !== undefined) dbFormat.price = updatedDetails.price;
    if (updatedDetails.purpose !== undefined) dbFormat.purpose = updatedDetails.purpose;
    if (updatedDetails.type !== undefined) dbFormat.type = updatedDetails.type;
    if (updatedDetails.location !== undefined) dbFormat.location = updatedDetails.location;
    if (updatedDetails.address !== undefined) dbFormat.address = updatedDetails.address;
    if (updatedDetails.beds !== undefined) dbFormat.beds = updatedDetails.beds;
    if (updatedDetails.baths !== undefined) dbFormat.baths = updatedDetails.baths;
    if (updatedDetails.area !== undefined) dbFormat.area = updatedDetails.area;
    if (updatedDetails.image !== undefined) dbFormat.image = updatedDetails.image;
    if (updatedDetails.images !== undefined) dbFormat.images = updatedDetails.images;
    if (updatedDetails.featured !== undefined) dbFormat.featured = updatedDetails.featured;
    if (updatedDetails.furnished !== undefined) dbFormat.furnished = updatedDetails.furnished;
    if (updatedDetails.parking !== undefined) dbFormat.parking = updatedDetails.parking;
    if (updatedDetails.swimmingPool !== undefined) dbFormat.swimming_pool = updatedDetails.swimmingPool;
    if (updatedDetails.garden !== undefined) dbFormat.garden = updatedDetails.garden;
    if (updatedDetails.description !== undefined) dbFormat.description = updatedDetails.description;
    if (updatedDetails.amenities !== undefined) dbFormat.amenities = updatedDetails.amenities;
    if (updatedDetails.yearBuilt !== undefined) dbFormat.year_built = updatedDetails.yearBuilt;
    if (updatedDetails.status !== undefined) dbFormat.status = updatedDetails.status;

    try {
      const { error } = await supabase
        .from('properties')
        .update(dbFormat)
        .eq('id', id);
      if (error) throw error;

      setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updatedDetails } : p));
      showToast("Listing updated successfully.", "success");
    } catch (e) {
      console.error("Error updating property:", e);
      showToast("Failed to update property details.", "error");
    }
  };

  const toggleDarkMode = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    localStorage.setItem('luxe_darkmode', JSON.stringify(nextMode));
  };

  return (
    <AppContext.Provider value={{
      properties,
      agents,
      favorites,
      currentUser,
      darkMode,
      toasts,
      searchQuery,
      setSearchQuery,
      login,
      signup,
      logout,
      updateProfile,
      toggleFavorite,
      addProperty,
      deleteProperty,
      updateProperty,
      toggleDarkMode,
      showToast,
      fetchProperties,
      uploadFileToStorage
    }}>
      <div className={`${darkMode ? 'dark bg-black text-stone-100' : 'light bg-slate-50 text-slate-800'} min-h-screen transition-all duration-300 bg-gradient-to-b ${darkMode ? 'from-black via-[#020617] to-[#040714]' : 'from-slate-50 via-slate-100 to-white'}`}>
        {children}

        {/* Global Toast Notifications container */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
          {toasts.map(t => (
            <div
              key={t.id}
              className="p-4 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.15)] border flex items-center justify-between text-sm pointer-events-auto transition-all duration-300 transform translate-y-0 opacity-100 bg-luxury-card/90 backdrop-blur-md border-luxury-purple/30"
            >
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${t.type === 'success' ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' : t.type === 'error' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-blue-400 shadow-[0_0_8px_#60a5fa]'}`} />
                <p className="font-sans font-medium text-stone-200">{t.message}</p>
              </div>
              <button 
                onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
                className="ml-4 text-xs text-luxury-purple-light hover:text-white font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
