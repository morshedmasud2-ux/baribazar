import { Language } from '../types';

export function toBanglaDigits(num: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .replace(/[0-9]/g, (match) => bnDigits[parseInt(match, 10)]);
}

export function formatBDTPrice(
  amount: number,
  lang: Language = 'bn',
  isRent: boolean = false
): string {
  if (amount >= 10000000) {
    const crore = amount / 10000000;
    const formatted = crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(2);
    if (lang === 'bn') {
      return `৳ ${toBanglaDigits(formatted)} কোটি${isRent ? '/মাস' : ''}`;
    }
    return `BDT ${formatted} Crore${isRent ? '/mo' : ''}`;
  } else if (amount >= 100000) {
    const lakh = amount / 100000;
    const formatted = lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2);
    if (lang === 'bn') {
      return `৳ ${toBanglaDigits(formatted)} লক্ষ${isRent ? '/মাস' : ''}`;
    }
    return `BDT ${formatted} Lakh${isRent ? '/mo' : ''}`;
  } else {
    const formatted = amount.toLocaleString('en-US');
    if (lang === 'bn') {
      return `৳ ${toBanglaDigits(formatted)}${isRent ? '/মাস' : ''}`;
    }
    return `BDT ${formatted}${isRent ? '/mo' : ''}`;
  }
}

export function formatNumberWithLocale(num: number | string, lang: Language): string {
  if (lang === 'bn') {
    return toBanglaDigits(num);
  }
  return num.toString();
}

export function formatAreaSize(
  sqFt?: number,
  katha?: number,
  lang: Language = 'bn'
): string {
  if (katha && katha > 0) {
    const formatted = katha % 1 === 0 ? katha.toFixed(0) : katha.toFixed(1);
    return lang === 'bn'
      ? `${toBanglaDigits(formatted)} কাঠা`
      : `${formatted} Katha`;
  }
  if (sqFt && sqFt > 0) {
    return lang === 'bn'
      ? `${toBanglaDigits(sqFt.toLocaleString('en-US'))} বর্গফুট`
      : `${sqFt.toLocaleString('en-US')} sq ft`;
  }
  return '';
}
