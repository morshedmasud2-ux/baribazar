import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BANGLADESH_DIVISIONS } from '../../data/locations';
import { PropertyCategory, ListingType } from '../../types';
import { Search, MapPin, Building, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';

export const HeroSearch: React.FC = () => {
  const { lang, navigateToListings } = useApp();

  const [activeTab, setActiveTab] = useState<ListingType>('sale');
  const [selectedDivision, setSelectedDivision] = useState<string>('Dhaka');
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [budgetRange, setBudgetRange] = useState<string>('all');

  const currentDivisionObj = BANGLADESH_DIVISIONS.find(
    (d) => d.name === selectedDivision || d.nameBn === selectedDivision
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let minPrice: number | undefined;
    let maxPrice: number | undefined;

    if (budgetRange === 'under_50l') {
      maxPrice = 5000000;
    } else if (budgetRange === '50l_1c') {
      minPrice = 5000000;
      maxPrice = 10000000;
    } else if (budgetRange === '1c_3c') {
      minPrice = 10000000;
      maxPrice = 30000000;
    } else if (budgetRange === 'above_3c') {
      minPrice = 30000000;
    } else if (budgetRange === 'rent_under_30k') {
      maxPrice = 30000;
    } else if (budgetRange === 'rent_30k_70k') {
      minPrice = 30000;
      maxPrice = 70000;
    } else if (budgetRange === 'rent_above_70k') {
      minPrice = 70000;
    }

    navigateToListings({
      query: searchQuery.trim(),
      listingType: activeTab,
      category: selectedCategory,
      division: selectedDivision === 'all' ? undefined : selectedDivision,
      minPrice,
      maxPrice,
    });
  };

  const quickSearches = [
    { labelBn: 'গুলশান ৪ বেড ফ্ল্যাট', labelEn: 'Gulshan 4-Bed Flat', division: 'Dhaka', area: 'Gulshan', cat: 'flat' as PropertyCategory },
    { labelBn: 'বসুন্ধরা ডুপ্লেক্স বাড়ি', labelEn: 'Bashundhara Duplex House', division: 'Dhaka', area: 'Bashundhara R/A', cat: 'house' as PropertyCategory },
    { labelBn: 'পূর্বাচল ৫ কাঠা প্লট', labelEn: 'Purbachal 5 Katha Plot', division: 'Dhaka', area: 'Purbachal New Town', cat: 'land' as PropertyCategory },
    { labelBn: 'ধানমন্ডি ফ্যামিলি ফ্ল্যাট', labelEn: 'Dhanmondi Family Flat', division: 'Dhaka', area: 'Dhanmondi', cat: 'flat' as PropertyCategory },
    { labelBn: 'বনানী বাণিজ্যিক শোরুম', labelEn: 'Banani Commercial Space', division: 'Dhaka', area: 'Banani', cat: 'commercial' as PropertyCategory },
  ];

  return (
    <section className="relative">
      {/* Background Hero Banner */}
      <div className="relative min-h-[520px] lg:min-h-[580px] bg-slate-900 flex items-center justify-center overflow-hidden">
        <img
          src="/src/assets/images/hero_dhaka_skyline_1792778448558.jpg"
          alt="Dhaka Skyline BariBazar"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-45 transform scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Deep contrast scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/50" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/80 border border-emerald-500/30 rounded-md text-emerald-300 text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {lang === 'bn'
                ? 'বাংলাদেশের নির্ভরযোগ্য রিয়েল এস্টেট মার্কেটপ্লেস'
                : 'Bangladesh’s Premier Real Estate Network'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight text-balance">
            {lang === 'bn' ? (
              <>
                আপনার স্বপ্নের ঠিকানা খুঁজুন <span className="text-emerald-400">বাড়ি বাজারে</span>
              </>
            ) : (
              <>
                Find Your Ideal Property in <span className="text-emerald-400">Bangladesh</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            {lang === 'bn'
              ? 'ঢাকা, চট্টগ্রাম, সিলেট সহ বাংলাদেশের সর্বত্র ফ্ল্যাট, জমি, বাড়ি ও বাণিজ্যিক সম্পত্তি বিক্রয় এবং ভাড়ার শতভাগ যাচাইকৃত তালিকা।'
              : 'Discover verified apartments, residential land plots, luxury houses, and commercial retail spaces across all 64 districts.'}
          </p>

          {/* Search Box Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 text-slate-800 max-w-4xl mx-auto border border-white/20">
            {/* Purpose Tabs - Segmented control */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl max-w-md mx-auto mb-5 text-sm font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('sale')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  activeTab === 'sale'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'bn' ? 'কিনুন' : 'Buy'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('rent')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  activeTab === 'rent'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'bn' ? 'ভাড়া নিন' : 'Rent'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('land_sale')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  activeTab === 'land_sale'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'bn' ? 'জমি বিক্রয়' : 'Land Sale'}
              </button>
            </div>

            {/* Filter Inputs Form */}
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
                {/* 1. Location / Division */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                    {lang === 'bn' ? 'বিভাগ বা জেলা' : 'Division / District'}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-emerald-700 absolute left-3 top-3 pointer-events-none" />
                    <select
                      value={selectedDivision}
                      onChange={(e) => setSelectedDivision(e.target.value)}
                      className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-emerald-600 focus:bg-white"
                    >
                      <option value="all">
                        {lang === 'bn' ? 'সমগ্র বাংলাদেশ' : 'All Bangladesh'}
                      </option>
                      {BANGLADESH_DIVISIONS.map((div) => (
                        <option key={div.id} value={div.name}>
                          {lang === 'bn' ? div.nameBn : div.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                    {lang === 'bn' ? 'প্রপার্টি ক্যাটাগরি' : 'Property Type'}
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-emerald-700 absolute left-3 top-3 pointer-events-none" />
                    <select
                      value={selectedCategory}
                      onChange={(e) =>
                        setSelectedCategory(e.target.value as PropertyCategory | 'all')
                      }
                      className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-emerald-600 focus:bg-white"
                    >
                      <option value="all">
                        {lang === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}
                      </option>
                      <option value="flat">
                        {lang === 'bn' ? 'ফ্ল্যাট / অ্যাপার্টমেন্ট' : 'Flat / Apartment'}
                      </option>
                      <option value="land">
                        {lang === 'bn' ? 'জমি / প্লট' : 'Land / Plot'}
                      </option>
                      <option value="house">
                        {lang === 'bn' ? 'বাড়ি / ডুপ্লেক্স' : 'Independent House'}
                      </option>
                      <option value="commercial">
                        {lang === 'bn' ? 'দোকান ও বাণিজ্যিক' : 'Commercial & Shop'}
                      </option>
                    </select>
                  </div>
                </div>

                {/* 3. Budget Range */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                    {lang === 'bn' ? 'বাজেট সীমা' : 'Budget Range'}
                  </label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 focus:outline-emerald-600 focus:bg-white"
                  >
                    <option value="all">
                      {lang === 'bn' ? 'যে কোনো বাজেট' : 'Any Budget'}
                    </option>
                    {activeTab === 'rent' ? (
                      <>
                        <option value="rent_under_30k">
                          {lang === 'bn' ? '৳ ৩০,০০০ এর নিচে' : 'Under BDT 30K'}
                        </option>
                        <option value="rent_30k_70k">
                          {lang === 'bn' ? '৳ ৩০,০০০ - ৭০,০০০' : 'BDT 30K - 70K'}
                        </option>
                        <option value="rent_above_70k">
                          {lang === 'bn' ? '৳ ৭০,০০০ এর বেশি' : 'Above BDT 70K'}
                        </option>
                      </>
                    ) : (
                      <>
                        <option value="under_50l">
                          {lang === 'bn' ? '৳ ৫০ লক্ষের নিচে' : 'Under BDT 50 Lakh'}
                        </option>
                        <option value="50l_1c">
                          {lang === 'bn' ? '৳ ৫০ লক্ষ - ১ কোটি' : 'BDT 50 Lakh - 1 Crore'}
                        </option>
                        <option value="1c_3c">
                          {lang === 'bn' ? '৳ ১ কোটি - ৩ কোটি' : 'BDT 1 Crore - 3 Crore'}
                        </option>
                        <option value="above_3c">
                          {lang === 'bn' ? '৳ ৩ কোটির বেশি' : 'Above BDT 3 Crore'}
                        </option>
                      </>
                    )}
                  </select>
                </div>

                {/* 4. Keyword / Area Search */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                    {lang === 'bn' ? 'এলাকা বা কিওয়ার্ড' : 'Keyword / Area'}
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      lang === 'bn' ? 'যেমন: গুলশান, ধানমন্ডি, পূর্বাচল' : 'e.g. Gulshan, Dhanmondi'
                    }
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>
                    {lang === 'bn' ? 'প্রপার্টি খুঁজুন' : 'Search Properties'}
                  </span>
                </button>
              </div>
            </form>

            {/* Quick search suggestions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">
                {lang === 'bn' ? 'জনপ্রিয় অনুসন্ধান:' : 'Trending:'}
              </span>
              {quickSearches.map((qs, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() =>
                    navigateToListings({
                      division: qs.division,
                      area: qs.area,
                      category: qs.cat,
                    })
                  }
                  className="text-emerald-800 hover:text-emerald-950 hover:underline transition-colors font-medium"
                >
                  {lang === 'bn' ? qs.labelBn : qs.labelEn}
                  {i < quickSearches.length - 1 && <span className="ml-2 text-slate-300">·</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Proof / Trust Strip */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-emerald-900 tabular-nums">
                {lang === 'bn' ? '৫,০০০+' : '5,000+'}
              </span>
              <span className="text-xs text-slate-600 mt-0.5">
                {lang === 'bn' ? 'যাচাইকৃত বিজ্ঞাপন' : 'Verified Listings'}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-emerald-900 tabular-nums">
                {lang === 'bn' ? '৬৪ জেলা' : '64 Districts'}
              </span>
              <span className="text-xs text-slate-600 mt-0.5">
                {lang === 'bn' ? 'সমগ্র বাংলাদেশ কভারেজ' : 'Nationwide Network'}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-emerald-900 tabular-nums">
                {lang === 'bn' ? '০%' : '0%'}
              </span>
              <span className="text-xs text-slate-600 mt-0.5">
                {lang === 'bn' ? 'ক্রেতাদের জন্য ব্রোকারেজ ফি' : 'Buyer Commission'}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-emerald-900 tabular-nums">
                {lang === 'bn' ? '২৪/৭' : '24/7'}
              </span>
              <span className="text-xs text-slate-600 mt-0.5">
                {lang === 'bn' ? 'আইনি ও দলিল সহায়তা' : 'Legal & Mutation Support'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
