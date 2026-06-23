// app/dashboard/add-fund/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useFund } from '@/hooks/useFund';
import { useAuth } from '@/hooks/useAuth';
import { useCategory } from '@/hooks/useCategory';

// ── Validation rules ──────────────────────────────────────────────────────────
const VALIDATIONS = {
  name_ar:                      { required: true, label: 'اسم الصندوق (عربي)' },
  name_en:                      { required: true, label: 'Fund Name (English)' },
  description_ar:               { required: true, label: 'الوصف (عربي)' },
  description_en:               { required: true, label: 'Description (English)' },
  fund_manager_name_ar:         { required: true, label: 'اسم مدير الصندوق (عربي)' },
  fund_manager_name_en:         { required: true, label: 'Fund Manager Name (English)' },
  currentprice:                 { required: true, numeric: true, min: 0, label: 'Current Price' },
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
  fund_link:                    { url: true, label: 'Fund Link' },
};

function validateForm(formData) {
  const errors = {};

  Object.entries(VALIDATIONS).forEach(([field, rules]) => {
    const value = (formData[field] ?? '').toString().trim();

    if (rules.required && !value) {
      errors[field] = `${rules.label} is required`;
      return;
    }

    if (value && rules.numeric) {
      const num = parseFloat(value);
      if (isNaN(num)) {
        errors[field] = `${rules.label} must be a valid number`;
        return;
      }
      if (rules.min !== undefined && num < rules.min) {
        errors[field] = `${rules.label} must be greater than ${rules.min}`;
        return;
      }
    }

    if (value && rules.url) {
      try {
        new URL(value);
      } catch {
        errors[field] = `${rules.label} must be a valid URL (e.g. https://example.com)`;
      }
    }
  });

  return errors;
}

// ── Small helper: field wrapper ───────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (hasError) =>
  `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition placeholder-gray-500 text-black ${
    hasError
      ? 'border-red-400 bg-red-50 focus:ring-red-400'
      : 'border-gray-300'
  }`;

// ── Main component ────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name_ar: '', name_en: '',
  description_ar: '', description_en: '',
  fund_manager_name_ar: '', fund_manager_name_en: '',
  currentprice: '',
  currency: 'EGP', currency_ar: 'جنيه مصرى ',
  minimum_initial: '', minimum_initial_ar: '',
  Minimum_redemption_amount: '', Minimum_redemption_amount_ar: '',
  subscription_fee: '', subscription_fee_ar: '',
  redemption_fee: '', redemption_fee_ar: '',
  annualfee: '', annualfee_ar: '',
  subscription_frequency_ar: '', subscription_frequency_en: '',
  redemption_frequency_ar: '', redemption_frequency_en: '',
  type_ar: '', type_en: '',
  catid: '', fund_link: '',
  created_at: new Date().toISOString().split('T')[0],
};

