/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { AuthModal } from './components/auth/AuthModal';

// Views
import { HeroSearch } from './components/home/HeroSearch';
import { CategoryGrid } from './components/home/CategoryGrid';
import { FeaturedListings } from './components/home/FeaturedListings';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { PropertyList } from './components/properties/PropertyList';
import { PropertyDetail } from './components/properties/PropertyDetail';
import { AddPropertyModal } from './components/properties/AddPropertyModal';
import { FavoritesPage } from './components/properties/FavoritesPage';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import {
  AboutPage,
  ContactPage,
  PrivacyPolicyPage,
  TermsPage,
} from './components/pages/StaticPages';

const MainContent: React.FC = () => {
  const { currentView, lang } = useApp();

  // SEO Page Title synchronization
  useEffect(() => {
    const titles: Record<string, { bn: string; en: string }> = {
      home: {
        bn: 'BariBazar | বাড়ি বাজার - রিয়েল এস্টেট মার্কেটপ্লেস বাংলাদেশ',
        en: 'BariBazar - Real Estate Marketplace Bangladesh',
      },
      properties: {
        bn: 'সকল প্রপার্টি লিস্টিং | বাড়ি বাজার',
        en: 'All Property Listings | BariBazar',
      },
      property_detail: {
        bn: 'প্রপার্টি বিস্তারিত বিবরণ | বাড়ি বাজার',
        en: 'Property Details | BariBazar',
      },
      add_property: {
        bn: 'নতুন বিজ্ঞাপন দিন | বাড়ি বাজার',
        en: 'Post New Property Ad | BariBazar',
      },
      favorites: {
        bn: 'সংরক্ষিত প্রপার্টি | বাড়ি বাজার',
        en: 'Saved Properties | BariBazar',
      },
      dashboard: {
        bn: 'ইউজার ড্যাশবোর্ড | বাড়ি বাজার',
        en: 'User Dashboard | BariBazar',
      },
      admin: {
        bn: 'অ্যাডমিন কনসোল | বাড়ি বাজার',
        en: 'Admin Console | BariBazar',
      },
      about: {
        bn: 'আমাদের সম্পর্কে | বাড়ি বাজার',
        en: 'About Us | BariBazar',
      },
      contact: {
        bn: 'যোগাযোগ ও সাপোর্ট | বাড়ি বাজার',
        en: 'Contact Us | BariBazar',
      },
      privacy: {
        bn: 'গোপনীয়তা নীতি | বাড়ি বাজার',
        en: 'Privacy Policy | BariBazar',
      },
      terms: {
        bn: 'ব্যবহারের শর্তাবলী | বাড়ি বাজার',
        en: 'Terms & Conditions | BariBazar',
      },
    };

    const currentTitle =
      titles[currentView]?.[lang] || 'BariBazar - Real Estate Marketplace Bangladesh';
    document.title = currentTitle;
  }, [currentView, lang]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9]">
      <Header />

      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSearch />
            <CategoryGrid />
            <FeaturedListings />
            <WhyChooseUs />
          </>
        )}

        {currentView === 'properties' && <PropertyList />}
        {currentView === 'property_detail' && <PropertyDetail />}
        {currentView === 'add_property' && <AddPropertyModal />}
        {currentView === 'favorites' && <FavoritesPage />}
        {currentView === 'dashboard' && <UserDashboard />}
        {currentView === 'admin' && <AdminDashboard />}
        {currentView === 'about' && <AboutPage />}
        {currentView === 'contact' && <ContactPage />}
        {currentView === 'privacy' && <PrivacyPolicyPage />}
        {currentView === 'terms' && <TermsPage />}
      </main>

      <Footer />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
