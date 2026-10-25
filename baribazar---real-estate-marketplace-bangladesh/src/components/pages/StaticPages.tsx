import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
  Users,
  Target,
  Award,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { lang, setCurrentView } = useApp();

  return (
    <div className="bg-[#F8FAF9] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {lang === 'bn' ? 'বাড়ি বাজার সম্পর্কে' : 'About BariBazar'}
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            {lang === 'bn'
              ? 'বাংলাদেশের রিয়েল এস্টেট সেক্টরে স্বচ্ছতা, নিরাপত্তা ও প্রযুক্তিভিত্তিক আধুনিক সেবা'
              : 'Pioneering trust, transparency, and technology in Bangladesh real estate'}
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-2xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            {lang === 'bn' ? 'আমাদের লক্ষ্য ও উদ্দেশ্য' : 'Our Mission'}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {lang === 'bn'
              ? 'বাড়ি বাজার (BariBazar) হলো বাংলাদেশের আবাসন ক্রেতা, বিক্রেতা, ডেভেলপার এবং ভাড়াটিয়াদের এক নির্ভরযোগ্য ডিজিটাল সেতু। ঐতিহ্যবাহী রিয়েল এস্টেট বাজারে ব্রোকারদের অতিরিক্ত কমিশন এবং ভুয়া বিজ্ঞাপনের ঝামেলা দূর করতে আমরা প্রতিটি বিজ্ঞাপন যাচাই করি।'
              : 'BariBazar is Bangladesh’s dedicated prop-tech platform engineered to eliminate predatory middleman fees, fragmented listings, and unverified land records. We verify title deeds, RAJUK approvals, and direct seller authentications.'}
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
            <ShieldCheck className="w-8 h-8 text-emerald-700 mb-3" />
            <h3 className="font-bold text-slate-900 text-base mb-1">
              {lang === 'bn' ? 'শতভাগ যাচাই' : 'Verified Listings'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === 'bn'
                ? 'বিজ্ঞাপন প্রকাশের পূর্বে নামজারি ও অনুমোদিত নকশার তথ্য যাচাই।'
                : 'Thorough screening of deeds, RAJUK/CDA sanctions, and seller identity.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
            <Target className="w-8 h-8 text-emerald-700 mb-3" />
            <h3 className="font-bold text-slate-900 text-base mb-1">
              {lang === 'bn' ? 'সরাসরি যোগাযোগ' : 'Direct Connect'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === 'bn'
                ? 'কোনো তৃতীয় পক্ষ ছাড়া সরাসরি মালিক বা ডেভেলপারের সাথে কথা বলুন।'
                : 'Instant one-click phone call and WhatsApp chat directly with verified owners.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
            <Award className="w-8 h-8 text-emerald-700 mb-3" />
            <h3 className="font-bold text-slate-900 text-base mb-1">
              {lang === 'bn' ? 'আইনি নিরাপত্তা' : 'Legal Advisory'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === 'bn'
                ? 'জমি রেজিস্ট্রেশন ও মিউটেশন সংক্রান্ত পেশাদার আইনি পরামর্শ।'
                : 'Dedicated land-law attorneys assisting in sub-registry deed transfers.'}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <button
            onClick={() => setCurrentView('properties')}
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            {lang === 'bn' ? 'প্রপার্টি অনুসন্ধান করুন' : 'Browse Properties Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { lang, showToast } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast(
      lang === 'bn'
        ? 'আপনার বার্তা সফলভাবে পাঠানো হয়েছে! আমাদের প্রতিনিধি দ্রুত যোগাযোগ করবে।'
        : 'Message sent! Our support team will reach out soon.',
      'success'
    );
  };

  return (
    <div className="bg-[#F8FAF9] min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {lang === 'bn' ? 'আমাদের সাথে যোগাযোগ করুন' : 'Contact BariBazar'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            {lang === 'bn'
              ? 'যেকোনো জিজ্ঞাসা, বিজ্ঞাপন সংক্রান্ত সহায়তা বা আইনি পরামর্শের জন্য আমাদের জানান'
              : 'We are here to assist with listing support, partnerships, or legal inquiries'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 space-y-6">
            <h2 className="text-base font-bold text-white pb-3 border-b border-slate-800">
              {lang === 'bn' ? 'কর্পোরেট প্রধান কার্যালয়' : 'Corporate Office'}
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {lang === 'bn'
                    ? 'লেভেল ৭, রোড ১১, গুলশান-২, ঢাকা-১২১২, বাংলাদেশ'
                    : 'Level 7, Road 11, Gulshan-2, Dhaka-1212, Bangladesh'}
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+8809612002274" className="hover:text-white">
                  +880 9612-BARI (2274)
                </a>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:support@baribazar.com" className="hover:text-white">
                  support@baribazar.com
                </a>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {lang === 'bn'
                    ? 'শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - রাত ৮:০০'
                    : 'Sat - Thu: 9:00 AM - 8:00 PM'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              <p>
                {lang === 'bn'
                  ? 'জরুরি অভিযোগের জন্য WhatsApp হটলাইন: +880 1711-223344'
                  : 'Emergency WhatsApp hotline: +880 1711-223344'}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">
                  {lang === 'bn' ? 'বার্তাটি সফলভাবে পাঠানো হয়েছে!' : 'Message Received!'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'bn'
                    ? 'আমাদের কাস্টমার কেয়ার টিম অতি দ্রুত আপনার সাথে যোগাযোগ করবে।'
                    : 'Our customer support officer will respond within 24 business hours.'}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                >
                  {lang === 'bn' ? 'অন্য আরেকটি বার্তা পাঠান' : 'Send Another Message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {lang === 'bn' ? 'আপনার নাম *' : 'Your Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Masud Alam"
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {lang === 'bn' ? 'মোবাইল নম্বর *' : 'Phone Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 1..."
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'বিষয়' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={
                      lang === 'bn' ? 'যেমন: বিজ্ঞাপন যাচাই বা সাধারণ প্রশ্ন' : 'e.g. Verification support'
                    }
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === 'bn' ? 'বার্তা লিখুন *' : 'Your Message *'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      lang === 'bn'
                        ? 'আপনার প্রশ্ন বা অনুসন্ধান এখানে বিস্তারিত লিখুন...'
                        : 'Type your message details here...'
                    }
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'বার্তা পাঠান' : 'Send Message'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicyPage: React.FC = () => {
  const { lang } = useApp();

  return (
    <div className="bg-[#F8FAF9] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-2xs space-y-6 text-sm">
        <h1 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-4">
          {lang === 'bn' ? 'গোপনীয়তা নীতি (Privacy Policy)' : 'Privacy Policy'}
        </h1>

        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            {lang === 'bn'
              ? 'বাড়ি বাজার (BariBazar) ব্যবহারকারীদের তথ্যের গোপনীয়তা রক্ষায় দৃঢ় প্রতিশ্রুতিবদ্ধ। এই নীতিমালায় ব্যাখ্যা করা হয়েছে আমরা কীভাবে আপনার তথ্য সংগ্রহ, সংরক্ষণ ও ব্যবহার করি।'
              : 'BariBazar is committed to protecting your privacy and personal data in accordance with the Information and Communication Technology (ICT) Act of Bangladesh.'}
          </p>

          <h3 className="text-sm font-bold text-slate-900 pt-2">
            {lang === 'bn' ? '১. সংগৃহীত তথ্যাবলী' : '1. Information We Collect'}
          </h3>
          <p>
            {lang === 'bn'
              ? 'বিজ্ঞাপন প্রকাশ বা যোগাযোগের উদ্দেশ্যে আমরা আপনার নাম, ইমেইল, মোবাইল নম্বর এবং প্রপার্টির ভৌগোলিক অবস্থান ও মালিকানা সংক্রান্ত তথ্য সংগ্রহ করি।'
              : 'We collect user registration details (name, email, verified mobile phone number) and property descriptions submitted for listing.'}
          </p>

          <h3 className="text-sm font-bold text-slate-900 pt-2">
            {lang === 'bn' ? '২. তথ্যের নিরাপত্তা ও ব্যবহার' : '2. Data Usage & Security'}
          </h3>
          <p>
            {lang === 'bn'
              ? 'আমরা কখনো আপনার ব্যক্তিগত তথ্য তৃতীয় কোনো বিজ্ঞাপনদাতা বা মার্কেটিং এজেন্সির কাছে বিক্রি করি না। শুধুমাত্র ক্রেতা ও বিক্রেতার প্রত্যক্ষ যোগাযোগের সুবিধার্থে মোবাইল নম্বর প্রদর্শিত হয়।'
              : 'Your personal information is never sold to third parties. Contact numbers are solely displayed on active listings for genuine buyer-seller interaction.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  const { lang } = useApp();

  return (
    <div className="bg-[#F8FAF9] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-2xs space-y-6 text-sm">
        <h1 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-4">
          {lang === 'bn' ? 'ব্যবহারের শর্তাবলী (Terms & Conditions)' : 'Terms of Service'}
        </h1>

        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            {lang === 'bn'
              ? 'বাড়ি বাজার প্ল্যাটফর্ম ব্যবহারের মাধ্যমে আপনি নিচের শর্তাবলী মেনে নিতে সম্মত হচ্ছেন।'
              : 'By using BariBazar, you agree to comply with our listing policies and Bangladesh property laws.'}
          </p>

          <h3 className="text-sm font-bold text-slate-900 pt-2">
            {lang === 'bn' ? '১. বিজ্ঞাপনের সত্যতা ও দায়িত্ব' : '1. Listing Authenticity'}
          </h3>
          <p>
            {lang === 'bn'
              ? 'বিজ্ঞাপনদাতাকে অবশ্যই প্রপার্টির বৈধ মালিক অথবা অনুমোদিত প্রতিনিধি হতে হবে। কোনো প্রকার ভুয়া বা প্রতারণামূলক তথ্য দিলে বিজ্ঞাপন তাৎক্ষণিকভাবে বাতিল এবং ব্যবহারকারীকে ব্লক করা হবে।'
              : 'All listers must possess legal authority or power-of-attorney to advertise properties. Fraudulent listings will be permanently taken down and reported.'}
          </p>

          <h3 className="text-sm font-bold text-slate-900 pt-2">
            {lang === 'bn' ? '২. আর্থিক লেনদেন ও সতর্কতা' : '2. Transactions & Disclaimer'}
          </h3>
          <p>
            {lang === 'bn'
              ? 'বাড়ি বাজার ক্রেতা ও বিক্রেতার মধ্যে সরাসরি সংযোগ স্থাপন করে। জমির মূল দলিল, পর্চা ও দখল স্বচক্ষে যাচাই ছাড়া কোনো প্রকার অগ্রিম অর্থ লেনদেন না করার পরামর্শ দেওয়া হচ্ছে।'
              : 'BariBazar connects buyers and sellers directly. We advise all buyers to inspect land records, title deeds, and physical possession prior to financial exchanges.'}
          </p>
        </div>
      </div>
    </div>
  );
};
