import { SAMPLE_PROPERTIES } from '../data/sampleProperties';
import { Property, PropertyFilter, Inquiry, ReportedAd } from '../types';
import { authService } from './authService';

const PROPERTIES_KEY = 'baribazar_properties';
const INQUIRIES_KEY = 'baribazar_inquiries';
const REPORTS_KEY = 'baribazar_reports';
const GUEST_FAVORITES_KEY = 'baribazar_guest_favorites';

function initProperties(): Property[] {
  try {
    const raw = localStorage.getItem(PROPERTIES_KEY);
    if (!raw) {
      localStorage.setItem(PROPERTIES_KEY, JSON.stringify(SAMPLE_PROPERTIES));
      return SAMPLE_PROPERTIES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(PROPERTIES_KEY, JSON.stringify(SAMPLE_PROPERTIES));
      return SAMPLE_PROPERTIES;
    }
    return parsed;
  } catch {
    return SAMPLE_PROPERTIES;
  }
}

function initInquiries(): Inquiry[] {
  try {
    const raw = localStorage.getItem(INQUIRIES_KEY);
    if (!raw) {
      const defaultInquiries: Inquiry[] = [
        {
          id: 'inq-1',
          propertyId: 'bb-101',
          propertyTitle: 'Luxury 4-Bed Lakefront Condominium in Gulshan-2',
          propertyTitleBn: 'গুলশান-২ লেকফ্রন্ট ৪ বেডের বিলাসবহুল কন্ডোমিনিয়াম',
          sellerId: 'sel-001',
          buyerName: 'Tanvir Hasan',
          buyerPhone: '+8801819556677',
          buyerEmail: 'tanvir@gmail.com',
          message: 'আমি এই ফ্ল্যাটটি দেখতে আগ্রহী। আগামী শুক্রবারে কি সাইট ভিজিট করা যাবে?',
          createdAt: '2026-03-21T10:30:00Z',
          status: 'new',
        },
      ];
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(defaultInquiries));
      return defaultInquiries;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function initReports(): ReportedAd[] {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    if (!raw) {
      const defaultReports: ReportedAd[] = [
        {
          id: 'rep-1',
          propertyId: 'bb-105',
          propertyTitle: 'Spacious 3-Bed Family Apartment in Dhanmondi 9/A',
          propertyTitleBn: 'ধানমন্ডি ৯/এ-তে ১৮৫০ বর্গফুটের প্রশস্ত ফ্যামিলি অ্যাপার্টমেন্ট',
          reporterName: 'Rafiqul Islam',
          reporterPhone: '+8801722334455',
          reason: 'wrong_price',
          reasonBn: 'মূল্য ভুল উল্লেখ করা হয়েছে',
          details: 'ফোন করার পর বিজ্ঞাপনে উল্লেখিত মূল্যের চেয়ে বেশি দাবি করা হয়েছে।',
          status: 'pending',
          createdAt: '2026-03-22T08:00:00Z',
        },
      ];
      localStorage.setItem(REPORTS_KEY, JSON.stringify(defaultReports));
      return defaultReports;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export const propertyService = {
  getProperties(filter?: PropertyFilter): Promise<Property[]> {
    return new Promise((resolve) => {
      let list = initProperties();

      if (filter) {
        if (filter.query && filter.query.trim()) {
          const q = filter.query.toLowerCase().trim();
          list = list.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.titleBn.toLowerCase().includes(q) ||
              p.location.area.toLowerCase().includes(q) ||
              p.location.areaBn.toLowerCase().includes(q) ||
              p.location.district.toLowerCase().includes(q) ||
              p.location.districtBn.toLowerCase().includes(q) ||
              p.location.division.toLowerCase().includes(q) ||
              p.location.divisionBn.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              p.descriptionBn.toLowerCase().includes(q)
          );
        }

        if (filter.listingType && filter.listingType !== 'all') {
          list = list.filter((p) => p.listingType === filter.listingType);
        }

        if (filter.category && filter.category !== 'all') {
          list = list.filter((p) => p.category === filter.category);
        }

        if (filter.division && filter.division !== 'all') {
          list = list.filter(
            (p) =>
              p.location.division.toLowerCase() === filter.division!.toLowerCase() ||
              p.location.divisionBn.toLowerCase() === filter.division!.toLowerCase()
          );
        }

        if (filter.district && filter.district !== 'all') {
          list = list.filter(
            (p) =>
              p.location.district.toLowerCase() === filter.district!.toLowerCase() ||
              p.location.districtBn.toLowerCase() === filter.district!.toLowerCase()
          );
        }

        if (filter.area && filter.area !== 'all') {
          list = list.filter(
            (p) =>
              p.location.area.toLowerCase() === filter.area!.toLowerCase() ||
              p.location.areaBn.toLowerCase() === filter.area!.toLowerCase()
          );
        }

        if (filter.minPrice && filter.minPrice > 0) {
          list = list.filter((p) => p.price >= filter.minPrice!);
        }

        if (filter.maxPrice && filter.maxPrice > 0) {
          list = list.filter((p) => p.price <= filter.maxPrice!);
        }

        if (filter.minBedrooms && filter.minBedrooms > 0) {
          list = list.filter(
            (p) => (p.specs.bedrooms || 0) >= filter.minBedrooms!
          );
        }

        if (filter.featuredOnly) {
          list = list.filter((p) => p.featured);
        }

        if (filter.sortBy) {
          if (filter.sortBy === 'price_low') {
            list.sort((a, b) => a.price - b.price);
          } else if (filter.sortBy === 'price_high') {
            list.sort((a, b) => b.price - a.price);
          } else if (filter.sortBy === 'newest') {
            list.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          } else if (filter.sortBy === 'size_high') {
            list.sort(
              (a, b) => (b.specs.sizeSqFt || 0) - (a.specs.sizeSqFt || 0)
            );
          }
        }
      }

      resolve(list);
    });
  },

  getPropertyById(id: string): Promise<Property | null> {
    return new Promise((resolve) => {
      const list = initProperties();
      const prop = list.find((p) => p.id === id);
      if (prop) {
        // Increment view count quietly
        prop.viewsCount = (prop.viewsCount || 0) + 1;
        localStorage.setItem(PROPERTIES_KEY, JSON.stringify(list));
      }
      resolve(prop || null);
    });
  },

  addProperty(
    newProp: Omit<
      Property,
      'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'status'
    >
  ): Promise<Property> {
    return new Promise((resolve) => {
      const list = initProperties();
      const created: Property = {
        ...newProp,
        id: `bb-${Date.now()}`,
        status: 'active',
        viewsCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedList = [created, ...list];
      localStorage.setItem(PROPERTIES_KEY, JSON.stringify(updatedList));
      window.dispatchEvent(new Event('baribazar_properties_change'));
      resolve(created);
    });
  },

  updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    return new Promise((resolve, reject) => {
      const list = initProperties();
      const index = list.findIndex((p) => p.id === id);
      if (index === -1) {
        reject(new Error('Property not found'));
        return;
      }
      const updated = {
        ...list[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      list[index] = updated;
      localStorage.setItem(PROPERTIES_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event('baribazar_properties_change'));
      resolve(updated);
    });
  },

  deleteProperty(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      let list = initProperties();
      list = list.filter((p) => p.id !== id);
      localStorage.setItem(PROPERTIES_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event('baribazar_properties_change'));
      resolve(true);
    });
  },

  // Favorites
  getFavorites(): string[] {
    const user = authService.getCurrentUser();
    if (user) {
      return user.savedPropertyIds || [];
    }
    try {
      const raw = localStorage.getItem(GUEST_FAVORITES_KEY);
      return raw ? JSON.parse(raw) : ['bb-101', 'bb-102'];
    } catch {
      return ['bb-101', 'bb-102'];
    }
  },

  toggleFavorite(propertyId: string): string[] {
    const user = authService.getCurrentUser();
    if (user) {
      return authService.updateSavedProperties(propertyId);
    }
    try {
      let saved = this.getFavorites();
      if (saved.includes(propertyId)) {
        saved = saved.filter((id) => id !== propertyId);
      } else {
        saved.push(propertyId);
      }
      localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(saved));
      window.dispatchEvent(new Event('baribazar_favorites_change'));
      return saved;
    } catch {
      return [];
    }
  },

  // Inquiries
  submitInquiry(
    inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>
  ): Promise<Inquiry> {
    return new Promise((resolve) => {
      const inquiries = initInquiries();
      const newInquiry: Inquiry = {
        ...inquiryData,
        id: `inq-${Date.now()}`,
        status: 'new',
        createdAt: new Date().toISOString(),
      };
      inquiries.unshift(newInquiry);
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
      resolve(newInquiry);
    });
  },

  getInquiries(): Promise<Inquiry[]> {
    return new Promise((resolve) => {
      resolve(initInquiries());
    });
  },

  // Report Listing
  reportListing(
    reportData: Omit<ReportedAd, 'id' | 'createdAt' | 'status'>
  ): Promise<ReportedAd> {
    return new Promise((resolve) => {
      const reports = initReports();
      const newReport: ReportedAd = {
        ...reportData,
        id: `rep-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      reports.unshift(newReport);
      localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
      resolve(newReport);
    });
  },

  getReportedAds(): Promise<ReportedAd[]> {
    return new Promise((resolve) => {
      resolve(initReports());
    });
  },

  updateReportStatus(id: string, status: ReportedAd['status']): Promise<void> {
    return new Promise((resolve) => {
      const reports = initReports();
      const idx = reports.findIndex((r) => r.id === id);
      if (idx !== -1) {
        reports[idx].status = status;
        localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
      }
      resolve();
    });
  },

  resetToDemoData(): void {
    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(SAMPLE_PROPERTIES));
    localStorage.removeItem(GUEST_FAVORITES_KEY);
    window.dispatchEvent(new Event('baribazar_properties_change'));
    window.dispatchEvent(new Event('baribazar_favorites_change'));
  },
};
