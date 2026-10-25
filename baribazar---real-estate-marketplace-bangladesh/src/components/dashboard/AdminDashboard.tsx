import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { propertyService } from '../../services/propertyService';
import { authService, DEMO_USERS } from '../../services/authService';
import { Property, ReportedAd, User } from '../../types';
import { formatBDTPrice, formatNumberWithLocale } from '../../utils/formatters';
import {
  ShieldAlert,
  Building,
  Users,
  Flag,
  CheckCircle,
  XCircle,
  Trash2,
  Star,
  Eye,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { lang, setCurrentView, navigateToProperty, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'listings' | 'reports' | 'users'>(
    'reports'
  );
  const [properties, setProperties] = useState<Property[]>([]);
  const [reportedAds, setReportedAds] = useState<ReportedAd[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const props = await propertyService.getProperties();
        setProperties(props);

        const reports = await propertyService.getReportedAds();
        setReportedAds(reports);

        const allUsers = authService.getAllUsers();
        setUsers(allUsers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleChange = () => fetchData();
    window.addEventListener('baribazar_properties_change', handleChange);
    return () => window.removeEventListener('baribazar_properties_change', handleChange);
  }, []);

  const handleToggleFeatured = async (prop: Property) => {
    try {
      await propertyService.updateProperty(prop.id, {
        featured: !prop.featured,
      });
      showToast(
        lang === 'bn'
          ? !prop.featured
            ? 'লিস্টিংটি ফিচার্ড করা হয়েছে'
            : 'ফিচার্ড স্ট্যাটাস সরানো হয়েছে'
          : !prop.featured
          ? 'Property marked as Featured'
          : 'Featured status removed',
        'success'
      );
    } catch {
      showToast('Error updating listing', 'error');
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (confirm(lang === 'bn' ? 'অ্যাডমিন হিসেবে নিশ্চিতভাবে এই বিজ্ঞাপনটি মুছে ফেলবেন?' : 'Are you sure you want to permanently delete this listing?')) {
      await propertyService.deleteProperty(id);
      showToast(
        lang === 'bn' ? 'বিজ্ঞাপন প্ল্যাটফর্ম থেকে মুছে ফেলা হয়েছে' : 'Listing removed',
        'info'
      );
    }
  };

  const handleDismissReport = async (reportId: string) => {
    await propertyService.updateReportStatus(reportId, 'dismissed');
    setReportedAds((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'dismissed' } : r))
    );
    showToast(
      lang === 'bn' ? 'রিপোর্টটি বাতিল (Dismiss) করা হয়েছে' : 'Report dismissed',
      'info'
    );
  };

  const handleTakeDownListing = async (reportId: string, propertyId: string) => {
    await propertyService.deleteProperty(propertyId);
    await propertyService.updateReportStatus(reportId, 'listing_removed');
    setReportedAds((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'listing_removed' } : r))
    );
    showToast(
      lang === 'bn'
        ? 'বিজ্ঞাপনটি মুছে ফেলা হয়েছে এবং রিপোর্ট নিষ্পত্তি হয়েছে'
        : 'Listing removed and report resolved',
      'success'
    );
  };

  const pendingReportsCount = reportedAds.filter((r) => r.status === 'pending').length;

  return (
    <div className="bg-[#F8FAF9] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="p-2 hover:bg-white rounded-lg border border-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <span>{lang === 'bn' ? 'বাড়ি বাজার অ্যাডমিন কনসোল' : 'BariBazar Admin Console'}</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                  Super Admin
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'bn'
                  ? 'ব্যবহারকারী, বিজ্ঞাপন ও রিপোর্ট পর্যালোচনার কেন্দ্রীয় নিয়ন্ত্রণ প্যানেল'
                  : 'Moderation, listings control, and user directory management'}
              </p>
            </div>
          </div>
        </div>

        {/* Top Metric Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {lang === 'bn' ? 'মোট বিজ্ঞাপন' : 'Total Listings'}
              </span>
              <Building className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
              {formatNumberWithLocale(properties.length, lang)}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {lang === 'bn' ? 'রিপোর্ট পেন্ডিং' : 'Pending Reports'}
              </span>
              <Flag className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600 mt-2 tabular-nums">
              {formatNumberWithLocale(pendingReportsCount, lang)}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {lang === 'bn' ? 'নিবন্ধিত ব্যবহারকারী' : 'Registered Users'}
              </span>
              <Users className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
              {formatNumberWithLocale(users.length, lang)}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {lang === 'bn' ? 'ফিচার্ড প্রপার্টি' : 'Featured Deals'}
              </span>
              <Star className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2 tabular-nums">
              {formatNumberWithLocale(properties.filter((p) => p.featured).length, lang)}
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 text-sm font-medium">
          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'reports'
                ? 'border-emerald-700 text-emerald-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Flag className="w-4 h-4 text-red-500" />
            <span>{lang === 'bn' ? 'রিপোর্টকৃত বিজ্ঞাপন' : 'Reported Ads Queue'}</span>
            {pendingReportsCount > 0 && (
              <span className="text-xs bg-red-100 text-red-700 font-bold px-1.5 py-0.2 rounded-full">
                {pendingReportsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'listings'
                ? 'border-emerald-700 text-emerald-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>{lang === 'bn' ? 'সকল প্রপার্টি পরিচালনা' : 'Listings Moderation'}</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-emerald-700 text-emerald-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{lang === 'bn' ? 'ব্যবহারকারী তালিকা' : 'User Directory'}</span>
          </button>
        </div>

        {/* Tab 1: Reported Ads */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              {lang === 'bn' ? 'ব্যবহারকারীদের অভিযোগ ও রিপোর্ট' : 'Reported Listings & Complaints'}
            </h3>

            {reportedAds.length === 0 ? (
              <p className="text-slate-400 text-xs py-8 text-center">
                {lang === 'bn' ? 'কোনো সক্রিয় রিপোর্ট নেই' : 'No active reports'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">প্রপার্টি (Property)</th>
                      <th className="p-3">অভিযোগের কারণ (Reason)</th>
                      <th className="p-3">বিস্তারিত (Details)</th>
                      <th className="p-3">রিপোর্টার (Reporter)</th>
                      <th className="p-3">স্ট্যাটাস (Status)</th>
                      <th className="p-3 text-right">পদক্ষেপ (Action)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reportedAds.map((rep) => (
                      <tr key={rep.id} className="hover:bg-slate-50/60">
                        <td className="p-3 font-semibold text-slate-900 max-w-[180px] truncate">
                          {rep.propertyTitleBn || rep.propertyTitle}
                          <span className="block text-[10px] text-slate-400">
                            ID: {rep.propertyId}
                          </span>
                        </td>
                        <td className="p-3 text-red-600 font-medium">
                          {rep.reasonBn || rep.reason}
                        </td>
                        <td className="p-3 text-slate-600 max-w-[200px] line-clamp-2">
                          {rep.details}
                        </td>
                        <td className="p-3 text-slate-500">
                          {rep.reporterName} ({rep.reporterPhone})
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              rep.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : rep.status === 'listing_removed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {rep.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2 whitespace-nowrap">
                          {rep.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleDismissReport(rep.id)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
                              >
                                {lang === 'bn' ? 'বাতিল' : 'Dismiss'}
                              </button>
                              <button
                                onClick={() => handleTakeDownListing(rep.id, rep.propertyId)}
                                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-medium"
                              >
                                {lang === 'bn' ? 'মুছে ফেলুন' : 'Take Down'}
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Listings Moderation */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              {lang === 'bn' ? 'প্ল্যাটফর্মের সকল বিজ্ঞাপন' : 'All Platform Listings'}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">প্রপার্টি</th>
                    <th className="p-3">ক্যাটাগরি</th>
                    <th className="p-3">মূল্য</th>
                    <th className="p-3">বিক্রেতা</th>
                    <th className="p-3">ফিচার্ড</th>
                    <th className="p-3">ভিউ সংখ্যা</th>
                    <th className="p-3 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {properties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-slate-50/60">
                      <td className="p-3 font-semibold text-slate-900 max-w-[200px] truncate">
                        <button
                          onClick={() => navigateToProperty(prop.id)}
                          className="hover:underline text-left"
                        >
                          {lang === 'bn' ? prop.titleBn : prop.title}
                        </button>
                        <span className="block text-[10px] text-slate-400">
                          {prop.location.area}, {prop.location.division}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 capitalize">
                        {prop.category} ({prop.listingType})
                      </td>
                      <td className="p-3 font-bold text-emerald-900 tabular-nums">
                        {formatBDTPrice(prop.price, lang, prop.listingType === 'rent')}
                      </td>
                      <td className="p-3 text-slate-600">
                        {prop.seller.name}
                        <span className="block text-[10px] text-slate-400">
                          {prop.seller.phone}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleFeatured(prop)}
                          className={`p-1 rounded ${
                            prop.featured
                              ? 'text-amber-500 hover:text-amber-600'
                              : 'text-slate-300 hover:text-amber-500'
                          }`}
                          title="Toggle Featured"
                        >
                          <Star className={`w-4 h-4 ${prop.featured ? 'fill-amber-500' : ''}`} />
                        </button>
                      </td>
                      <td className="p-3 text-slate-600 tabular-nums">
                        {formatNumberWithLocale(prop.viewsCount || 0, lang)}
                      </td>
                      <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => navigateToProperty(prop.id)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteListing(prop.id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Users */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              {lang === 'bn' ? 'ব্যবহারকারী ডিরেক্টরি' : 'Registered Users Directory'}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">নাম (Name)</th>
                    <th className="p-3">ইমেইল (Email)</th>
                    <th className="p-3">ফোন (Phone)</th>
                    <th className="p-3">রোল (Role)</th>
                    <th className="p-3">নিবন্ধন তারিখ</th>
                    <th className="p-3">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60">
                      <td className="p-3 font-semibold text-slate-900">{u.name}</td>
                      <td className="p-3 text-slate-600">{u.email}</td>
                      <td className="p-3 text-slate-600">{u.phone}</td>
                      <td className="p-3">
                        <span className="capitalize font-medium text-emerald-800">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
