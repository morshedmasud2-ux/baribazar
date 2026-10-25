import React from 'react';
import { useApp } from '../../context/AppContext';
import { PropertyCategory } from '../../types';
import { Building, Trees, Home, Store, ArrowRight } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const { lang, navigateToListings } = useApp();

  const categories = [
    {
      id: 'flat' as PropertyCategory,
      titleBn: 'ফ্ল্যাট ও অ্যাপার্টমেন্ট',
      titleEn: 'Flats & Apartments',
      countBn: '২,৮৫০+ টি প্রপার্টি',
      countEn: '2,850+ Properties',
      descBn: 'ঢাকা, চট্টগ্রাম ও অন্যান্য প্রধান শহরের রেডি এবং নির্মাণাধীন আধুনিক ফ্ল্যাট।',
      descEn: 'Ready and under-construction modern apartments in top urban locations.',
      icon: Building,
      badgeBn: 'সর্বাধিক জনপ্রিয়',
      badgeEn: 'Most Popular',
    },
    {
      id: 'land' as PropertyCategory,
      titleBn: 'জমি ও আবাসিক প্লট',
      titleEn: 'Land & Residential Plots',
      countBn: '১,৪২০+ টি প্লট',
      countEn: '1,420+ Plots',
      descBn: 'পূর্বাচল, বসুন্ধরা, কেরানীগঞ্জ সহ বিভিন্ন এলাকায় নিষ্কণ্টক রাজউক ও ব্যক্তিগত প্লট।',
      descEn: 'Freehold RAJUK approved & private plots in Purbachal, Bashundhara, and more.',
      icon: Trees,
      badgeBn: 'উচ্চ বিনিয়োগ মূল্য',
      badgeEn: 'High Investment Value',
    },
    {
      id: 'house' as PropertyCategory,
      titleBn: 'স্বাধীন বাড়ি ও ডুপ্লেক্স',
      titleEn: 'Independent Houses & Duplexes',
      countBn: '৬২০+ টি বাড়ি',
      countEn: '620+ Houses',
      descBn: 'ব্যক্তিগত বাগান ও লনসহ আধুনিক আর্কিটেকচারাল ডুপ্লেক্স এবং বিলাসবহুল বাংলো।',
      descEn: 'Luxurious duplex villas, standalone multi-story homes, and garden bungalows.',
      icon: Home,
      badgeBn: 'পারিবারিক নির্ভরতা',
      badgeEn: 'Family Living',
    },
    {
      id: 'commercial' as PropertyCategory,
      titleBn: 'দোকান ও বাণিজ্যিক সম্পত্তি',
      titleEn: 'Shops & Commercial Spaces',
      countBn: '৮৯০+ টি স্পেস',
      countEn: '890+ Spaces',
      descBn: 'বনানী, মতিঝিল ও আগ্রাবাদের মতো প্রাইম বিজনেস জোনে শোরুম এবং অফিস স্পেস।',
      descEn: 'Prime road-front showrooms, corporate office floors, and retail shop spaces.',
      icon: Store,
      badgeBn: 'উচ্চ ভাড়ার রিটার্ন',
      badgeEn: 'High Rental Yield',
    },
  ];

  return (
    <section className="py-14 bg-[#F8FAF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {lang === 'bn' ? 'প্রপার্টি ক্যাটাগরি ব্রাউজ করুন' : 'Explore Property Categories'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {lang === 'bn'
                ? 'আপনার প্রয়োজন অনুযায়ী জমি, ফ্ল্যাট, বাড়ি কিংবা বাণিজ্যিক স্পেস খুঁজুন'
                : 'Browse by land, apartments, independent houses, or commercial properties'}
            </p>
          </div>

          <button
            onClick={() => navigateToListings({ category: 'all' })}
            className="text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 transition-colors self-start md:self-auto"
          >
            <span>{lang === 'bn' ? 'সকল ক্যাটাগরি দেখুন' : 'View All Categories'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => navigateToListings({ category: cat.id })}
                className="group bg-white p-6 rounded-xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-800">
                      {lang === 'bn' ? cat.badgeBn : cat.badgeEn}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {lang === 'bn' ? cat.titleBn : cat.titleEn}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {lang === 'bn' ? cat.descBn : cat.descEn}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="font-medium text-emerald-900 tabular-nums">
                    {lang === 'bn' ? cat.countBn : cat.countEn}
                  </span>
                  <span className="text-emerald-700 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
