import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { propertyService } from '../../services/propertyService';
import { BANGLADESH_DIVISIONS } from '../../data/locations';
import { PropertyCategory, ListingType, Property } from '../../types';
import {
  Building2,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  Image as ImageIcon,
} from 'lucide-react';

const PRESET_PHOTOS = [
  {
    url: '/src/assets/images/prop_luxury_apartment_1792778449931.jpg',
    labelBn: 'বিলাসবহুল অ্যাপার্টমেন্ট',
    labelEn: 'Luxury Apartment',
  },
  {
    url: '/src/assets/images/prop_suburban_house_1792778450060.jpg',
    labelBn: 'ডুপ্লেক্স বাংলো বাড়ি',
    labelEn: 'Duplex Bungalow',
  },
  {
    url: '/src/assets/images/prop_land_plot_1792778450974.jpg',
    labelBn: 'আবাসিক প্লট / জমি',
    labelEn: 'Residential Land Plot',
  },
  {
    url: '/src/assets/images/prop_commercial_office_1792778449991.jpg',
    labelBn: 'বাণিজ্যিক ভবন / শোরুম',
    labelEn: 'Commercial Building',
  },
  {
    url: '/src/assets/images/hero_dhaka_skyline_1792778448558.jpg',
    labelBn: 'সিটি ভিউ',
    labelEn: 'City Skyline',
  },
];

