'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFund } from '@/hooks/useFund';
import { useAuth } from '@/hooks/useAuth';
import { useCategory } from '@/hooks/useCategory';
import { useToast } from '@/context/ToastContext';
import PriceManagement from '@/components/funds/PriceManagement';
import BasicInformation from '@/components/funds/BasicInformation';
import FinancialInformation from '@/components/funds/FinancialInformation';
import FeesStructure from '@/components/funds/FeesStructure';
import Operations from '@/components/funds/Operations';
import FundImages from '@/components/funds/FundImages';
import FundEntities from '@/components/funds/FundEntities';
import FundManagers from '@/components/funds/FundManagers';
import FundDocuments from '@/components/funds/FundDocuments';

// ── Validation rules ───────────────────────────────────────────────────────────
const VALIDATIONS = {
  name_ar:                      { required: true, label: 'اسم الصندوق (عربي)' },
  name_en:                      { required: true, label: 'Fund Name (English)' },
  description_ar:               { required: true, label: 'الوصف (عربي)' },
  description_en:               { required: true, label: 'Description (English)' },
  fund_manager_name_ar:         { required: true, label: 'اسم مدير الصندوق (عربي)' },
  fund_manager_name_en:         { required: true, label: 'Fund Manager Name (English)' },
  catid:                        { required: true, label: 'Category' },
  minimum_initial:              { required: true, label: 'Minimum Initial Investment (English)' },
  minimum_initial_ar:           { required: true, label: 'الحد الأدنى للاستثمار الأولي (عربي)' },
  Minimum_redemption_amount:    { required: true, label: 'Minimum Redemption Amount (English)' },
  Minimum_redemption_amount_ar: { required: true, label: 'الحد الأدنى للاسترداد (عربي)' },
  subscription_fee:             { required: true, label: 'Subscription Fee (English)' },
  subscription_fee_ar:          { required: true, label: 'رسوم الاشتراك (عربي)' },
  redemption_fee:               { required: true, label: 'Redemption Fee (English)' },
  redemption_fee_ar:            { required: true, label: 'رسوم الاسترداد (عربي)' },
  annualfee:                    { required: true, label: 'Annual Fee (English)' },
  annualfee_ar:                 { required: true, label: 'الرسوم السنوية (عربي)' },
  subscription_frequency_ar:    { required: true, label: 'تكرار الاشتراك (عربي)' },
  subscription_frequency_en:    { required: true, label: 'Subscription Frequency (English)' },
  redemption_frequency_ar:      { required: true, label: 'تكرار الاسترداد (عربي)' },
  redemption_frequency_en:      { required: true, label: 'Redemption Frequency (English)' },
  type_ar:                      { required: true, label: 'نوع الصندوق (عربي)' },
  type_en:                      { required: true, label: 'Fund Type (English)' },
  created_at:                   { required: true, label: 'Creation Date' },
  fund_link:                    { url: true,      label: 'Fund Link' },
};

// Price-specific validation
const PRICE_VALIDATIONS = {
  newprice: { required: true, numeric: true, min: 0, label: 'New Price' },
  date:     { required: true, label: 'Price Date' },
};

function validateFields(data, rules) {
  const errors = {};
  Object.entries(rules).forEach(([field, rule]) => {
    const value = (data[field] ?? '').toString().trim();

    if (rule.required && !value) {
      errors[field] = `${rule.label} is required`;
      return;
    }
    if (value && rule.numeric) {
      const num = parseFloat(value);
      if (isNaN(num)) { errors[field] = `${rule.label} must be a valid number`; return; }
      if (rule.min !== undefined && num < rule.min) {
        errors[field] = `${rule.label} must be greater than ${rule.min}`; return;
      }
    }
    if (value && rule.url) {
      try { new URL(value); } catch {
        errors[field] = `${rule.label} must be a valid URL (e.g. https://example.com)`;
      }
    }
  });
  return errors;
}

