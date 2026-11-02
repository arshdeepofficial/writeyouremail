"use client";

import { useState } from "react";
import { Sparkles, User as UserIcon, LogOut, ChevronDown } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface NavbarProps {
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export default function Navbar({ user, onOpenAuth, onLogout }: NavbarProps) {
  const [productsOpen, setProductsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left: Brand + Nav Items */}
        <div className="flex items-center gap-8">
          <a href="#" className="flex items-center gap-2 font-bold text-lg tracking-tight text-white">
            <span className="w-7 h-7 bg-white text-black rounded-lg flex items-center justify-center text-xs font-black">
              W
            </span>
            WriteYourEmail
          </a>

          {/* Dropdown Navigation Menu */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-400">
            <div className="relative">
              <button
                onClick={() => setProductsOpen(!productsOpen)}
                className="hover:text-white flex items-center gap-1 transition"
              >
                Templates <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {productsOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-neutral-900 border border-neutral-800 rounded-xl p-2 shadow-2xl z-50">
                  <a href="#" className="block px-3 py-2 text-xs rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-white">
                    💼 Cold Outreach
                  </a>
                  <a href="#" className="block px-3 py-2 text-xs rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-white">
                    📋 Job Applications
                  </a>
                  <a href="#" className="block px-3 py-2 text-xs rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-white">
                    📅 Meeting Requests
                  </a>
                </div>
              )}
            </div>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#" className="hover:text-white transition">Docs</a>
          </nav>
        </div>

        {/* Right: Auth Action Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full flex items-center gap-2">
                <UserIcon className="w-3.5 h-3.5 text-neutral-400" />
                {user.email}
              </span>
              <button
                onClick={onLogout}
                className="text-xs text-neutral-400 hover:text-red-400 transition p-1.5"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={onOpenAuth}
                className="text-xs font-medium text-neutral-300 hover:text-white px-3 py-1.5 transition"
              >
                Log In
              </button>
              <button
                onClick={onOpenAuth}
                className="text-xs font-semibold bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded-full transition shadow-sm"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}