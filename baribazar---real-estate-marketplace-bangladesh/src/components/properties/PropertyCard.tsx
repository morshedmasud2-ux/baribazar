import React from 'react';
import { Property } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatBDTPrice, formatAreaSize, formatNumberWithLocale } from '../../utils/formatters';
import { Heart, MapPin, Bed, Bath, ShieldCheck, Eye } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelect?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect }) => {
  const { lang, favorites, toggleFavorite, navigateToProperty } = useApp();
  const isSaved = favorites.includes(property.id);

  const handleClick = () => {
    if (onSelect) {
      onSelect(property);
    } else {
      navigateToProperty(property.id);
    }
  };

  const isRent = property.listingType === 'rent';
  const categoryLabels = {
    flat: { bn: 'ফ্ল্যাট', en: 'Flat' },
    house: { bn: 'বাড়ি', en: 'House' },
    land: { bn: 'জমি', en: 'Land' },
    commercial: { bn: 'বাণিজ্যিক', en: 'Commercial' },
  };

  const purposeLabels = {
    sale: { bn: 'বিক্রয়', en: 'For Sale' },
    rent: { bn: 'ভাড়া', en: 'For Rent' },
    land_sale: { bn: 'জমি বিক্রয়', en: 'Land Sale' },
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col overflow-hidden"
    >
      {/* Image Container with Fallback */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        <img
          src={property.images[0] || '/src/assets/images/prop_luxury_apartment_1792778449931.jpg'}
          alt={lang === 'bn' ? property.titleBn : property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => {
            // Fallback gracefully to default generated image
            (e.target as HTMLImageElement).src =
              '/src/assets/images/prop_luxury_apartment_1792778449931.jpg';
          }}
        />

        {/* Quiet Purpose indicator at top left - clean, no capsule pill */}
        <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded">
          <span>{lang === 'bn' ? purposeLabels[property.listingType].bn : purposeLabels[property.listingType].en}</span>
          <span className="mx-1 text-slate-400">·</span>
          <span>{lang === 'bn' ? categoryLabels[property.category].bn : categoryLabels[property.category].en}</span>
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm ${
            isSaved
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/90 text-slate-700 hover:text-rose-600 hover:bg-white'
          }`}
          aria-label={isSaved ? 'Remove from saved' : 'Save property'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Views counter overlay at bottom right */}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-slate-200 text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
          <Eye className="w-3 h-3" />
          <span className="tabular-nums">
            {formatNumberWithLocale(property.viewsCount || 0, lang)}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Price Header with Tabular Digits */}
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-lg font-bold text-emerald-900 tracking-tight tabular-nums">
              {formatBDTPrice(property.price, lang, isRent)}
            </h3>
            {property.isNegotiable && (
              <span className="text-[11px] text-slate-500 font-medium">
                {lang === 'bn' ? '(আলোচনা সাপেক্ষ)' : '(Negotiable)'}
              </span>
            )}
          </div>

          {/* Title */}
          <h4 className="mt-1 text-sm font-semibold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
            {lang === 'bn' ? property.titleBn : property.title}
          </h4>

          {/* Location line - unboxed metadata */}
          <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {lang === 'bn'
                ? `${property.location.areaBn}, ${property.location.divisionBn}`
                : `${property.location.area}, ${property.location.division}`}
            </span>
          </div>
        </div>

        {/* Specs Strip - Zero pill rule: subtle divider with unboxed specs */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-3">
            {property.specs.bedrooms !== undefined && property.specs.bedrooms > 0 && (
              <div className="flex items-center gap-1" title="Bedrooms">
                <Bed className="w-3.5 h-3.5 text-slate-400" />
                <span className="tabular-nums font-medium">
                  {formatNumberWithLocale(property.specs.bedrooms, lang)}{' '}
                  {lang === 'bn' ? 'বেড' : 'Bed'}
                </span>
              </div>
            )}

            {property.specs.bathrooms !== undefined && property.specs.bathrooms > 0 && (
              <div className="flex items-center gap-1" title="Bathrooms">
                <Bath className="w-3.5 h-3.5 text-slate-400" />
                <span className="tabular-nums font-medium">
                  {formatNumberWithLocale(property.specs.bathrooms, lang)}{' '}
                  {lang === 'bn' ? 'বাথ' : 'Bath'}
                </span>
              </div>
            )}
          </div>

          {/* Area Measurement */}
          <div className="font-medium text-slate-700 tabular-nums">
            {formatAreaSize(property.specs.sizeSqFt, property.specs.sizeKatha, lang)}
          </div>
        </div>

        {/* Seller Info line */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1 truncate max-w-[170px]">
            {property.seller.verified && (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            )}
            <span className="truncate">
              {lang === 'bn' ? property.seller.nameBn : property.seller.name}
            </span>
          </div>

          <span className="text-emerald-700 font-medium">
            {lang === 'bn' ? property.seller.roleBn : property.seller.role}
          </span>
        </div>
      </div>
    </div>
  );
};
