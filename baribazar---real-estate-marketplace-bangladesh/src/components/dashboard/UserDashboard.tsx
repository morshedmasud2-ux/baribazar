import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { propertyService } from '../../services/propertyService';
import { Property, Inquiry } from '../../types';
import { PropertyCard } from '../properties/PropertyCard';
import { formatBDTPrice, formatNumberWithLocale } from '../../utils/formatters';
import {
  LayoutDashboard,
  Building,
  Heart,
  MessageSquare,
  Settings,
  PlusCircle,
  Trash2,
  CheckCircle,
  Eye,
  Phone,
  Mail,
  UserCheck,
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const {
    lang,
    currentUser,
    favorites,
    setCurrentView,
    navigateToProperty,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'listings' | 'favorites' | 'inquiries' | 'profile'
  >('listings');

  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const all = await propertyService.getProperties();

        // My listings: either matching user ID or fallback to demo properties
        const myProps = all.filter(
          (p) =>
            p.seller.id === currentUser?.id ||
            p.seller.name.toLowerCase().includes(currentUser?.name.toLowerCase() || 'morshed')
        );
        // If user has no posted properties yet, show at least 2 properties for pleasant demo
        setMyProperties(myProps.length > 0 ? myProps : all.slice(0, 2));

        // Favorites
        const favProps = all.filter((p) => favorites.includes(p.id));
        setFavoriteProperties(favProps);

        // Inquiries
        const inqs = await propertyService.getInquiries();
        setInquiries(inqs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleChange = () => fetchData();
    window.addEventListener('baribazar_properties_change', handleChange);
    window.addEventListener('baribazar_favorites_change', handleChange);
    return () => {
      window.removeEventListener('baribazar_properties_change', handleChange);
      window.removeEventListener('baribazar_favorites_change', handleChange);
    };
  }, [currentUser, favorites]);

  const handleMarkSold = async (id: string) => {
    try {
      await propertyService.updateProperty(id, { status: 'sold' });
      showToast(
        lang === 'bn' ? 'প্রপার্টি বিক্রিত হিসেবে চিহ্নিত হয়েছে' : 'Marked as Sold',
        'success'
      );
    } catch {
      showToast('Error updating status', 'error');
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (confirm(lang === 'bn' ? 'আপনি কি নিশ্চিতভাবে এই বিজ্ঞাপনটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this listing?')) {
      await propertyService.deleteProperty(id);
      showToast(
        lang === 'bn' ? 'বিজ্ঞাপন সফলভাবে মুছে ফেলা হয়েছে' : 'Listing deleted',
        'info'
      );
    }
  };

  return (
    <div className="bg-[#F8FAF9] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-xl font-bold shrink-0">
              {currentUser?.name.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {currentUser?.name || 'User'}
                </h1>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                  {currentUser?.role === 'admin'
                    ? 'Admin'
                    : currentUser?.role === 'agent'
                    ? 'Verified Agent'
                    : 'Property Owner'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {currentUser?.email || 'user@baribazar.com'} · {currentUser?.phone}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('add_property')}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-xs shadow-sm transition-all whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{lang === 'bn' ? 'নতুন বিজ্ঞাপন দিন' : 'Post New Listing'}</span>
          </button>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 overflow-x-auto pb-1 text-sm font-medium">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'listings'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>{lang === 'bn' ? 'আমার বিজ্ঞাপনসমূহ' : 'My Listings'}</span>
            <span className="text-xs bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full">
              {myProperties.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>{lang === 'bn' ? 'পছন্দের তালিকা' : 'Saved Homes'}</span>
            <span className="text-xs bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full">
              {favoriteProperties.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'inquiries'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{lang === 'bn' ? 'ক্রেতাদের অনুসন্ধান' : 'Inquiries'}</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
              {inquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{lang === 'bn' ? 'প্রোফাইল সেটিংস' : 'Profile Settings'}</span>
          </button>
        </div>

        {/* Tab 1: My Listings */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            {myProperties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-base">
                  {lang === 'bn' ? 'এখনো কোনো বিজ্ঞাপন দেননি' : 'No Listings Posted Yet'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-5">
                  {lang === 'bn'
                    ? 'আপনার প্রপার্টির বিজ্ঞাপন দিন এবং হাজার হাজার ক্রেতাদের কাছে পৌঁছান।'
                    : 'Publish your property ad to start receiving inquiries.'}
                </p>
                <button
                  onClick={() => setCurrentView('add_property')}
                  className="px-5 py-2.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                >
                  {lang === 'bn' ? 'প্রথম বিজ্ঞাপন দিন' : 'Create First Listing'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {myProperties.map((prop) => (
                  <div
                    key={prop.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={prop.images[0]}
                        alt={prop.title}
                        className="w-20 h-16 sm:w-28 sm:h-20 object-cover rounded-lg shrink-0 cursor-pointer"
                        onClick={() => navigateToProperty(prop.id)}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              prop.status === 'sold'
                                ? 'bg-slate-200 text-slate-700'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {prop.status === 'sold'
                              ? lang === 'bn'
                                ? 'বিক্রিত'
                                : 'Sold'
                              : lang === 'bn'
                              ? 'সক্রিয়'
                              : 'Active'}
                          </span>
                          <span className="text-xs text-slate-400">ID: {prop.id}</span>
                        </div>
                        <h4
                          onClick={() => navigateToProperty(prop.id)}
                          className="font-bold text-slate-900 text-sm mt-1 hover:text-emerald-800 cursor-pointer line-clamp-1"
                        >
                          {lang === 'bn' ? prop.titleBn : prop.title}
                        </h4>
                        <p className="text-xs text-emerald-900 font-bold mt-0.5 tabular-nums">
                          {formatBDTPrice(prop.price, lang, prop.listingType === 'rent')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {prop.status !== 'sold' && (
                        <button
                          onClick={() => handleMarkSold(prop.id)}
                          className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5"
                          title="Mark as Sold"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{lang === 'bn' ? 'বিক্রিত চিহ্নিত করুন' : 'Mark Sold'}</span>
                        </button>
                      )}
                      <button
                        onClick={() => navigateToProperty(prop.id)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'দেখুন' : 'View'}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteListing(prop.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved / Favorites */}
        {activeTab === 'favorites' && (
          <div>
            {favoriteProperties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-base">
                  {lang === 'bn'
                    ? 'কোনো সংরক্ষিত প্রপার্টি নেই'
                    : 'No Saved Properties Yet'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-5">
                  {lang === 'bn'
                    ? 'পছন্দের প্রপার্টিগুলোতে হার্ট আইকনে ক্লিক করে সেভ করে রাখুন।'
                    : 'Click the heart icon on any property to save it for later review.'}
                </p>
                <button
                  onClick={() => setCurrentView('properties')}
                  className="px-5 py-2.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                >
                  {lang === 'bn' ? 'প্রপার্টি ব্রাউজ করুন' : 'Browse Properties'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProperties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Inquiries Received */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              {lang === 'bn' ? 'প্রাপ্ত বার্তা ও অনুসন্ধান' : 'Buyer Inquiries Received'}
            </h3>

            {inquiries.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                {lang === 'bn' ? 'কোনো নতুন অনুসন্ধান বার্তা নেই' : 'No inquiries received yet'}
              </p>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="py-4 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {inq.buyerName}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-emerald-800 font-medium">
                      {lang === 'bn' ? inq.propertyTitleBn : inq.propertyTitle}
                    </p>

                    <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      "{inq.message}"
                    </p>

                    <div className="flex items-center gap-4 text-slate-500 pt-1">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-emerald-700" />
                        <a href={`tel:${inq.buyerPhone}`} className="hover:underline">
                          {inq.buyerPhone}
                        </a>
                      </div>
                      {inq.buyerEmail && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-emerald-700" />
                          <a href={`mailto:${inq.buyerEmail}`} className="hover:underline">
                            {inq.buyerEmail}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-2xl shadow-2xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              {lang === 'bn' ? 'অ্যাকাউন্ট ও ব্যক্তিগত তথ্য' : 'Account & Profile Information'}
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}
                </label>
                <input
                  type="text"
                  readOnly
                  value={currentUser?.name || ''}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}
                </label>
                <input
                  type="email"
                  readOnly
                  value={currentUser?.email || ''}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  readOnly
                  value={currentUser?.phone || ''}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === 'bn' ? 'কোম্পানি / এজেন্সির নাম (যদি প্রযোজ্য)' : 'Company Name'}
                </label>
                <input
                  type="text"
                  readOnly
                  value={currentUser?.companyName || 'Independent Seller'}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <UserCheck className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'জাতীয় পরিচয়পত্র যাচাইকৃত অ্যাকাউন্ট' : 'NID Verified Account'}</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
