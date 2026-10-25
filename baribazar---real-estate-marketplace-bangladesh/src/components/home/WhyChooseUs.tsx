import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileCheck, Shield, PhoneCall, Scale } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const { lang, setCurrentView } = useApp();

  const features = [
    {
      icon: FileCheck,
      titleBn: 'শতভাগ দলিল ও রাজউক যাচাই',
      titleEn: '100% Deed & RAJUK Verified',
      descBn:
        'প্রতিটি প্রপার্টির নামজারি, খারিজ, পর্চা ও রাজউক/সিডিএ অনুমোদন আমাদের টিম প্রাথমিক যাচাই করে থাকে।',
      descEn:
        'Every listed property undergoes preliminary verification of title deeds, mutation records, and RAJUK/CDA layout approvals.',
    },
    {
      icon: Shield,
      titleBn: '০% গোপন কমিশন পলিসি',
      titleEn: 'Zero Hidden Fees for Buyers',
      descBn:
        'ক্রেতাদের কাছ থেকে কোনো গোপন ব্রোকারেজ চার্জ নেই। সরাসরি প্রদর্শিত মূল্যে স্বচ্ছ লেনদেন সম্পন্ন করুন।',
      descEn:
        'No surprise fees or hidden middleman cuts. Connect with honest transparency and direct pricing.',
    },
    {
      icon: PhoneCall,
      titleBn: 'সরাসরি কল ও হোয়াটসঅ্যাপ চ্যাট',
      titleEn: 'Direct Call & WhatsApp Connect',
      descBn:
        'তৃতীয় পক্ষের ঝামেলা ছাড়াই এক ক্লিকে প্রকৃত মালিক বা নিবন্ধিত এজেন্টের সাথে সরাসরি কথা বলুন।',
      descEn:
        'Contact genuine property owners and verified builders instantly via direct mobile phone or WhatsApp messaging.',
    },
    {
      icon: Scale,
      titleBn: 'রেজিস্ট্রেশন ও আইনি সহায়তা',
      titleEn: 'Legal & Mutation Support',
      descBn:
        'জমি বা ফ্ল্যাট হস্তান্তরের সময় সাব-রেজিস্ট্রি অফিস ও ভূমি আইন বিষয়ক অভিজ্ঞ আইনজীবীর সার্বক্ষণিক পরামর্শ।',
      descEn:
        'Access experienced real estate legal consultants for deed drafting, land vetting, and sub-registry compliance.',
    },
  ];

  return (
    <section className="py-16 bg-[#F8FAF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {lang === 'bn' ? 'কেন বাড়ি বাজার বেছে নেবেন?' : 'Why Choose BariBazar?'}
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            {lang === 'bn'
              ? 'বাংলাদেশে নির্ভরযোগ্য ও ঝামেলামুক্ত রিয়েল এস্টেট কেনাবেচার আধুনিক প্রযুক্তি প্ল্যাটফর্ম'
              : 'Empowering home buyers and sellers with technology, safety, and legal clarity'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {lang === 'bn' ? item.titleBn : item.titleEn}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {lang === 'bn' ? item.descBn : item.descEn}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-800">
                  <span>{lang === 'bn' ? 'নিরাপদ সেবা' : 'Verified Standard'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner CTA */}
        <div className="mt-12 bg-emerald-800 text-white rounded-2xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">
              {lang === 'bn'
                ? 'আপনার বাড়ি বা জমি বিক্রয় করতে চান?'
                : 'Looking to Sell or Rent Your Property?'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              {lang === 'bn'
                ? 'বাড়ি বাজারে বিনামূল্যে বিজ্ঞাপন দিয়ে প্রতিদিন হাজার হাজার সম্ভাব্য ক্রেতা ও ভাড়াটিয়ার কাছে পৌঁছান।'
                : 'Post your ad on BariBazar for free and connect with thousands of genuine buyers across Bangladesh.'}
            </p>
          </div>

          <button
            onClick={() => setCurrentView('add_property')}
            className="px-6 py-3 bg-white text-emerald-900 hover:bg-emerald-50 font-semibold text-sm rounded-lg shadow-sm whitespace-nowrap shrink-0 transition-all"
          >
            {lang === 'bn' ? 'ফ্রি বিজ্ঞাপন পোস্ট করুন' : 'Post Free Ad Today'}
          </button>
        </div>
      </div>
    </section>
  );
};
