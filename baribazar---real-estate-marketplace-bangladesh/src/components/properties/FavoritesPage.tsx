import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { propertyService } from '../../services/propertyService';
import { Property } from '../../types';
import { PropertyCard } from './PropertyCard';
import { Heart, ArrowLeft, Building } from 'lucide-react';
import { formatNumberWithLocale } from '../../utils/formatters';

export const FavoritesPage: React.FC = () => {
  const { lang, favorites, setCurrentView } = useApp();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavs = async () => {
      setLoading(true);
      try {
        const all = await propertyService.getProperties();
        const favs = all.filter((p) => favorites.includes(p.id));
        setProperties(favs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavs();

    const handleChange = () => fetchFavs();
    window.addEventListener('baribazar_favorites_change', handleChange);
    return () => window.removeEventListener('baribazar_favorites_change', handleChange);
  }, [favorites]);

  return (
    <div className="bg-[#F8FAF9] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>{lang === 'bn' ? 'সংরক্ষিত প্রপার্টিসমূহ' : 'Saved Properties'}</span>
                <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {lang === 'bn'
                  ? `মোট ${formatNumberWithLocale(properties.length, lang)} টি প্রপার্টি সংরক্ষিত রয়েছে`
                  : `You have ${properties.length} bookmarked properties`}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('properties')}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg self-start sm:self-auto shadow-2xs"
          >
            {lang === 'bn' ? 'আরও প্রপার্টি দেখুন' : 'Explore More'}
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 border border-slate-200 animate-pulse space-y-3"
              >
                <div className="aspect-[4/3] bg-slate-200 rounded-lg" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-5 bg-slate-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-2xs">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {lang === 'bn' ? 'পছন্দের তালিকায় কোনো প্রপার্টি নেই' : 'No Saved Properties Yet'}
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              {lang === 'bn'
                ? 'ব্রাউজ করার সময় যে প্রপার্টিটি আপনার ভালো লাগবে, তার ডান পাশের হার্ট আইকনে ক্লিক করে সহজেই সেভ করে রাখুন।'
                : 'Tap the heart icon on any listing card to save it here for quick access later.'}
            </p>
            <button
              onClick={() => setCurrentView('properties')}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              {lang === 'bn' ? 'প্রপার্টি খুঁজুন' : 'Browse All Listings'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
