import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { propertyService } from '../../services/propertyService';
import { Property, Inquiry, ReportedAd } from '../../types';
import { formatBDTPrice, formatAreaSize, formatNumberWithLocale } from '../../utils/formatters';
import { EmiCalculator } from './EmiCalculator';
import { PropertyCard } from './PropertyCard';
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Compass,
  Car,
  Layers,
  ShieldCheck,
  Phone,
  MessageCircle,
  Mail,
  Flag,
  CheckCircle2,
  Copy,
  Building,
} from 'lucide-react';

export const PropertyDetail: React.FC = () => {
  const {
    lang,
    selectedPropertyId,
    setCurrentView,
    favorites,
    toggleFavorite,
    showToast,
  } = useApp();

  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Inquiry Form state
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState(
    lang === 'bn'
      ? 'আমি এই প্রপার্টিটি সরাসরি দেখতে আগ্রহী। বিস্তারিত আলোচনার জন্য যোগাযোগ করুন।'
      : 'I am interested in visiting this property. Please contact me with further details.'
  );
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  // Report Modal state
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState<ReportedAd['reason']>('wrong_price');
  const [reportDetails, setReportDetails] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');

  useEffect(() => {
    if (!selectedPropertyId) return;

    const loadProperty = async () => {
      setLoading(true);
      try {
        const prop = await propertyService.getPropertyById(selectedPropertyId);
        setProperty(prop);
        if (prop) {
          const all = await propertyService.getProperties({
            category: prop.category,
          });
          setSimilarProperties(all.filter((p) => p.id !== prop.id).slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
    setActiveImageIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedPropertyId, lang]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-slate-200 rounded w-1/4" />
          <div className="aspect-[16/9] max-h-[450px] bg-slate-200 rounded-2xl w-full" />
          <div className="h-8 bg-slate-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">
          {lang === 'bn' ? 'প্রপার্টি পাওয়া যায়নি' : 'Property Not Found'}
        </h2>
        <button
          onClick={() => setCurrentView('properties')}
          className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm"
        >
          {lang === 'bn' ? 'সব লিস্টিংয়ে ফিরে যান' : 'Back to Listings'}
        </button>
      </div>
    );
  }

  const isSaved = favorites.includes(property.id);
  const isRent = property.listingType === 'rent';

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(
        lang === 'bn'
          ? 'প্রপার্টি লিঙ্ক ক্লিপবোর্ডে কপি করা হয়েছে'
          : 'Link copied to clipboard',
        'success'
      );
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone) {
      showToast(
        lang === 'bn' ? 'দয়া করে নাম ও ফোন নম্বর লিখুন' : 'Please provide name and phone',
        'error'
      );
      return;
    }

    setSubmittingInquiry(true);
    try {
      await propertyService.submitInquiry({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyTitleBn: property.titleBn,
        sellerId: property.seller.id,
        buyerName,
        buyerPhone,
        buyerEmail,
        message: inquiryMessage,
      });

      showToast(
        lang === 'bn'
          ? 'আপনার অনুসন্ধান বার্তা সফলভাবে বিক্রেতার কাছে পাঠানো হয়েছে'
          : 'Inquiry submitted successfully to seller',
        'success'
      );
      setInquiryOpen(false);
    } catch {
      showToast(lang === 'bn' ? 'ব্যর্থ হয়েছে, আবার চেষ্টা করুন' : 'Failed to submit', 'error');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const reasonNames: Record<ReportedAd['reason'], string> = {
        wrong_price: 'মূল্য ভুল',
        fraud: 'প্রতারণামূলক',
        already_sold: 'ইতিমধ্যে বিক্রিত',
        fake_location: 'ভুল ঠিকানা',
        inappropriate: 'অনুপযুক্ত বিষয়বস্তু',
        other: 'অন্যান্য কারণ',
      };

      await propertyService.reportListing({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyTitleBn: property.titleBn,
        reporterName: reporterName || 'Anonymous',
        reporterPhone: reporterPhone || 'N/A',
        reason: reportReason,
        reasonBn: reasonNames[reportReason],
        details: reportDetails,
      });

      showToast(
        lang === 'bn'
          ? 'রিপোর্ট জমা হয়েছে। আমাদের টিম পর্যালোচনা করবে।'
          : 'Report submitted. Our moderation team will review this listing.',
        'success'
      );
      setReportOpen(false);
    } catch {
      showToast('Error reporting', 'error');
    }
  };

  const whatsappMessage = encodeURIComponent(
    lang === 'bn'
      ? `আসসালামু আলাইকুম, আমি বাড়ি বাজার (BariBazar)-এ আপনার প্রপার্টি "${property.titleBn}" (ID: ${property.id}) দেখেছি। বিস্তারিত কথা বলতে চাই।`
      : `Hello, I saw your listing "${property.title}" (ID: ${property.id}) on BariBazar. I would like more information.`
  );

  return (
    <div className="bg-[#F8FAF9] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb / Back button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentView('properties')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'bn' ? 'সকল প্রপার্টি তালিকায় ফিরুন' : 'Back to Listings'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'শেয়ার' : 'Share'}</span>
            </button>

            <button
              onClick={() => toggleFavorite(property.id)}
              className={`p-2 border rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs ${
                isSaved
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : ''}`} />
              <span className="hidden sm:inline">
                {isSaved
                  ? lang === 'bn'
                    ? 'সংরক্ষিত'
                    : 'Saved'
                  : lang === 'bn'
                  ? 'সেভ করুন'
                  : 'Save'}
              </span>
            </button>
          </div>
        </div>

        {/* Gallery Showcase */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-sm mb-8">
          {/* Main Large Image */}
          <div className="relative aspect-[16/9] max-h-[500px] w-full bg-slate-900 rounded-xl overflow-hidden">
            <img
              src={
                property.images[activeImageIndex] ||
                '/src/assets/images/prop_luxury_apartment_1792778449931.jpg'
              }
              alt={lang === 'bn' ? property.titleBn : property.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Tag at top left */}
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded">
              <span>ID: {property.id}</span>
              <span className="mx-1 text-slate-400">·</span>
              <span>
                {lang === 'bn'
                  ? property.listingType === 'rent'
                    ? 'ভাড়া'
                    : 'বিক্রয়'
                  : property.listingType === 'rent'
                  ? 'For Rent'
                  : 'For Sale'}
              </span>
            </div>
          </div>

          {/* Thumbnails list */}
          {property.images.length > 1 && (
            <div className="flex items-center gap-3 mt-3 overflow-x-auto pb-1">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-[4/3] w-24 sm:w-28 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-emerald-600 scale-95 shadow'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details & Specs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-900 tracking-tight tabular-nums">
                  {formatBDTPrice(property.price, lang, isRent)}
                </div>
                {property.pricePerUnit && (
                  <span className="text-xs sm:text-sm text-slate-500 font-medium">
                    ({property.pricePerUnit})
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {lang === 'bn' ? property.titleBn : property.title}
              </h1>

              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  {lang === 'bn' ? property.location.addressBn : property.location.address}
                </span>
              </div>
            </div>

            {/* Key Specifications Grid */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
              <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                {lang === 'bn' ? 'মূল বিবরণ ও স্পেসিফিকেশন' : 'Key Specifications'}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                {property.specs.sizeSqFt !== undefined && (
                  <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl">
                    <Maximize2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[11px]">
                        {lang === 'bn' ? 'আয়তন' : 'Total Area'}
                      </span>
                      <span className="font-semibold text-slate-800 tabular-nums">
                        {formatAreaSize(property.specs.sizeSqFt, property.specs.sizeKatha, lang)}
                      </span>
                    </div>
                  </div>
                )}

                {property.specs.bedrooms !== undefined && (
                  <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl">
                    <Bed className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[11px]">
                        {lang === 'bn' ? 'বেডরুম' : 'Bedrooms'}
                      </span>
                      <span className="font-semibold text-slate-800 tabular-nums">
                        {formatNumberWithLocale(property.specs.bedrooms, lang)}{' '}
                        {lang === 'bn' ? 'টি' : 'Rooms'}
                      </span>
                    </div>
                  </div>
                )}

                {property.specs.bathrooms !== undefined && (
                  <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl">
                    <Bath className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[11px]">
                        {lang === 'bn' ? 'বাথরুম' : 'Bathrooms'}
                      </span>
                      <span className="font-semibold text-slate-800 tabular-nums">
                        {formatNumberWithLocale(property.specs.bathrooms, lang)}{' '}
                        {lang === 'bn' ? 'টি' : 'Baths'}
                      </span>
                    </div>
                  </div>
                )}

                {property.specs.floorNumber !== undefined && (
                  <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl">
                    <Layers className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[11px]">
                        {lang === 'bn' ? 'ফ্লোর নম্বর' : 'Floor Level'}
                      </span>
                      <span className="font-semibold text-slate-800 tabular-nums">
                        {formatNumberWithLocale(property.specs.floorNumber, lang)}{' '}
                        {lang === 'bn' ? 'তম' : 'th'} (মোট{' '}
                        {formatNumberWithLocale(property.specs.totalFloors || 0, lang)})
                      </span>
                    </div>
                  </div>
                )}

                {property.specs.facing && (
                  <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl">
                    <Compass className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[11px]">
                        {lang === 'bn' ? 'দিকমুখী' : 'Facing Direction'}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {property.specs.facing}
                      </span>
                    </div>
                  </div>
                )}

                {property.specs.parkingSpaces !== undefined && (
                  <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl">
                    <Car className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[11px]">
                        {lang === 'bn' ? 'পার্কিং' : 'Parking'}
                      </span>
                      <span className="font-semibold text-slate-800 tabular-nums">
                        {formatNumberWithLocale(property.specs.parkingSpaces, lang)}{' '}
                        {lang === 'bn' ? 'টি স্লট' : 'Slots'}
                      </span>
                    </div>
                  </div>
                )}

                {property.specs.completionYear && (
                  <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl">
                    <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[11px]">
                        {lang === 'bn' ? 'হস্তান্তর বছর' : 'Handover Year'}
                      </span>
                      <span className="font-semibold text-slate-800 tabular-nums">
                        {formatNumberWithLocale(property.specs.completionYear, lang)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3">
              <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                {lang === 'bn' ? 'বিস্তারিত বর্ণনা' : 'Detailed Description'}
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {lang === 'bn' ? property.descriptionBn : property.description}
              </p>
            </div>

            {/* Features & Amenities */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
              <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                {lang === 'bn' ? 'সুবিধাসমূহ (Amenities)' : 'Features & Amenities'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {(lang === 'bn' ? property.featuresBn : property.features).map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Loan EMI Calculator */}
            <EmiCalculator propertyPrice={property.price} />

            {/* Location Map Preview Mockup */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3">
              <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>{lang === 'bn' ? 'অবস্থান মানচিত্র' : 'Location Map'}</span>
                <span className="text-xs text-slate-400 font-normal">
                  {lang === 'bn' ? property.location.areaBn : property.location.area}
                </span>
              </h2>

              <div className="relative aspect-[16/7] w-full rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                {/* Clean stylized map preview */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative text-center p-4">
                  <div className="w-12 h-12 bg-emerald-700 text-white rounded-full flex items-center justify-center mx-auto shadow-md animate-bounce">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-slate-900">
                    {lang === 'bn' ? property.location.addressBn : property.location.address}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {lang === 'bn' ? 'গুগল ম্যাপ ভেরিফাইড লোকেশন' : 'Google Maps Verified Pinpoint'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Seller Contact Card & Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24 space-y-6">
              {/* Seller Profile */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-base font-bold shrink-0">
                  {property.seller.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-900 text-sm">
                      {lang === 'bn' ? property.seller.nameBn : property.seller.name}
                    </h3>
                    {property.seller.verified && (
                      <span title="Verified Seller">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-emerald-700 font-medium">
                    {lang === 'bn' ? property.seller.roleBn : property.seller.role}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {lang === 'bn'
                      ? `সদস্য: ${property.seller.memberSince} সাল থেকে`
                      : `Member since: ${property.seller.memberSince}`}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                {/* Direct Call */}
                <a
                  href={`tel:${property.seller.phone}`}
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'সরাসরি কল করুন' : 'Call Seller'}</span>
                </a>

                {/* Direct WhatsApp */}
                <a
                  href={`https://wa.me/${property.seller.whatsapp}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে চ্যাট করুন' : 'Chat on WhatsApp'}</span>
                </a>

                {/* Send Inquiry Modal Trigger */}
                <button
                  type="button"
                  onClick={() => setInquiryOpen(true)}
                  className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Mail className="w-4 h-4 text-emerald-700" />
                  <span>{lang === 'bn' ? 'বার্তা পাঠান (Inquiry)' : 'Send Direct Inquiry'}</span>
                </button>
              </div>

              {/* Safety notice for buyers in Bangladesh */}
              <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200/60 text-xs text-amber-900 space-y-1">
                <span className="font-bold block">
                  {lang === 'bn' ? 'ক্রেতাদের জন্য নিরাপত্তা পরামর্শ:' : 'Buyer Safety Advice:'}
                </span>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  {lang === 'bn'
                    ? 'দলিল ও প্রপার্টি সশরীরে না দেখে কোনো অগ্রিম বুকিং ফি পাঠাবেন না।'
                    : 'Never transfer advance money before physically verifying documents & property.'}
                </p>
              </div>

              {/* Report Advertisement */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setReportOpen(true)}
                  className="text-xs text-slate-400 hover:text-red-600 transition-colors inline-flex items-center gap-1"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'বিজ্ঞাপনটি রিপোর্ট করুন' : 'Report this listing'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Listings Carousel / Grid */}
        {similarProperties.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-200">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
              {lang === 'bn' ? 'সাদৃশ্যপূর্ণ অন্যান্য প্রপার্টি' : 'Similar Properties You May Like'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      {inquiryOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              {lang === 'bn' ? 'বিক্রেতার সাথে যোগাযোগ করুন' : 'Contact Property Seller'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'bn'
                ? `প্রপার্টি: ${property.titleBn}`
                : `Listing: ${property.title}`}
            </p>

            <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'আপনার নাম *' : 'Your Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder={lang === 'bn' ? 'যেমন: তানভীর আহমেদ' : 'e.g. Tanvir Ahmed'}
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
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="+880 1..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
                </label>
                <input
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'বার্তা' : 'Message'}
                </label>
                <textarea
                  rows={3}
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInquiryOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submittingInquiry}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold"
                >
                  {submittingInquiry
                    ? lang === 'bn'
                      ? 'পাঠানো হচ্ছে...'
                      : 'Sending...'
                    : lang === 'bn'
                    ? 'পাঠিয়ে দিন'
                    : 'Submit Inquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Flag className="w-5 h-5 text-red-600" />
              <span>{lang === 'bn' ? 'বিজ্ঞাপন রিপোর্ট করুন' : 'Report Advertisement'}</span>
            </h3>

            <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'রিপোর্টের কারণ' : 'Reason for reporting'}
                </label>
                <select
                  value={reportReason}
                  onChange={(e) =>
                    setReportReason(e.target.value as ReportedAd['reason'])
                  }
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="wrong_price">
                    {lang === 'bn' ? 'মূল্য ভুল বা অসামঞ্জস্যপূর্ণ' : 'Incorrect or misleading price'}
                  </option>
                  <option value="already_sold">
                    {lang === 'bn' ? 'প্রপার্টি ইতিমধ্যে বিক্রি হয়ে গেছে' : 'Property is already sold/rented'}
                  </option>
                  <option value="fraud">
                    {lang === 'bn' ? 'ভুয়া বা প্রতারণামূলক বিজ্ঞাপন' : 'Fraudulent listing / fake owner'}
                  </option>
                  <option value="fake_location">
                    {lang === 'bn' ? 'ভুল বা মিথ্যা ঠিকানা' : 'Wrong location details'}
                  </option>
                  <option value="other">
                    {lang === 'bn' ? 'অন্যান্য সমস্যা' : 'Other reason'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'বিস্তারিত বিবরণ' : 'Details'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder={
                    lang === 'bn'
                      ? 'সমস্যার বিস্তারিত বিবরণ দিন...'
                      : 'Provide details about the issue...'
                  }
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReportOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
                >
                  {lang === 'bn' ? 'রিপোর্ট দাখিল করুন' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
