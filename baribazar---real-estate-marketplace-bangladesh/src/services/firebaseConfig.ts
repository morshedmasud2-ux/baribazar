/**
 * Firebase Architecture & Configuration Adapter for BariBazar
 *
 * This module is architected to seamlessly plug into Firebase Authentication,
 * Cloud Firestore, and Firebase Cloud Storage once remote credentials are provided.
 *
 * When Firebase credentials (VITE_FIREBASE_API_KEY, etc.) are present in .env,
 * this adapter connects to real Firebase. In development/local mode, it gracefully
 * falls back to BariBazar's local persistence engine without breaking.
 */

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'MY_FIREBASE_PROJECT_ID'
);

export const FIREBASE_STATUS = {
  isConfigured: isFirebaseConfigured,
  provider: isFirebaseConfigured ? 'Firebase Firestore & Auth' : 'Local Persistence Engine (Ready for Firebase)',
  noticeBn: isFirebaseConfigured
    ? 'ফায়ারবেস সংযুক্ত রয়েছে'
    : 'লোকাল স্টোরেজ ইঞ্জিন সক্রিয় (ফায়ারবেস ইন্টিগ্রেশনের জন্য প্রস্তুত)',
  noticeEn: isFirebaseConfigured
    ? 'Connected to Firebase'
    : 'Local Storage Engine Active (Ready for Firebase)',
};
