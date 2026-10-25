import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatBDTPrice, formatNumberWithLocale } from '../../utils/formatters';
import { Calculator } from 'lucide-react';

interface EmiCalculatorProps {
  propertyPrice: number;
}

export const EmiCalculator: React.FC<EmiCalculatorProps> = ({ propertyPrice }) => {
  const { lang } = useApp();

  // Default to 70% loan ratio (common in Bangladesh)
  const defaultLoan = Math.round(propertyPrice * 0.7);
  const [loanAmount, setLoanAmount] = useState<number>(defaultLoan);
  const [interestRate, setInterestRate] = useState<number>(10.0); // 10% annual interest
  const [tenureYears, setTenureYears] = useState<number>(15); // 15 years

  // EMI Formula: [P x R x (1+R)^N]/[(1+R)^N-1]
  const monthlyRate = interestRate / (12 * 100);
  const totalMonths = tenureYears * 12;

  const emi =
    monthlyRate > 0 && totalMonths > 0
      ? Math.round(
          (loanAmount *
            monthlyRate *
            Math.pow(1 + monthlyRate, totalMonths)) /
            (Math.pow(1 + monthlyRate, totalMonths) - 1)
        )
      : 0;

  const totalPayment = emi * totalMonths;
  const totalInterest = Math.max(0, totalPayment - loanAmount);

  return (
    <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-emerald-800">
      <div className="flex items-center gap-2 mb-4 text-emerald-300">
        <Calculator className="w-5 h-5 text-emerald-400" />
        <h3 className="font-bold text-base sm:text-lg">
          {lang === 'bn' ? 'হোম লোন / ইএমআই ক্যালকুলেটর' : 'Home Loan / EMI Calculator'}
        </h3>
      </div>

      <p className="text-xs text-slate-300 mb-6 leading-relaxed">
        {lang === 'bn'
          ? 'বাংলাদেশের শীর্ষস্থানীয় ব্যাংক ও আর্থিক প্রতিষ্ঠান (DBH, BRAC Bank, City Bank) থেকে সম্ভাব্য মাসিক কিস্তি হিসাব করুন।'
          : 'Estimate monthly repayment with leading Bangladeshi banks and NBFI home financing.'}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-2 space-y-4 text-xs">
          {/* Loan Amount */}
          <div>
            <div className="flex justify-between font-semibold mb-1.5">
              <span className="text-slate-300">
                {lang === 'bn' ? 'ঋণের পরিমাণ (BDT)' : 'Loan Amount (BDT)'}
              </span>
              <span className="text-emerald-300 font-bold tabular-nums">
                {formatBDTPrice(loanAmount, lang)}
              </span>
            </div>
            <input
              type="range"
              min={500000}
              max={Math.max(propertyPrice, 50000000)}
              step={100000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-1.5 bg-emerald-900 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex gap-2 mt-2">
              {[0.5, 0.7, 0.8].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setLoanAmount(Math.round(propertyPrice * pct))}
                  className="px-2 py-0.5 bg-emerald-900/80 hover:bg-emerald-900 rounded text-[10px] text-emerald-200 border border-emerald-800"
                >
                  {pct * 100}% {lang === 'bn' ? 'মূল্য' : 'Value'}
                </button>
              ))}
            </div>
          </div>

          {/* Interest Rate & Tenure */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <div className="flex justify-between font-semibold mb-1.5">
                <span className="text-slate-300">
                  {lang === 'bn' ? 'সুদের হার (%)' : 'Interest Rate (%)'}
                </span>
                <span className="text-emerald-300 font-bold tabular-nums">
                  {formatNumberWithLocale(interestRate, lang)}%
                </span>
              </div>
              <input
                type="range"
                min={7}
                max={15}
                step={0.25}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-1.5 bg-emerald-900 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1.5">
                <span className="text-slate-300">
                  {lang === 'bn' ? 'মেয়াদ (বছর)' : 'Tenure (Years)'}
                </span>
                <span className="text-emerald-300 font-bold tabular-nums">
                  {formatNumberWithLocale(tenureYears, lang)}{' '}
                  {lang === 'bn' ? 'বছর' : 'Yrs'}
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={25}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-1.5 bg-emerald-900 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          </div>
        </div>

        {/* Result Card */}
        <div className="bg-emerald-900/70 border border-emerald-700/60 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-medium text-emerald-200 uppercase tracking-wider block mb-1">
              {lang === 'bn' ? 'সম্ভাব্য মাসিক কিস্তি (EMI)' : 'Estimated Monthly EMI'}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight tabular-nums">
              ৳ {formatNumberWithLocale(emi.toLocaleString('en-US'), lang)}
              <span className="text-xs text-emerald-300 font-normal ml-1">
                {lang === 'bn' ? '/মাস' : '/mo'}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-800/80 text-[11px] text-slate-300 space-y-1">
            <div className="flex justify-between">
              <span>{lang === 'bn' ? 'মূল ঋণ:' : 'Principal:'}</span>
              <span className="tabular-nums font-semibold text-white">
                {formatBDTPrice(loanAmount, lang)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{lang === 'bn' ? 'মোট সুদ:' : 'Total Interest:'}</span>
              <span className="tabular-nums font-semibold text-white">
                {formatBDTPrice(totalInterest, lang)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
