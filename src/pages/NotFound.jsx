import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen py-24 flex flex-col items-center justify-center p-8 bg-stone-50 dark:bg-zinc-950/80 font-sans">
      <div className="text-center flex flex-col items-center max-w-sm">
        
        {/* Visual indicators */}
        <div className="w-16 h-16 rounded-2.5xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6 shadow-sm select-none animate-spin">
          <Compass size={28} />
        </div>

        <span className="text-[10px] font-mono font-bold text-stone-400 block uppercase tracking-widest mb-2">VECTOR NOT ACQUIRED</span>
        <h1 className="font-serif text-4xl font-bold mb-3 tracking-tight dark:text-stone-100">404 Exception</h1>
        <p className="text-stone-400 dark:text-stone-500 text-xs leading-relaxed max-w-xs font-sans">
          This secure location index does not exist within DreamStay Homes records. It may have relocated or underwent private archival procedures.
        </p>

        <Link 
          to="/"
          className="mt-8 bg-zinc-950 hover:bg-stone-850 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-zinc-950 font-bold py-3.5 px-8 rounded-xl text-xs flex items-center gap-1.5 shadow transition-transform"
        >
          <ArrowLeft size={13} />
          <span>Return to Capital</span>
        </Link>
      </div>
    </div>
  );
}