export const AddPropertyModal: React.FC = () => {
  const { lang, currentUser, setCurrentView, navigateToProperty, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [listingType, setListingType] = useState<ListingType>('sale');
  const [category, setCategory] = useState<PropertyCategory>('flat');
  const [price, setPrice] = useState<number>(15000000);
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [serviceCharge, setServiceCharge] = useState<number>(0);

  // Location
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka City');
  const [area, setArea] = useState('Gulshan');
  const [address, setAddress] = useState('');
  const [addressBn, setAddressBn] = useState('');

  // Specs
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(3);
  const [sizeSqFt, setSizeSqFt] = useState<number>(1650);
  const [sizeKatha, setSizeKatha] = useState<number>(0);
  const [floorNumber, setFloorNumber] = useState<number>(4);
  const [totalFloors, setTotalFloors] = useState<number>(10);
  const [parkingSpaces, setParkingSpaces] = useState<number>(1);
  const [facing, setFacing] = useState<'South' | 'North' | 'East' | 'West'>('South');

  // Description
  const [description, setDescription] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');

  // Images list
  const [images, setImages] = useState<string[]>([PRESET_PHOTOS[0].url]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Seller info
  const [sellerName, setSellerName] = useState(currentUser?.name || '');
  const [sellerPhone, setSellerPhone] = useState(currentUser?.phone || '+880');
  const [sellerWhatsapp, setSellerWhatsapp] = useState(
    currentUser?.phone?.replace('+', '') || '880'
  );
  const [sellerRole, setSellerRole] = useState<'Owner' | 'Agent' | 'Developer'>('Owner');

const selectedDivisionObj = BANGLADESH_DIVISIONS.find(
  (d) => d.name === division
);

const selectedDistrictObj = selectedDivisionObj?.districts.find(
  (d) => d.name === district
);

const popularAreas = selectedDistrictObj?.upazilas || [];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const addPresetImage = (url: string) => {
    if (!images.includes(url)) {
      setImages((prev) => [...prev, url]);
    }
  };

  const removeImage = (index: number) => {
    if (images.length <= 1) {
      showToast(
        lang === 'bn' ? 'কমপক্ষে একটি ছবি থাকতে হবে' : 'At least one photo is required',
        'info'
      );
      return;
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title && !titleBn) {
      showToast(
        lang === 'bn' ? 'অনুগ্রহ করে প্রপার্টির শিরোনাম দিন' : 'Please provide a title',
        'error'
      );
      return;
    }

    if (images.length === 0) {
      showToast(
        lang === 'bn' ? 'কমপক্ষে একটি ছবি যুক্ত করুন' : 'Please add at least one image',
        'error'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedAreaObj = popularAreas.find((a) => a.name === area);

      const newPropertyData: Omit<
        Property,
        'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'status'
      > = {
        title: title || titleBn,
        titleBn: titleBn || title,
        slug: (title || titleBn).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description:
          description ||
          `${title}. Prime real estate opportunity in ${area}, ${division}. Contact for visit.`,
        descriptionBn:
          descriptionBn ||
          `${titleBn || title}। ${area}, ${division}-এ আকর্ষণীয় আবাসন। বিস্তারিত জানতে যোগাযোগ করুন।`,
        category,
        listingType,
        price,
        isNegotiable,
        serviceCharge: listingType === 'rent' ? serviceCharge : undefined,
        location: {
          division,
          divisionBn: selectedDivisionObj?.nameBn || division,
          district,
          districtBn: selectedDivisionObj?.districts[0]?.nameBn || district,
          area,
          areaBn: selectedAreaObj?.nameBn || area,
          address: address || `${area}, ${division}`,
          addressBn: addressBn || `${selectedAreaObj?.nameBn || area}, ${division}`,
        },
        specs: {
          bedrooms: category !== 'land' ? bedrooms : undefined,
          bathrooms: category !== 'land' ? bathrooms : undefined,
          sizeSqFt,
          sizeKatha: sizeKatha > 0 ? sizeKatha : undefined,
          floorNumber: category === 'flat' ? floorNumber : undefined,
          totalFloors: category !== 'land' ? totalFloors : undefined,
          parkingSpaces: category !== 'land' ? parkingSpaces : undefined,
          facing,
          completionYear: 2024,
        },
        features: [
          '24/7 Security',
          'Generator Backup',
          'Elevator Access',
          'Good Ventilation',
        ],
        featuresBn: [
          '২৪/৭ নিরাপত্তা ব্যবস্থা',
          'জেনারেটর ব্যাকআপ',
          'লিফট সুবিধা',
          'উত্তম আলো-বাতাস',
        ],
        images,
        featured: false,
        seller: {
          id: currentUser?.id || 'sel-custom',
          name: sellerName,
          nameBn: sellerName,
          role: sellerRole,
          roleBn:
            sellerRole === 'Owner'
              ? 'মালিক'
              : sellerRole === 'Agent'
              ? 'এজেন্ট'
              : 'ডেভেলপার',
          phone: sellerPhone,
          whatsapp: sellerWhatsapp,
          verified: true,
          memberSince: '2026',
        },
      };

      const created = await propertyService.addProperty(newPropertyData);
      showToast(
        lang === 'bn'
          ? 'বিজ্ঞাপন সফলভাবে প্রকাশিত হয়েছে!'
          : 'Property advertisement published successfully!',
        'success'
      );
      navigateToProperty(created.id);
    } catch {
      showToast('Error saving listing', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8FAF9] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}</span>
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="border-b border-slate-100 pb-5 mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {lang === 'bn' ? 'নতুন প্রপার্টি বিজ্ঞাপন দিন' : 'Post a New Property Listing'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {lang === 'bn'
                ? 'সঠিক তথ্য ও ছবি দিয়ে ক্রেতা ও ভাড়াটিয়াদের দ্রুত আকৃষ্ট করুন'
                : 'Provide authentic information and photos to reach buyers across Bangladesh'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 text-sm">
            {/* Step 1: Listing Type & Category */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">
                  ১
                </span>
                <span>{lang === 'bn' ? 'প্রপার্টির ধরন ও উদ্দেশ্য' : 'Property Type & Purpose'}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    {lang === 'bn' ? 'বিজ্ঞাপনের উদ্দেশ্য' : 'Listing Purpose'}
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'sale', labelBn: 'বিক্রয়', labelEn: 'Sale' },
                      { id: 'rent', labelBn: 'ভাড়া', labelEn: 'Rent' },
                      { id: 'land_sale', labelBn: 'জমি বিক্রয়', labelEn: 'Land' },
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setListingType(type.id as ListingType)}
                        className={`py-2 rounded-lg font-medium border text-center transition-all ${
                          listingType === type.id
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {lang === 'bn' ? type.labelBn : type.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    {lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                  >
                    <option value="flat">
                      {lang === 'bn' ? 'ফ্ল্যাট ও অ্যাপার্টমেন্ট' : 'Flat & Apartment'}
                    </option>
                    <option value="house">
                      {lang === 'bn' ? 'স্বাধীন বাড়ি ও ডুপ্লেক্স' : 'Independent House & Duplex'}
                    </option>
                    <option value="land">
                      {lang === 'bn' ? 'জমি ও আবাসিক প্লট' : 'Land & Residential Plot'}
                    </option>
                    <option value="commercial">
                      {lang === 'bn' ? 'দোকান ও বাণিজ্যিক স্পেস' : 'Commercial Space & Shop'}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Title & Price */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">
                  ২
                </span>
                <span>{lang === 'bn' ? 'শিরোনাম ও মূল্য' : 'Title & Pricing'}</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'শিরোনাম (বাংলা) *' : 'Title (Bengali) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
                    placeholder="যেমন: গুলশান-২ এ ৪ বেডের বিলাসবহুল অ্যাপার্টমেন্ট"
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'শিরোনাম (English)' : 'Title (English)'}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 4-Bed Luxury Apartment in Gulshan-2"
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {lang === 'bn' ? 'প্রত্যাশিত মূল্য (BDT) *' : 'Expected Price (BDT) *'}
                    </label>
                    <input
                      type="number"
                      required
                      min={1000}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                    />
                    <label className="flex items-center gap-2 mt-2 cursor-pointer text-slate-600">
                      <input
                        type="checkbox"
                        checked={isNegotiable}
                        onChange={(e) => setIsNegotiable(e.target.checked)}
                        className="accent-emerald-700"
                      />
                      <span>{lang === 'bn' ? 'দাম আলোচনা সাপেক্ষ' : 'Price is Negotiable'}</span>
                    </label>
                  </div>

                  {listingType === 'rent' && (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        {lang === 'bn' ? 'সার্ভিস চার্জ (মাসিক BDT)' : 'Service Charge (BDT/mo)'}
                      </label>
                      <input
                        type="number"
                        value={serviceCharge}
                        onChange={(e) => setServiceCharge(Number(e.target.value))}
                        className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3: Location */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">
                  ৩
                </span>
                <span>{lang === 'bn' ? 'অবস্থান ও ঠিকানা' : 'Location & Address'}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'বিভাগ' : 'Division'}
                  </label>
                  <select
                    value={division}
                   onChange={(e) => {
  const divObj = BANGLADESH_DIVISIONS.find(
    (d) => d.name === e.target.value
  );

  setDivision(e.target.value);

  if (divObj) {
    const firstDistrict = divObj.districts[0];

    setDistrict(firstDistrict?.name || '');
    setArea(firstDistrict?.upazilas[0]?.name || '');
  }
}}
                      
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    {BANGLADESH_DIVISIONS.map((d) => (
                      <option key={d.id} value={d.name}>
                        {lang === 'bn' ? d.nameBn : d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'জেলা / মহানগর' : 'District'}
                  </label>
                  <select
                    value={district}
                    onChange={(e) => {
  const selectedDistrict = e.target.value;
  setDistrict(selectedDistrict);

  const districtObj = selectedDivisionObj?.districts.find(
    (d) => d.name === selectedDistrict
  );

  setArea(districtObj?.upazilas[0]?.name || '');
}}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    {selectedDivisionObj?.districts.map((d) => (
                      <option key={d.id} value={d.name}>
                        {lang === 'bn' ? d.nameBn : d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'জনপ্রিয় এলাকা / থানা' : 'Area / Thana'}
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    {popularAreas.map((a) => (
                      <option key={a.id} value={a.name}>
                        {lang === 'bn' ? a.nameBn : a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'পূর্ণাঙ্গ ঠিকানা (রাস্তা, সেক্টর, বাড়ি নং)' : 'Detailed Address'}
                </label>
                <input
                  type="text"
                  value={addressBn}
                  onChange={(e) => {
                    setAddressBn(e.target.value);
                    setAddress(e.target.value);
                  }}
                  placeholder="যেমন: রোড ১১, বাড়ি ৪২, গুলশান-২, ঢাকা"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>

            {/* Step 4: Specifications */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">
                  ৪
                </span>
                <span>{lang === 'bn' ? 'প্রপার্টির পরিমাপ ও স্পেসিফিকেশন' : 'Specifications'}</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'আয়তন (বর্গফুট)' : 'Size (Sq Ft)'}
                  </label>
                  <input
                    type="number"
                    value={sizeSqFt}
                    onChange={(e) => setSizeSqFt(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'জমির কাঠা (ঐচ্ছিক)' : 'Land Katha'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={sizeKatha}
                    onChange={(e) => setSizeKatha(Number(e.target.value))}
                    placeholder="যেমন: ৫ কাঠা"
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                {category !== 'land' && (
                  <>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        {lang === 'bn' ? 'বেডরুম' : 'Bedrooms'}
                      </label>
                      <input
                        type="number"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(Number(e.target.value))}
                        className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        {lang === 'bn' ? 'বাথরুম' : 'Bathrooms'}
                      </label>
                      <input
                        type="number"
                        value={bathrooms}
                        onChange={(e) => setBathrooms(Number(e.target.value))}
                        className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Step 5: Photos */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">
                  ৫
                </span>
                <span>{lang === 'bn' ? 'প্রপার্টির ছবি আপলোড' : 'Property Photos'}</span>
              </h2>

              <p className="text-xs text-slate-500">
                {lang === 'bn'
                  ? 'আপনার ডিভাইস থেকে ছবি আপলোড করুন অথবা নিচের আর্কিটেকচারাল ফটো প্রিসেট থেকে নির্বাচন করুন।'
                  : 'Upload images from your device or pick from our curated architectural presets.'}
              </p>

              {/* Upload Input */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label className="w-full sm:w-auto px-5 py-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-800 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'ডিভাইস থেকে ছবি বেছে নিন' : 'Upload from Device'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <span className="text-xs text-slate-400">
                  {lang === 'bn'
                    ? `বর্তমান নির্বাচিত ছবি: ${images.length} টি`
                    : `Selected photos: ${images.length}`}
                </span>
              </div>

              {/* Presets picker */}
              <div>
                <span className="block text-xs font-semibold text-slate-700 mb-2">
                  {lang === 'bn' ? 'অথবা দ্রুত নমুনা ছবি যোগ করুন:' : 'Or pick quick sample photos:'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {PRESET_PHOTOS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => addPresetImage(preset.url)}
                      className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 hover:border-emerald-600 transition-all text-left"
                    >
                      <img
                        src={preset.url}
                        alt="Preset preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-end p-1 text-[10px] text-white font-medium">
                        <span className="truncate">
                          {lang === 'bn' ? preset.labelBn : preset.labelEn}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Active Images preview strip */}
              {images.length > 0 && (
                <div className="pt-3">
                  <span className="block text-xs font-semibold text-slate-700 mb-2">
                    {lang === 'bn' ? 'বিজ্ঞাপনে প্রদর্শিত ছবিগুলো:' : 'Active Photos for Listing:'}
                  </span>
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-[4/3] w-28 rounded-lg overflow-hidden border border-slate-300 shrink-0 group"
                      >
                        <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step 6: Description */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">
                  ৬
                </span>
                <span>{lang === 'bn' ? 'বিস্তারিত বর্ণনা' : 'Description'}</span>
              </h2>

              <div className="text-xs">
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'প্রপার্টির বর্ণনা (বাংলা)' : 'Description (Bengali)'}
                </label>
                <textarea
                  rows={4}
                  value={descriptionBn}
                  onChange={(e) => setDescriptionBn(e.target.value)}
                  placeholder="প্রপার্টির সুযোগ-সুবিধা, গ্যাস সংযোগ, লিফট, পার্কিং ইত্যাদি বিস্তারিত লিখুন..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>

            {/* Step 7: Seller Contact */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">
                  ৭
                </span>
                <span>{lang === 'bn' ? 'যোগাযোগের তথ্য' : 'Contact Details'}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'যোগাযোগকারীর নাম *' : 'Contact Person *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'মোবাইল নম্বর *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'আপনার ভূমিকা' : 'Your Role'}
                  </label>
                  <select
                    value={sellerRole}
                    onChange={(e) =>
                      setSellerRole(e.target.value as 'Owner' | 'Agent' | 'Developer')
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="Owner">{lang === 'bn' ? 'মালিক (Owner)' : 'Owner'}</option>
                    <option value="Agent">{lang === 'bn' ? 'এজেন্ট (Agent)' : 'Agent'}</option>
                    <option value="Developer">
                      {lang === 'bn' ? 'ডেভেলপার (Developer)' : 'Developer'}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400 text-center sm:text-left">
                {lang === 'bn'
                  ? 'বিজ্ঞাপনটি পোস্ট করার মাধ্যমে আপনি বাড়ি বাজারের ব্যবহারের শর্তাবলীর সাথে সম্মত হচ্ছেন।'
                  : 'By publishing, you agree to BariBazar terms and verified listing policies.'}
              </p>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setCurrentView('home')}
                  className="w-full sm:w-auto px-5 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-medium text-xs hover:bg-slate-50 transition-colors"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-sm hover:shadow transition-all"
                >
                  {isSubmitting
                    ? lang === 'bn'
                      ? 'প্রকাশ করা হচ্ছে...'
                      : 'Publishing...'
                    : lang === 'bn'
                    ? 'বিজ্ঞাপন পোস্ট করুন'
                    : 'Publish Listing'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
