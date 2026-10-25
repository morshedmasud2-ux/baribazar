import React from 'react';
import { useApp } from '../../context/AppContext';
import { propertyService } from '../../services/propertyService';
import { Building2, Phone, Mail, MapPin, RefreshCw, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, setCurrentView, navigateToListings, showToast } = useApp();

  const handleResetDemo = () => {
    propertyService.resetToDemoData();
    showToast(
      lang === 'bn'
        ? 'ডেমো প্রপার্টি ডেটা সফলভাবে রিস্টোর হয়েছে'
        : 'Sample property data restored',
      'success'
    );
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800 text-sm">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white block leading-none">
                  BariBazar
                </span>
                <span className="text-xs text-emerald-400 block mt-0.5">
                  {lang === 'bn' ? 'বাড়ি বাজার' : 'Bangladesh Real Estate'}
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {lang === 'bn'
                ? 'বাংলাদেশের সবচেয়ে নির্ভরযোগ্য রিয়েল এস্টেট মার্কেটপ্লেস। ঢাকা, চট্টগ্রাম, সিলেট সহ দেশজুড়ে ফ্ল্যাট, জমি, স্বাধীন বাড়ি ও বাণিজ্যিক প্রপার্টি ক্রয়, বিক্রয় ও ভাড়ার সহজ সমাধান।'
                : "Bangladesh's premier trusted property marketplace. Buy, rent, and sell apartments, residential land plots, independent houses, and commercial spaces across all divisions."}
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'bn' ? '১০০% ভেরিফাইড বিজ্ঞাপনের নিশ্চয়তা' : '100% Verified Property Listings'}</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm tracking-wide">
              {lang === 'bn' ? 'প্রপার্টি ক্যাটাগরি' : 'Property Types'}
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <button
                  onClick={() => navigateToListings({ category: 'flat' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {lang === 'bn' ? 'ফ্ল্যাট ও অ্যাপার্টমেন্ট' : 'Flats & Apartments'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToListings({ category: 'land' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {lang === 'bn' ? 'জমি ও প্লট' : 'Land & Plots'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToListings({ category: 'house' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {lang === 'bn' ? 'বাড়ি ও ডুপ্লেক্স' : 'Houses & Duplexes'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToListings({ category: 'commercial' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {lang === 'bn' ? 'দোকান ও অফিস স্পেস' : 'Commercial & Office'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Cities */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm tracking-wide">
              {lang === 'bn' ? 'জনপ্রিয় এলাকা' : 'Top Locations'}
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <button
                  onClick={() => navigateToListings({ division: 'Dhaka', area: 'Gulshan' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {lang === 'bn' ? 'গুলশান, ঢাকা' : 'Gulshan, Dhaka'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToListings({ division: 'Dhaka', area: 'Bashundhara R/A' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {lang === 'bn' ? 'বসুন্ধরা আ/এ, ঢাকা' : 'Bashundhara R/A'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToListings({ division: 'Dhaka', area: 'Purbachal New Town' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {lang === 'bn' ? 'পূর্বাচল নতুন শহর' : 'Purbachal New Town'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToListings({ division: 'Chittagong' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {lang === 'bn' ? 'চট্টগ্রাম মহানগর' : 'Chittagong City'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToListings({ division: 'Sylhet' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {lang === 'bn' ? 'সিলেট মহানগর' : 'Sylhet City'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm tracking-wide">
              {lang === 'bn' ? 'যোগাযোগ ও সাপোর্ট' : 'Contact & Office'}
            </h4>
            <div className="space-y-3 text-slate-400 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {lang === 'bn'
                    ? 'লেভেল ৭, রোড ১১, গুলশান-২, ঢাকা-১২১২'
                    : 'Level 7, Road 11, Gulshan-2, Dhaka-1212'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+8809612002274" className="hover:text-emerald-400 transition-colors">
                  +880 9612-BARI (2274)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:support@baribazar.com" className="hover:text-emerald-400 transition-colors">
                  support@baribazar.com
                </a>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleResetDemo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
                title="Reset sample property database"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'bn' ? 'ডেমো ডেটা রিস্টোর' : 'Restore Demo Data'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 BariBazar. All rights reserved. Made for Bangladesh.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentView('privacy')}
              className="hover:text-emerald-400 transition-colors"
            >
              {lang === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
            </button>
            <button
              onClick={() => setCurrentView('terms')}
              className="hover:text-emerald-400 transition-colors"
            >
              {lang === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms of Service'}
            </button>
            <button
              onClick={() => setCurrentView('contact')}
              className="hover:text-emerald-400 transition-colors"
            >
              {lang === 'bn' ? 'সাহায্য কেন্দ্র' : 'Help & Contact'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
