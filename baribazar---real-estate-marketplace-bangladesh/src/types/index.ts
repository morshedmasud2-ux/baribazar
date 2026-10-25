export type Language = 'bn' | 'en';

export type PropertyCategory = 'flat' | 'house' | 'land' | 'commercial';
export type ListingType = 'sale' | 'rent' | 'land_sale';

export type PropertyStatus = 'active' | 'pending' | 'sold' | 'rented' | 'rejected';

export interface LocationData {
  division: string;
  divisionBn: string;
  district: string;
  districtBn: string;
  area: string;
  areaBn: string;
  address: string;
  addressBn: string;
  zipCode?: string;
}

export interface PropertySpecs {
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  sizeSqFt?: number;
  sizeKatha?: number; // Common in Bangladesh for land & houses
  floorNumber?: number;
  totalFloors?: number;
  parkingSpaces?: number;
  facing?: 'North' | 'South' | 'East' | 'West' | 'উত্তর' | 'দক্ষিণ' | 'পূর্ব' | 'পশ্চিম';
  completionYear?: number;
  furnishingStatus?: 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished' | 'আসবাবহীন' | 'আংশিক সজ্জিত' | 'সম্পূর্ণ সজ্জিত';
}

export interface SellerInfo {
  id: string;
  name: string;
  nameBn: string;
  role: 'Owner' | 'Agent' | 'Developer';
  roleBn: string;
  phone: string;
  whatsapp: string;
  avatar?: string;
  verified: boolean;
  memberSince: string;
}

export interface Property {
  id: string;
  title: string;
  titleBn: string;
  slug: string;
  description: string;
  descriptionBn: string;
  category: PropertyCategory;
  listingType: ListingType;
  price: number; // in BDT
  pricePerUnit?: string; // e.g. "৳১০,৫০০/বর্গফুট"
  isNegotiable: boolean;
  serviceCharge?: number; // for rent, in BDT
  location: LocationData;
  specs: PropertySpecs;
  features: string[]; // Amenities keys
  featuresBn: string[];
  images: string[];
  featured: boolean;
  status: PropertyStatus;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
  seller: SellerInfo;
}

export interface PropertyFilter {
  query?: string;
  listingType?: ListingType | 'all';
  category?: PropertyCategory | 'all';
  division?: string;
  district?: string;
  area?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  minSize?: number;
  maxSize?: number;
  featuredOnly?: boolean;
  sortBy?: 'newest' | 'price_low' | 'price_high' | 'size_high';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'agent' | 'admin';
  avatar?: string;
  savedPropertyIds: string[];
  companyName?: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyTitleBn: string;
  sellerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied';
}

export interface ReportedAd {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyTitleBn: string;
  reporterName: string;
  reporterPhone: string;
  reason: 'fraud' | 'wrong_price' | 'already_sold' | 'fake_location' | 'inappropriate' | 'other';
  reasonBn: string;
  details: string;
  status: 'pending' | 'reviewed' | 'dismissed' | 'listing_removed';
  createdAt: string;
}
