import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { propertyService } from '../../services/propertyService';
import { Property, ListingType } from '../../types';
import { PropertyCard } from '../properties/PropertyCard';
import { ArrowRight, Sparkles } from 'lucide-react';

export const FeaturedListings: React.FC = () => {
  const { lang, navigateToListings } = useApp();
  const [properties, setProperties] = useState<Property[]>([]);
  const [activeTab, setActiveTab] = useState<ListingType | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const list = await propertyService.getProperties({
          listingType: activeTab === 'all' ? undefined : activeTab,
        });
        setProperties(list.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();

    const handleChange = () => fetchFeatured();
    window.addEventListener('baribazar_properties_change', handleChange);
    return () => window.removeEventListener('baribazar_properties_change', handleChange);
  }, [activeTab]);

  return (
    <section className="py-14 bg-white border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'নির্বাচিত প্রপার্টি' : 'Handpicked for You'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {lang === 'bn' ? 'আকর্ষণীয় প্রপার্টিসমূহ' : 'Featured Properties'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {lang === 'bn'
                ? 'আমাদের প্রপার্টি বিশেষজ্ঞদের দ্বারা যাচাইকৃত সেরা আবাসন ও বাণিজ্যিক ডিল'
                : 'Top verified residential and commercial opportunities across Bangladesh'}
            </p>
          </div>

          {/* Segmented Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium self-start md:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'all'
                  ? 'bg-white text-emerald-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'bn' ? 'সব' : 'All'}
            </button>
            <button
              onClick={() => setActiveTab('sale')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'sale'
                  ? 'bg-white text-emerald-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'bn' ? 'বিক্রয়' : 'Sale'}
            </button>
            <button
              onClick={() => setActiveTab('rent')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'rent'
                  ? 'bg-white text-emerald-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'bn' ? 'ভাড়া' : 'Rent'}
            </button>
            <button
              onClick={() => setActiveTab('land_sale')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'land_sale'
                  ? 'bg-white text-emerald-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'bn' ? 'জমি' : 'Land'}
            </button>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-slate-50 rounded-xl p-4 border border-slate-200 animate-pulse space-y-3"
              >
                <div className="aspect-[4/3] bg-slate-200 rounded-lg" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-slate-500 text-sm">
              {lang === 'bn'
                ? 'এই ক্যাটাগরিতে কোনো প্রপার্টি পাওয়া যায়নি'
                : 'No featured properties found in this category'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-10 text-center">
          <button
            onClick={() =>
              navigateToListings({
                listingType: activeTab === 'all' ? undefined : activeTab,
              })
            }
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-xs hover:shadow transition-all"
          >
            <span>{lang === 'bn' ? 'সকল লিস্টিং দেখুন' : 'Explore All Listings'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
