import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { authService, DEMO_USERS } from '../../services/authService';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, Building } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    lang,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    setCurrentUser,
    showToast,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'user' | 'agent'>('user');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const user = await authService.login(email);
      setCurrentUser(user);
      setIsAuthModalOpen(false);
      showToast(
        lang === 'bn'
          ? `স্বাগতম, ${user.name}! লগইন সফল হয়েছে।`
          : `Welcome back, ${user.name}!`,
        'success'
      );
    } catch {
      showToast('Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setLoading(true);
    try {
      const user = await authService.register({
        name,
        email,
        phone: phone || '+8801700000000',
        role,
      });
      setCurrentUser(user);
      setIsAuthModalOpen(false);
      showToast(
        lang === 'bn'
          ? 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!'
          : 'Registration successful!',
        'success'
      );
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (userId: string) => {
    setLoading(true);
    try {
      const user = await authService.loginAsDemo(userId);
      setCurrentUser(user);
      setIsAuthModalOpen(false);
      showToast(
        lang === 'bn'
          ? `${user.name} হিসেবে ডেমো লগইন সম্পন্ন!`
          : `Logged in as ${user.name} (${user.role})`,
        'success'
      );
    } catch {
      showToast('Demo login error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close auth dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center mx-auto mb-2 shadow-sm">
            <Building className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {authModalTab === 'login'
              ? lang === 'bn'
                ? 'বাড়ি বাজারে লগইন করুন'
                : 'Sign In to BariBazar'
              : lang === 'bn'
              ? 'নতুন অ্যাকাউন্ট নিবন্ধন করুন'
              : 'Create an Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'bn'
              ? 'বিজ্ঞাপন দিতে বা পছন্দের বাড়ি সংরক্ষণ করতে সাইন ইন করুন'
              : 'Access your listings, inquiries, and saved favorites'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold mb-6">
          <button
            type="button"
            onClick={() => setAuthModalTab('login')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              authModalTab === 'login'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'bn' ? 'লগইন' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => setAuthModalTab('register')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              authModalTab === 'register'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'bn' ? 'রেজিস্ট্রেশন' : 'Register'}
          </button>
        </div>

        {/* Login Form */}
        {authModalTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'ইমেইল অথবা মোবাইল নম্বর' : 'Email or Mobile Number'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="morshed@baribazar.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all mt-2"
            >
              {loading
                ? lang === 'bn'
                  ? 'প্রবেশ করা হচ্ছে...'
                  : 'Signing in...'
                : lang === 'bn'
                ? 'লগইন করুন'
                : 'Sign In'}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'আপনার পূর্ণ নাম *' : 'Full Name *'}
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Morshed Masud"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'ইমেইল ঠিকানা *' : 'Email Address *'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'মোবাইল নম্বর *' : 'Mobile Phone *'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1711..."
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'bn' ? 'অ্যাকাউন্টের ধরন' : 'Account Type'}
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`py-2 rounded-lg font-medium border text-center ${
                    role === 'user'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {lang === 'bn' ? 'ক্রেতা / ভাড়াটিয়া' : 'Buyer / Tenant'}
                </button>
                <button
                  type="button"
                  onClick={() => setRole('agent')}
                  className={`py-2 rounded-lg font-medium border text-center ${
                    role === 'agent'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {lang === 'bn' ? 'মালিক / এজেন্ট' : 'Owner / Agent'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-all mt-3"
            >
              {loading
                ? lang === 'bn'
                  ? 'নিবন্ধন হচ্ছে...'
                  : 'Registering...'
                : lang === 'bn'
                ? 'অ্যাকাউন্ট তৈরি করুন'
                : 'Create Account'}
            </button>
          </form>
        )}

        {/* Quick Demo Switcher Section */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <span className="block text-center text-[11px] font-semibold text-slate-400 mb-2.5">
            {lang === 'bn'
              ? 'বা দ্রুত টেস্ট করতে নিচের ডেমো প্রোফাইলে ক্লিক করুন:'
              : 'Or test instantly with a demo profile:'}
          </span>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('user-seller-01')}
              className="w-full text-left p-2 rounded-lg bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/60 text-xs text-emerald-950 flex items-center justify-between transition-colors"
            >
              <div className="truncate">
                <span className="font-bold">Morshed Masud</span>
                <span className="text-[11px] text-emerald-700 block">
                  {lang === 'bn' ? 'বিক্রেতা / এজেন্ট প্রোফাইল' : 'Seller / Agent Profile'}
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-800">Login →</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('user-buyer-02')}
              className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-800 flex items-center justify-between transition-colors"
            >
              <div className="truncate">
                <span className="font-bold">Tanvir Hasan</span>
                <span className="text-[11px] text-slate-500 block">
                  {lang === 'bn' ? 'ক্রেতা / ভাড়াটিয়া প্রোফাইল' : 'Buyer / Tenant Profile'}
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-700">Login →</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('user-admin-03')}
              className="w-full text-left p-2 rounded-lg bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/60 text-xs text-amber-950 flex items-center justify-between transition-colors"
            >
              <div className="truncate">
                <span className="font-bold">BariBazar Super Admin</span>
                <span className="text-[11px] text-amber-800 block">
                  {lang === 'bn' ? 'অ্যাডমিন কনসোল অ্যাক্সেস' : 'Full Admin Moderation Access'}
                </span>
              </div>
              <span className="text-[11px] font-bold text-amber-800">Login →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
