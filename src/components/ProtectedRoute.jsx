import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    
    async function getInitialSession() {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted) {
          setSession(data.session);
        }
      } catch (err) {
        console.error("Error fetching session:", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (mounted) {
        setSession(currentSession);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020205] flex items-center justify-center font-sans text-stone-100">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-purple-500/10 border-t-purple-400 rounded-full animate-spin" />
          <p className="font-mono text-stone-400 uppercase text-[9px] tracking-widest mt-2 animate-pulse">Connecting secure lock...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
