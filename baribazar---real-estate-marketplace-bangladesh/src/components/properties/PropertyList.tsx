import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { propertyService } from '../../services/propertyService';
import { Property, PropertyCategory, ListingType } from '../../types';
import { BANGLADESH_DIVISIONS } from '../../data/locations';
import { PropertyCard } from './PropertyCard';
import { formatNumberWithLocale } from '../../utils/formatters';
import {
  Filter,
  X,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Building,
  Search,
} from 'lucide-react';

export const PropertyList: React.FC = () => {
  const { lang, filters, setFilters, resetFilters } = useApp();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const list = await propertyService.getProperties(filters);
        setProperties(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiltered();

    const handleChange = () => fetchFiltered();
    window.addEventListener('baribazar_properties_change', handleChange);
    return () => window.removeEventListener('baribazar_properties_change', handleChange);
  }, [filters]);

  const currentDivisionObj = BANGLADESH_DIVISIONS.find(
    (d) =>
      d.name.toLowerCase() === (filters.division || '').toLowerCase() ||
      d.nameBn === filters.division
  );

  const availableAreas =
    currentDivisionObj?.districts.flatMap((dist) => dist.popularAreas) || [];

  const handleListingTypeChange = (type: ListingType | 'all') => {
    setFilters((prev) => ({ ...prev, listingType: type }));
  };

  const handleCategoryChange = (cat: PropertyCategory | 'all') => {
    setFilters((prev) => ({ ...prev, category: cat }));
  };

  const handleDivisionChange = (div: string) => {
    setFilters((prev) => ({
      ...prev,
      division: div === 'all' ? undefined : div,
      area: undefined, // Reset area when division changes
    }));
  };

  const handleAreaChange = (area: string) => {
    setFilters((prev) => ({
      ...prev,
      area: area === 'all' ? undefined : area,
    }));
  };

  const handleBedroomsChange = (beds: number) => {
    setFilters((prev) => ({
      ...prev,
      minBedrooms: prev.minBedrooms === beds ? 0 : beds,
    }));
  };

  const handleSortChange = (
    sortBy: 'newest' | 'price_low' | 'price_high' | 'size_high'
  ) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  return (
    <div className="bg-[#F8FAF9] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Search Bar */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {lang === 'bn' ? 'সকল প্রপার্টি লিস্টিং' : 'All Property Listings'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {lang === 'bn'
                ? `মোট ${formatNumberWithLocale(properties.length, lang)} টি বিজ্ঞাপন খুঁজে পাওয়া গেছে`
                : `Showing ${properties.length} verified properties`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={filters.query || ''}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, query: e.target.value }))
                }
                placeholder={lang === 'bn' ? 'খুঁজুন...' : 'Search area, title...'}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-emerald-600 shadow-2xs"
              />
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
              <span>{lang === 'bn' ? 'ফিল্টার' : 'Filters'}</span>
            </button>

            {/* Sort Select */}
            <select
              value={filters.sortBy || 'newest'}
              onChange={(e) =>
                handleSortChange(e.target.value as 'newest' | 'price_low' | 'price_high' | 'size_high')
              }
              aria-label={lang === 'bn' ? 'সাজান' : 'Sort by'}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 focus:outline-emerald-600 shadow-2xs"
            >
              <option value="newest">
                {lang === 'bn' ? 'নতুন বিজ্ঞাপন প্রথমে' : 'Newest First'}
              </option>
              <option value="price_low">
                {lang === 'bn' ? 'মূল্য: কম থেকে বেশি' : 'Price: Low to High'}
              </option>
              <option value="price_high">
                {lang === 'bn' ? 'মূল্য: বেশি থেকে কম' : 'Price: High to Low'}
              </option>
              <option value="size_high">
                {lang === 'bn' ? 'সাইজ: বড় থেকে ছোট' : 'Largest Size'}
              </option>
            </select>
          </div>
        </div>

        {/* Quick Purpose Segmented Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-6 p-1.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          {[
            { id: 'all', labelBn: 'সকল লিস্টিং', labelEn: 'All Listings' },
            { id: 'sale', labelBn: 'বিক্রয়', labelEn: 'For Sale' },
            { id: 'rent', labelBn: 'ভাড়া', labelEn: 'For Rent' },
            { id: 'land_sale', labelBn: 'জমি বিক্রয়', labelEn: 'Land Sale' },
          ].map((type) => {
            const isActive = (filters.listingType || 'all') === type.id;
            return (
              <button
                key={type.id}
                onClick={() => handleListingTypeChange(type.id as ListingType | 'all')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {lang === 'bn' ? type.labelBn : type.labelEn}
              </button>
            );
          })}

          <div className="ml-auto hidden sm:flex items-center gap-2 text-xs text-slate-500 pr-2">
            {(filters.category !== 'all' ||
              filters.division ||
              filters.area ||
              filters.minBedrooms) && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'ফিল্টার রিসেট' : 'Reset'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-700" />
                  <span>{lang === 'bn' ? 'ফিল্টারসমূহ' : 'Refine Search'}</span>
                </span>
                <button
                  onClick={resetFilters}
                  className="text-xs text-slate-400 hover:text-emerald-700 transition-colors"
                >
                  {lang === 'bn' ? 'রিসেট' : 'Clear All'}
                </button>
              </div>

              {/* Division / City */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  {lang === 'bn' ? 'বিভাগ নির্বাচন করুন' : 'Select Division'}
                </label>
                <select
                  value={filters.division || 'all'}
                  onChange={(e) => handleDivisionChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-emerald-600"
                >
                  <option value="all">
                    {lang === 'bn' ? 'সকল বিভাগ' : 'All Divisions'}
                  </option>
                  {BANGLADESH_DIVISIONS.map((div) => (
                    <option key={div.id} value={div.name}>
                      {lang === 'bn' ? div.nameBn : div.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area */}
              {availableAreas.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    {lang === 'bn' ? 'নির্দিষ্ট এলাকা / থানা' : 'Select Area / Thana'}
                  </label>
                  <select
                    value={filters.area || 'all'}
                    onChange={(e) => handleAreaChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-emerald-600"
                  >
                    <option value="all">
                      {lang === 'bn' ? 'সকল এলাকা' : 'All Areas'}
                    </option>
                    {availableAreas.map((area) => (
                      <option key={area.id} value={area.name}>
                        {lang === 'bn' ? area.nameBn : area.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  {lang === 'bn' ? 'প্রপার্টি ক্যাটাগরি' : 'Property Type'}
                </label>
                <div className="space-y-1.5 text-xs">
                  {[
                    { id: 'all', labelBn: 'সকল ক্যাটাগরি', labelEn: 'All Types' },
                    { id: 'flat', labelBn: 'ফ্ল্যাট ও অ্যাপার্টমেন্ট', labelEn: 'Flats & Apartments' },
                    { id: 'house', labelBn: 'বাড়ি ও ডুপ্লেক্স', labelEn: 'Houses & Duplex' },
                    { id: 'land', labelBn: 'জমি ও আবাসিক প্লট', labelEn: 'Land & Plots' },
                    { id: 'commercial', labelBn: 'দোকান ও বাণিজ্যিক', labelEn: 'Commercial & Shops' },
                  ].map((cat) => {
                    const isChecked = (filters.category || 'all') === cat.id;
                    return (
                      <label
                        key={cat.id}
                        className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-50 rounded"
                      >
                        <input
                          type="radio"
                          name="category"
                          checked={isChecked}
                          onChange={() =>
                            handleCategoryChange(cat.id as PropertyCategory | 'all')
                          }
                          className="accent-emerald-700"
                        />
                        <span className={isChecked ? 'font-semibold text-emerald-950' : 'text-slate-600'}>
                          {lang === 'bn' ? cat.labelBn : cat.labelEn}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  {lang === 'bn' ? 'বেডরুম সংখ্যা' : 'Bedrooms'}
                </label>
                <div className="grid grid-cols-5 gap-1 text-xs">
                  {[1, 2, 3, 4, 5].map((num) => {
                    const isSelected = filters.minBedrooms === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleBedroomsChange(num)}
                        className={`py-1.5 rounded text-center font-medium border ${
                          isSelected
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {formatNumberWithLocale(num, lang)}
                        {num === 5 ? '+' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Filter Inputs */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  {lang === 'bn' ? 'মূল্য সীমা (BDT)' : 'Price Range (BDT)'}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="number"
                    placeholder={lang === 'bn' ? 'সর্বনিম্ন' : 'Min'}
                    value={filters.minPrice || ''}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minPrice: Number(e.target.value) || 0,
                      }))
                    }
                    className="p-2 bg-slate-50 border border-slate-200 rounded text-slate-800"
                  />
                  <input
                    type="number"
                    placeholder={lang === 'bn' ? 'সর্বোচ্চ' : 'Max'}
                    value={filters.maxPrice || ''}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxPrice: Number(e.target.value) || 0,
                      }))
                    }
                    className="p-2 bg-slate-50 border border-slate-200 rounded text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Properties Result Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-4 border border-slate-200 animate-pulse space-y-3"
                  >
                    <div className="aspect-[4/3] bg-slate-200 rounded-lg" />
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-5 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <Building className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {lang === 'bn'
                    ? 'কোনো প্রপার্টি খুঁজে পাওয়া যায়নি'
                    : 'No Matching Properties Found'}
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  {lang === 'bn'
                    ? 'অনুগ্রহ করে ফিল্টার পরিবর্তন করুন অথবা সকল প্রপার্টি দেখতে রিসেট করুন।'
                    : 'Try loosening your filter criteria or clear filters to view all listings.'}
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs rounded-lg shadow-sm transition-all inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'সকল ফিল্টার মুছুন' : 'Clear All Filters'}</span>
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
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-5 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-slate-900 text-sm">
                {lang === 'bn' ? 'ফিল্টার করুন' : 'Filter Listings'}
              </span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Division */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {lang === 'bn' ? 'বিভাগ' : 'Division'}
              </label>
              <select
                value={filters.division || 'all'}
                onChange={(e) => handleDivisionChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <option value="all">
                  {lang === 'bn' ? 'সকল বিভাগ' : 'All Divisions'}
                </option>
                {BANGLADESH_DIVISIONS.map((div) => (
                  <option key={div.id} value={div.name}>
                    {lang === 'bn' ? div.nameBn : div.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'all', labelBn: 'সকল', labelEn: 'All' },
                  { id: 'flat', labelBn: 'ফ্ল্যাট', labelEn: 'Flat' },
                  { id: 'house', labelBn: 'বাড়ি', labelEn: 'House' },
                  { id: 'land', labelBn: 'জমি', labelEn: 'Land' },
                  { id: 'commercial', labelBn: 'বাণিজ্যিক', labelEn: 'Commercial' },
                ].map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="mobile_cat"
                      checked={(filters.category || 'all') === cat.id}
                      onChange={() =>
                        handleCategoryChange(cat.id as PropertyCategory | 'all')
                      }
                      className="accent-emerald-700"
                    />
                    <span>{lang === 'bn' ? cat.labelBn : cat.labelEn}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 flex gap-2">
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-2 text-xs border border-slate-300 rounded-lg text-slate-700"
              >
                {lang === 'bn' ? 'রিসেট' : 'Reset'}
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2 text-xs bg-emerald-700 text-white rounded-lg font-semibold"
              >
                {lang === 'bn' ? 'প্রয়োগ করুন' : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