const AddFundPage = () => {
  const [formData, setFormData]                     = useState(EMPTY_FORM);
  const [imageFile, setImageFile]                   = useState(null);
  const [fundManagerImageFile, setFundManagerImageFile] = useState(null);
  const [fieldErrors, setFieldErrors]               = useState({});
  const [submitted, setSubmitted]                   = useState(false); // track first submit attempt

  const { createFund, isLoading, error, successMessage, clearError, clearSuccessMessage } = useFund();
  const { token } = useAuth();
  const { getCategoriesWithTranslations, categories: categoriesList } = useCategory();
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  useEffect(() => {
    if (successMessage) setTimeout(clearSuccessMessage, 3000);
  }, [successMessage]);

  useEffect(() => {
    if (error) setTimeout(clearError, 5000);
  }, [error]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (token && !categoriesLoaded) {
        try {
          await getCategoriesWithTranslations(token);
          setCategoriesLoaded(true);
        } catch (err) {
          console.error('Failed to fetch categories:', err);
        }
      }
    };
    fetchCategories();
  }, [token, categoriesLoaded]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Live-clear the error for this field once the user starts fixing it
    if (submitted && fieldErrors[name]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const errors = validateForm(formData);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.querySelector(`[name="${firstErrorKey}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!token) { alert('Please login to add a fund'); return; }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => formDataToSend.append(key, formData[key]));
      if (imageFile)            formDataToSend.append('image', imageFile);
      if (fundManagerImageFile) formDataToSend.append('fund_manager_image', fundManagerImageFile);

      await createFund(formDataToSend);

      setFormData(EMPTY_FORM);
      setImageFile(null);
      setFundManagerImageFile(null);
      setFieldErrors({});
      setSubmitted(false);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const errorCount = Object.keys(fieldErrors).length;

  return (
    <div className="p-6 lg:ml-64 md:ml-64 ml-0 mt-12">
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white dark:bg-white/10 rounded-2xl shadow-xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#00437a] to-blue-700 p-6">
            <h1 className="text-2xl font-bold text-white">Add New Fund</h1>
            <p className="text-blue-100 mt-2">Create a new investment fund</p>
          </div>

          {/* Validation summary banner */}
          {submitted && errorCount > 0 && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-300 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-red-700 font-semibold">
                    Please fix {errorCount} error{errorCount > 1 ? 's' : ''} before submitting
                  </p>
                  <ul className="mt-1 text-sm text-red-600 list-disc list-inside space-y-0.5">
                    {Object.values(fieldErrors).map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Success message */}
          {successMessage && (
            <div className="m-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-700">{successMessage}</span>
              </div>
            </div>
          )}

          {/* API error */}
          {error && (
            <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="p-6 space-y-8">

            {/* ── Basic Information ── */}
            <section>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Fund Name (Arabic)" error={fieldErrors.name_ar}>
                  <input type="text" name="name_ar" value={formData.name_ar} onChange={handleChange}
                    className={inputClass(!!fieldErrors.name_ar)} placeholder="صندوق الأسهم السعودية" />
                </Field>
                <Field label="Fund Name (English)" error={fieldErrors.name_en}>
                  <input type="text" name="name_en" value={formData.name_en} onChange={handleChange}
                    className={inputClass(!!fieldErrors.name_en)} placeholder="Saudi Equity Fund" />
                </Field>
                <Field label="Description (Arabic)" error={fieldErrors.description_ar}>
                  <textarea name="description_ar" value={formData.description_ar} onChange={handleChange}
                    rows="3" className={inputClass(!!fieldErrors.description_ar)}
                    placeholder="صندوق استثماري يركز على الأسهم السعودية المدرجة في السوق المالية" />
                </Field>
                <Field label="Description (English)" error={fieldErrors.description_en}>
                  <textarea name="description_en" value={formData.description_en} onChange={handleChange}
                    rows="3" className={inputClass(!!fieldErrors.description_en)}
                    placeholder="Investment fund focusing on Saudi equities listed in the financial market" />
                </Field>
                <Field label="Fund Manager Name (Arabic)" error={fieldErrors.fund_manager_name_ar}>
                  <input type="text" name="fund_manager_name_ar" value={formData.fund_manager_name_ar} onChange={handleChange}
                    className={inputClass(!!fieldErrors.fund_manager_name_ar)} placeholder="شركة الفالح للاستثمار" />
                </Field>
                <Field label="Fund Manager Name (English)" error={fieldErrors.fund_manager_name_en}>
                  <input type="text" name="fund_manager_name_en" value={formData.fund_manager_name_en} onChange={handleChange}
                    className={inputClass(!!fieldErrors.fund_manager_name_en)} placeholder="Al Faleh Investment Company" />
                </Field>
              </div>
            </section>

            {/* ── Financial Information ── */}
            <section>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Financial Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Field label="Current Price" error={fieldErrors.currentprice}>
                  <input type="number" step="0.01" name="currentprice" value={formData.currentprice} onChange={handleChange}
                    className={inputClass(!!fieldErrors.currentprice)} placeholder="100.50" />
                </Field>
                <Field label="Currency (English)">
                  <select name="currency" value={formData.currency} onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition text-black">
                    <option value="EGP">EGP</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </Field>
                <Field label="Currency (Arabic)">
                  <select name="currency_ar" value={formData.currency_ar} onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition text-black">
                    <option value="جنيه مصرى ">جنيه مصرى</option>
                    <option value="دولار">دولار</option>
                    <option value="يورو">يورو</option>
                  </select>
                </Field>
                <Field label="Category" error={fieldErrors.catid}>
                  <select name="catid" value={formData.catid} onChange={handleChange}
                    className={inputClass(!!fieldErrors.catid)}>
                    <option value="">Select a category</option>
                    {categoriesList.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name || cat.name_ar || `Category ${cat.id}`}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Minimum Initial Investment (English)" error={fieldErrors.minimum_initial}>
                  <input type="text" name="minimum_initial" value={formData.minimum_initial} onChange={handleChange}
                    className={inputClass(!!fieldErrors.minimum_initial)} />
                </Field>
                <Field label="الحد الأدنى للاستثمار الأولي (عربي)" error={fieldErrors.minimum_initial_ar}>
                  <input type="text" name="minimum_initial_ar" value={formData.minimum_initial_ar} onChange={handleChange}
                    className={inputClass(!!fieldErrors.minimum_initial_ar)} />
                </Field>
                <Field label="Minimum Redemption Amount (English)" error={fieldErrors.Minimum_redemption_amount}>
                  <input type="text" name="Minimum_redemption_amount" value={formData.Minimum_redemption_amount} onChange={handleChange}
                    className={inputClass(!!fieldErrors.Minimum_redemption_amount)} />
                </Field>
                <Field label="الحد الأدنى للاسترداد (عربي)" error={fieldErrors.Minimum_redemption_amount_ar}>
                  <input type="text" name="Minimum_redemption_amount_ar" value={formData.Minimum_redemption_amount_ar} onChange={handleChange}
                    className={inputClass(!!fieldErrors.Minimum_redemption_amount_ar)} />
                </Field>
                <Field label="Fund Link" error={fieldErrors.fund_link}>
                  <input type="url" name="fund_link" value={formData.fund_link} onChange={handleChange}
                    className={inputClass(!!fieldErrors.fund_link)} placeholder="https://example.com/fund-details" />
                </Field>
              </div>
            </section>

            {/* ── Fees ── */}
            <section>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Fees</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Field label="Subscription Fee (English)" error={fieldErrors.subscription_fee}>
                  <input type="text" name="subscription_fee" value={formData.subscription_fee} onChange={handleChange}
                    className={inputClass(!!fieldErrors.subscription_fee)} />
                </Field>
                <Field label="رسوم الاشتراك (عربي)" error={fieldErrors.subscription_fee_ar}>
                  <input type="text" name="subscription_fee_ar" value={formData.subscription_fee_ar} onChange={handleChange}
                    className={inputClass(!!fieldErrors.subscription_fee_ar)} />
                </Field>
                <Field label="Redemption Fee (English)" error={fieldErrors.redemption_fee}>
                  <input type="text" name="redemption_fee" value={formData.redemption_fee} onChange={handleChange}
                    className={inputClass(!!fieldErrors.redemption_fee)} />
                </Field>
                <Field label="رسوم الاسترداد (عربي)" error={fieldErrors.redemption_fee_ar}>
                  <input type="text" name="redemption_fee_ar" value={formData.redemption_fee_ar} onChange={handleChange}
                    className={inputClass(!!fieldErrors.redemption_fee_ar)} />
                </Field>
                <Field label="Annual Fee (English)" error={fieldErrors.annualfee}>
                  <input type="text" name="annualfee" value={formData.annualfee} onChange={handleChange}
                    className={inputClass(!!fieldErrors.annualfee)} />
                </Field>
                <Field label="الرسوم السنوية (عربي)" error={fieldErrors.annualfee_ar}>
                  <input type="text" name="annualfee_ar" value={formData.annualfee_ar} onChange={handleChange}
                    className={inputClass(!!fieldErrors.annualfee_ar)} />
                </Field>
              </div>
            </section>

            {/* ── Frequencies ── */}
            <section>
  <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Frequencies</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    <Field label="تكرار الاشتراك (عربي)" error={fieldErrors.subscription_frequency_ar}>
      <select
        name="subscription_frequency_ar"
        value={formData.subscription_frequency_ar}
        onChange={handleChange}
        className={inputClass(!!fieldErrors.subscription_frequency_ar)}
      >
        <option value="">-- اختر --</option>
        <option value="يومي">يومي</option>
        <option value="أسبوعي">أسبوعي</option>
        <option value="شهري">شهري</option>
        <option value="ربع سنوي">ربع سنوي</option>
      </select>
    </Field>

    <Field label="Subscription Frequency (English)" error={fieldErrors.subscription_frequency_en}>
      <select
        name="subscription_frequency_en"
        value={formData.subscription_frequency_en}
        onChange={handleChange}
        className={inputClass(!!fieldErrors.subscription_frequency_en)}
      >
        <option value="">-- Select --</option>
        <option value="Daily">Daily</option>
        <option value="Weekly">Weekly</option>
        <option value="Monthly">Monthly</option>
        <option value="Quarterly">Quarterly</option>
      </select>
    </Field>

    <Field label="تكرار الاسترداد (عربي)" error={fieldErrors.redemption_frequency_ar}>
      <select
        name="redemption_frequency_ar"
        value={formData.redemption_frequency_ar}
        onChange={handleChange}
        className={inputClass(!!fieldErrors.redemption_frequency_ar)}
      >
        <option value="">-- اختر --</option>
        <option value="يومي">يومي</option>
        <option value="أسبوعي">أسبوعي</option>
        <option value="شهري">شهري</option>
        <option value="ربع سنوي">ربع سنوي</option>
      </select>
    </Field>

    <Field label="Redemption Frequency (English)" error={fieldErrors.redemption_frequency_en}>
      <select
        name="redemption_frequency_en"
        value={formData.redemption_frequency_en}
        onChange={handleChange}
        className={inputClass(!!fieldErrors.redemption_frequency_en)}
      >
        <option value="">-- Select --</option>
        <option value="Daily">Daily</option>
        <option value="Weekly">Weekly</option>
        <option value="Monthly">Monthly</option>
        <option value="Quarterly">Quarterly</option>
      </select>
    </Field>

  </div>
</section>

            {/* ── Fund Type ── */}
            <section>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Fund Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="نوع الصندوق (عربي)" error={fieldErrors.type_ar}>
                  <input type="text" name="type_ar" value={formData.type_ar} onChange={handleChange}
                    className={inputClass(!!fieldErrors.type_ar)} placeholder="أسهم" />
                </Field>
                <Field label="Fund Type (English)" error={fieldErrors.type_en}>
                  <input type="text" name="type_en" value={formData.type_en} onChange={handleChange}
                    className={inputClass(!!fieldErrors.type_en)} placeholder="Equity" />
                </Field>
              </div>
            </section>

            {/* ── Images ── */}
            <section>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Fund Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition text-black" />
                  {imageFile && <p className="mt-2 text-sm text-gray-600">Selected: {imageFile.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Fund Manager Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setFundManagerImageFile(e.target.files[0])}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00437a] focus:border-transparent outline-none transition text-black" />
                  {fundManagerImageFile && <p className="mt-2 text-sm text-gray-600">Selected: {fundManagerImageFile.name}</p>}
                </div>
              </div>
            </section>

            {/* Submit */}
            <div className="flex items-center justify-end gap-4">
              {submitted && errorCount > 0 && (
                <p className="text-sm text-red-600">
                  {errorCount} field{errorCount > 1 ? 's' : ''} need{errorCount === 1 ? 's' : ''} attention ↑
                </p>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-[#00437a] to-blue-700 text-white font-medium rounded-lg hover:from-[#003560] hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Fund...' : 'Create Fund'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFundPage;