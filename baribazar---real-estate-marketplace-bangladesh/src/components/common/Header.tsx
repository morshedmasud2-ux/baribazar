import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { authService } from '../../services/authService';
import {
  Building2,
  Heart,
  PlusCircle,
  User as UserIcon,
  Menu,
  X,
  Globe,
  LogOut,
  ShieldCheck,
  LayoutDashboard,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    lang,
    toggleLang,
    currentUser,
    setCurrentUser,
    currentView,
    setCurrentView,
    favorites,
    setIsAuthModalOpen,
    setAuthModalTab,
    showToast,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setUserDropdownOpen(false);
    showToast(
      lang === 'bn' ? 'সফলভাবে লগআউট হয়েছেন' : 'Logged out successfully',
      'info'
    );
  };

  const navLinks = [
    { id: 'home', labelBn: 'হোম', labelEn: 'Home' },
    { id: 'properties', labelBn: 'সব প্রপার্টি', labelEn: 'All Properties' },
    { id: 'favorites', labelBn: 'পছন্দের তালিকা', labelEn: 'Saved' },
    { id: 'about', labelBn: 'আমাদের সম্পর্কে', labelEn: 'About Us' },
    { id: 'contact', labelBn: 'যোগাযোগ', labelEn: 'Contact' },
  ];

  const handlePostAdClick = () => {
    if (!currentUser) {
      setAuthModalTab('login');
      setIsAuthModalOpen(true);
      showToast(
        lang === 'bn'
          ? 'বিজ্ঞাপন দিতে অনুগ্রহ করে প্রথমে সাইন ইন করুন'
          : 'Please sign in to post a property listing',
        'info'
      );
    } else {
      setCurrentView('add_property');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 text-left focus-visible:outline-emerald-600 rounded-md"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm shadow-emerald-700/20">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-emerald-900 block leading-none">
                  BariBazar
                </span>
                <span className="text-[11px] font-medium text-emerald-700 block mt-0.5">
                  {lang === 'bn' ? 'বাড়ি বাজার' : 'Real Estate BD'}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[15px] font-medium text-slate-600">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setCurrentView(link.id);
                  }}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors hover:text-emerald-800 ${
                    isActive
                      ? 'text-emerald-800 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600'
                      : ''
                  }`}
                >
                  {lang === 'bn' ? link.labelBn : link.labelEn}
                  {link.id === 'favorites' && favorites.length > 0 && (
                    <span className="ml-1.5 text-xs bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full">
                      {favorites.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-800 bg-slate-100 hover:bg-emerald-50 rounded-lg transition-colors"
              title={lang === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* User Account / Auth */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 pr-3 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[110px] truncate">
                    {currentUser.name}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-sm">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-900 truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                      {currentUser.role === 'admin' && (
                        <span className="inline-block mt-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                          {lang === 'bn' ? 'অ্যাডমিন অ্যাকাউন্ট' : 'Administrator'}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setCurrentView('dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2.5"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                      <span>{lang === 'bn' ? 'ইউজার ড্যাশবোর্ড' : 'User Dashboard'}</span>
                    </button>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setCurrentView('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2.5"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>{lang === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setCurrentView('favorites');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2.5"
                    >
                      <Heart className="w-4 h-4 text-rose-600" />
                      <span>{lang === 'bn' ? 'পছন্দের তালিকা' : 'Saved Properties'}</span>
                    </button>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2.5"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{lang === 'bn' ? 'লগআউট' : 'Sign Out'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthModalTab('login');
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-emerald-800 transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                <span>{lang === 'bn' ? 'লগইন' : 'Sign In'}</span>
              </button>
            )}

            {/* Post Ad CTA */}
            <button
              onClick={handlePostAdClick}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{lang === 'bn' ? 'বিজ্ঞাপন দিন' : 'Post Ad'}</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 focus-visible:outline-emerald-600 rounded-md"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentView(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                  currentView === link.id
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {lang === 'bn' ? link.labelBn : link.labelEn}
                {link.id === 'favorites' && favorites.length > 0 && (
                  <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full">
                    {favorites.length}
                  </span>
                )}
              </button>
            ))}

            {currentUser && (
              <>
                <button
                  onClick={() => {
                    setCurrentView('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {lang === 'bn' ? 'ইউজার ড্যাশবোর্ড' : 'User Dashboard'}
                </button>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => {
                      setCurrentView('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-amber-700 hover:bg-amber-50"
                  >
                    {lang === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}
                  </button>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