// ── Validation summary banner ──────────────────────────────────────────────────
function ValidationBanner({ errors }) {
  const count = Object.keys(errors).length;
  if (!count) return null;
  return (
    <div className="p-4 bg-red-50 border border-red-300 rounded-lg mb-6">
      <div className="flex items-start gap-2">
        <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-red-700 font-semibold">
            Please fix {count} error{count > 1 ? 's' : ''} before saving
          </p>
          <ul className="mt-1 text-sm text-red-600 list-disc list-inside space-y-0.5">
            {Object.values(errors).map((msg, i) => <li key={i}>{msg}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
const EditFundPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const {
    getFundById, updateFund, updateFundPrice, getFundPriceHistory,
    isLoading, error, successMessage, clearError, clearSuccessMessage
  } = useFund();
  const { getCategoriesWithTranslations, categories: categoriesList } = useCategory();
  const { showSuccess, showError } = useToast();

  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validation state
  const [fundErrors, setFundErrors]   = useState({});
  const [priceErrors, setPriceErrors] = useState({});
  const [fundSubmitted, setFundSubmitted]   = useState(false);
  const [priceSubmitted, setPriceSubmitted] = useState(false);

  const [priceData, setPriceData] = useState({
    currentprice: '',
    newprice: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [fundData, setFundData] = useState({
    name_ar: '', name_en: '',
    description_ar: '', description_en: '',
    fund_manager_name_ar: '', fund_manager_name_en: '',
    currency: 'EGP', currency_ar: 'جنيه مصرى',
    minimum_initial: '', minimum_initial_ar: '',
    Minimum_redemption_amount: '', Minimum_redemption_amount_ar: '',
    subscription_fee: '', subscription_fee_ar: '',
    redemption_fee: '', redemption_fee_ar: '',
    annualfee: '', annualfee_ar: '',
    subscription_frequency_ar: '', subscription_frequency_en: '',
    redemption_frequency_ar: '', redemption_frequency_en: '',
    type_ar: '', type_en: '',
    catid: '', fund_link: '',
    created_at: '',
    image: '', fund_manager_image: ''
  });

  const [imageFiles, setImageFiles] = useState({ image: null, fund_manager_image: null });
  const [priceHistory, setPriceHistory] = useState({ latest: null, previous: null });

  // ── Effects ──────────────────────────────────────────────────────────────────
  const fetchCategories = async () => {
    if (token && !categoriesLoaded) {
      try { await getCategoriesWithTranslations(token); setCategoriesLoaded(true); }
      catch (err) { console.error('Failed to fetch categories:', err); }
    }
  };

  useEffect(() => {
    if (id && token) { fetchFundData(); fetchPriceHistory(); fetchCategories(); }
  }, [id, token]);

  useEffect(() => {
    if (successMessage) { const t = setTimeout(clearSuccessMessage, 3000); return () => clearTimeout(t); }
  }, [successMessage, clearSuccessMessage]);

  useEffect(() => {
    if (error) { const t = setTimeout(clearError, 5000); return () => clearTimeout(t); }
  }, [error, clearError]);

  // ── Data fetching ─────────────────────────────────────────────────────────────
  const fetchFundData = async () => {
    try {
      setLoading(true);
      const [fundDataEn, fundDataAr] = await Promise.all([
        getFundById(id, 'en'),
        getFundById(id, 'ar')
      ]);
      const actualEn = fundDataEn?.fundDetails || fundDataEn?.fund || fundDataEn?.data || fundDataEn;
      const actualAr = fundDataAr?.fundDetails || fundDataAr?.fund || fundDataAr?.data || fundDataAr;
      const mergedFundData = { ...actualEn, ...actualAr };
      setFund(mergedFundData);

      setPriceData({
        currentprice: mergedFundData.currentprice || mergedFundData.latest_price || '',
        newprice: '',
        date: new Date().toISOString().split('T')[0]
      });

      setFundData({
        name_ar: actualAr.name || '',
        name_en: actualEn.name || '',
        description_ar: actualAr.description || '',
        description_en: actualEn.description || '',
        fund_manager_name_ar: actualAr.fund_manager_name || '',
        fund_manager_name_en: actualEn.fund_manager_name || '',
        currency: actualEn.currency || 'EGP',
        currency_ar: actualAr.currency || 'جنيه مصرى',
        minimum_initial: actualEn.minimum_initial || '',
        minimum_initial_ar: actualAr.minimum_initial || '',
        Minimum_redemption_amount: actualEn.Minimum_redemption_amount || '',
        Minimum_redemption_amount_ar: actualAr.Minimum_redemption_amount || '',
        subscription_fee: actualEn.subscription_fee || '',
        subscription_fee_ar: actualAr.subscription_fee || '',
        redemption_fee: actualEn.redemption_fee || '',
        redemption_fee_ar: actualAr.redemption_fee || '',
        annualfee: actualEn.annualfee || '',
        annualfee_ar: actualAr.annualfee || '',
        subscription_frequency_ar: actualAr.subscription_frequency || '',
        subscription_frequency_en: actualEn.subscription_frequency || '',
        redemption_frequency_ar: actualAr.redemption_frequency || '',
        redemption_frequency_en: actualEn.redemption_frequency || '',
        type_ar: actualAr.type || '',
        type_en: actualEn.type || '',
        catid: actualEn.catid || '',
        fund_link: actualEn.fund_link || '',
        created_at: actualEn.created_at?.split('T')[0] || '',
        image: actualEn.image || '',
        fund_manager_image: actualEn.fund_manager_image || ''
      });
    } catch (err) {
      console.error('Error fetching fund data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPriceHistory = async () => {
    try {
      const history = await getFundPriceHistory(id);
      setPriceHistory(history);
    } catch (err) {
      console.error('Error fetching price history:', err);
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceData(prev => ({ ...prev, [name]: value }));
    // Clear the error for this field live
    if (priceSubmitted && priceErrors[name]) {
      setPriceErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  const handleFundChange = (e) => {
    const { name, value } = e.target;
    setFundData(prev => ({ ...prev, [name]: value }));
    // Clear the error for this field live
    if (fundSubmitted && fundErrors[name]) {
      setFundErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  const handleImageChange = (name, file) => {
    setImageFiles(prev => ({ ...prev, [name]: file }));
  };

  const handlePriceSubmit = async (e) => {
    e.preventDefault();
    setPriceSubmitted(true);

    const errors = validateFields(priceData, PRICE_VALIDATIONS);
    setPriceErrors(errors);
    if (Object.keys(errors).length > 0) {
      const firstKey = Object.keys(errors)[0];
      document.querySelector(`[name="${firstKey}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      await updateFundPrice(id, { newprice: priceData.newprice, date: priceData.date });
      showSuccess('Fund price updated successfully!');
      setPriceSubmitted(false);
      setPriceErrors({});
      await Promise.all([fetchPriceHistory(), fetchFundData()]);
    } catch (err) {
      console.error('Error updating price:', err);
      showError('Failed to update fund price. Please try again.');
    }
  };

  const handleFundSubmit = async (e) => {
    e.preventDefault();
    setFundSubmitted(true);

    const errors = validateFields(fundData, VALIDATIONS);
    setFundErrors(errors);
    if (Object.keys(errors).length > 0) {
      const firstKey = Object.keys(errors)[0];
      document.querySelector(`[name="${firstKey}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(fundData).forEach(key => formData.append(key, fundData[key]));
      if (imageFiles.image)             formData.append('image', imageFiles.image);
      if (imageFiles.fund_manager_image) formData.append('fund_manager_image', imageFiles.fund_manager_image);

      await updateFund(id, formData);
      showSuccess('Fund details updated successfully!');
      setFundSubmitted(false);
      setFundErrors({});
    } catch (err) {
      console.error('Error updating fund:', err);
      showError('Failed to update fund details. Please try again.');
    }
  };

  // ── Loading / error states ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 lg:ml-64 md:ml-64 ml-0 mt-12">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00437a]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:ml-64 md:ml-64 ml-0 mt-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      </div>
    );
  }

  const fundErrorCount  = Object.keys(fundErrors).length;
  const priceErrorCount = Object.keys(priceErrors).length;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 lg:ml-64 md:ml-64 ml-0 mt-12">
      <div className="w-full max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#00437a] to-blue-700 rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Edit Fund</h1>
              <p className="text-blue-100">Update fund information and pricing</p>
            </div>
            <Link
              href="/dashboard/funds"
              className="px-6 py-3 bg-white text-[#00437a] font-medium rounded-lg hover:bg-blue-50 transition-all duration-300"
            >
              Back to Funds
            </Link>
          </div>
        </div>

        {/* Global success message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700">{successMessage}</p>
          </div>
        )}

        {/* ── Price Management ── */}
        <div className="bg-white dark:bg-white/10 rounded-xl shadow-lg p-6 mb-8">
          {/* Price validation banner */}
          {priceSubmitted && priceErrorCount > 0 && (
            <ValidationBanner errors={priceErrors} />
          )}

          <PriceManagement
            priceData={priceData}
            priceHistory={priceHistory}
            fund={fund}
            handlePriceSubmit={handlePriceSubmit}
            handlePriceChange={handlePriceChange}
            isLoading={isLoading}
            fieldErrors={priceErrors}         // ← pass down so PriceManagement can highlight fields
          />
        </div>

        {/* ── Fund Details Form ── */}
        <div className="bg-white dark:bg-white/10 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-[#00437a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Fund Details
          </h2>

          {/* Fund validation banner */}
          {fundSubmitted && fundErrorCount > 0 && (
            <ValidationBanner errors={fundErrors} />
          )}

          <form onSubmit={handleFundSubmit} noValidate className="space-y-6">
            {/*
              Each sub-component receives `fieldErrors` so it can highlight
              its own fields individually. Update those components to accept
              and use this prop (see note below).
            */}
            <BasicInformation
              fundData={fundData}
              handleFundChange={handleFundChange}
              fieldErrors={fundErrors}
            />

            <FinancialInformation
              fundData={fundData}
              handleFundChange={handleFundChange}
              fieldErrors={fundErrors}
            />

            <FeesStructure
              fundData={fundData}
              handleFundChange={handleFundChange}
              fieldErrors={fundErrors}
            />

            <Operations
              fundData={fundData}
              handleFundChange={handleFundChange}
              categories={categoriesList}
              fieldErrors={fundErrors}
            />

            <FundImages
              fundData={fundData}
              handleImageChange={handleImageChange}
              fieldErrors={fundErrors}
            />

            {/* Creation Date */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Creation Date</label>
                  <input
                    type="date"
                    name="created_at"
                    value={fundData.created_at}
                    onChange={handleFundChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition ${
                      fundErrors.created_at
                        ? 'border-red-400 bg-red-50 focus:ring-red-400'
                        : 'border-gray-300'
                    }`}
                  />
                  {fundErrors.created_at && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {fundErrors.created_at}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-8 flex items-center justify-between gap-4">
              {fundSubmitted && fundErrorCount > 0 && (
                <p className="text-sm text-red-600">
                  {fundErrorCount} field{fundErrorCount > 1 ? 's' : ''} need{fundErrorCount === 1 ? 's' : ''} attention ↑
                </p>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="ml-auto px-6 py-3 bg-[#00437a] text-white font-medium rounded-lg hover:bg-[#003560] transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Update Fund Details'}
              </button>
            </div>
          </form>
        </div>

        {/* Fund Documents - outside main form */}
        <div className="mt-12 bg-white dark:bg-white/10 rounded-xl shadow-lg p-6">
          <FundDocuments fundId={id} />
        </div>

        {/* Fund Entities - outside main form */}
        <div className="mt-12 bg-white dark:bg-white/10 rounded-xl shadow-lg p-6">
          <FundEntities fundId={id} />
        </div>

        {/* Fund Managers - outside main form */}
        <div className="mt-12 bg-white dark:bg-white/10 rounded-xl shadow-lg p-6">
          <FundManagers fundId={id} />
        </div>

      </div>
    </div>
  );
};

export default EditFundPage;