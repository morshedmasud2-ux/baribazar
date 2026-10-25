import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, User, PropertyFilter } from '../types';
import { authService } from '../services/authService';
import { propertyService } from '../services/propertyService';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;
  filters: PropertyFilter;
  setFilters: React.Dispatch<React.SetStateAction<PropertyFilter>>;
  resetFilters: () => void;
  favorites: string[];
  toggleFavorite: (propertyId: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register';
  setAuthModalTab: (tab: 'login' | 'register') => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  navigateToProperty: (propertyId: string) => void;
  navigateToListings: (initialFilter?: Partial<PropertyFilter>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const defaultFilters: PropertyFilter = {
  query: '',
  listingType: 'all',
  category: 'all',
  division: 'all',
  district: 'all',
  area: 'all',
  minPrice: 0,
  maxPrice: 0,
  minBedrooms: 0,
  sortBy: 'newest',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('baribazar_lang') as Language) || 'bn';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    authService.getCurrentUser()
  );

  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [filters, setFilters] = useState<PropertyFilter>(defaultFilters);
  const [favorites, setFavorites] = useState<string[]>(() =>
    propertyService.getFavorites()
  );

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    localStorage.setItem('baribazar_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const handleAuthChange = () => {
      const u = authService.getCurrentUser();
      setCurrentUser(u);
      setFavorites(propertyService.getFavorites());
    };

    const handleFavChange = () => {
      setFavorites(propertyService.getFavorites());
    };

    window.addEventListener('baribazar_auth_change', handleAuthChange);
    window.addEventListener('baribazar_favorites_change', handleFavChange);

    return () => {
      window.removeEventListener('baribazar_auth_change', handleAuthChange);
      window.removeEventListener('baribazar_favorites_change', handleFavChange);
    };
  }, []);

  const toggleLang = () => {
    setLang((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleFavorite = (propertyId: string) => {
    const updated = propertyService.toggleFavorite(propertyId);
    setFavorites(updated);
    const isSaved = updated.includes(propertyId);
    if (isSaved) {
      showToast(
        lang === 'bn' ? 'প্রপার্টি পছন্দের তালিকায় যোগ হয়েছে' : 'Saved to favorites',
        'success'
      );
    } else {
      showToast(
        lang === 'bn' ? 'পছন্দের তালিকা থেকে সরানো হয়েছে' : 'Removed from favorites',
        'info'
      );
    }
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const navigateToProperty = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setCurrentView('property_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToListings = (initialFilter?: Partial<PropertyFilter>) => {
    if (initialFilter) {
      setFilters((prev) => ({
        ...prev,
        ...initialFilter,
      }));
    }
    setCurrentView('properties');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        currentUser,
        setCurrentUser,
        currentView,
        setCurrentView,
        selectedPropertyId,
        setSelectedPropertyId,
        filters,
        setFilters,
        resetFilters,
        favorites,
        toggleFavorite,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        toasts,
        showToast,
        removeToast,
        navigateToProperty,
        navigateToListings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
