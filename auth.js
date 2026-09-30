const authForm = document.querySelector('#auth-form');
const authTitle = document.querySelector('#auth-title');
const authSubtitle = document.querySelector('#auth-subtitle');
const submitLabel = document.querySelector('#submit-label');
const nameFields = document.querySelector('.auth-name-fields');
const toast = document.querySelector('#toast');
let authMode = 'login';
let language = localStorage.getItem('logicompare-language') || 'bn';
let accounts = JSON.parse(localStorage.getItem('logicompare-accounts') || '[]');

const translations = {
  bn: {
    visualEyebrow: 'বাংলাদেশের ডেলিভারি ইন্টেলিজেন্স', visualHeadline: 'আপনার ডেলিভারি,<br /><em>আরও সহজ।</em>', visualDescription: 'দেশের সেরা কুরিয়ার রেট, দ্রুত তুলনা এবং প্রতিটি চালানের পরিষ্কার হিসাব এক জায়গায় রাখুন।', visualFoot: 'ঢাকা • চট্টগ্রাম • সিলেট • খুলনা • সারা বাংলাদেশ', dhaka: 'ঢাকা', chattogram: 'চট্টগ্রাম', kicker: 'লজিস্টিক কন্ট্রোল সেন্টার',
    accountLabel: 'আপনার অ্যাকাউন্ট', dashboardLink: '← ড্যাশবোর্ড', loginTab: 'লগইন', registerTab: 'নতুন অ্যাকাউন্ট',
    googleButton: 'Google দিয়ে চালিয়ে যান', appleButton: 'Apple দিয়ে চালিয়ে যান', orContinue: 'অথবা ফোন দিয়ে চালিয়ে যান',
    nameLabel: 'আপনার নাম', phoneLabel: 'মোবাইল নম্বর', passwordLabel: 'পাসওয়ার্ড', showPassword: 'দেখুন',
    rememberMe: 'আমাকে মনে রাখুন', forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?', termsPrefix: 'চালিয়ে গেলে আপনি আমাদের', termsLink: 'ব্যবহারের শর্ত', termsJoin: 'ও', privacyLink: 'গোপনীয়তা নীতি', termsSuffix: '-তে সম্মতি দিচ্ছেন।', helpText: 'সহায়তা প্রয়োজন?'
  },
  en: {
    visualEyebrow: 'BANGLADESH DELIVERY INTELLIGENCE', visualHeadline: 'Your delivery,<br /><em>made simple.</em>', visualDescription: 'Compare trusted courier rates, track every shipment, and keep your delivery operations clear in one place.', visualFoot: 'Dhaka • Chattogram • Sylhet • Khulna • All Bangladesh', dhaka: 'Dhaka', chattogram: 'Chattogram', kicker: 'LOGISTIC CONTROL CENTER',
    accountLabel: 'Your account', dashboardLink: '← Dashboard', loginTab: 'Sign in', registerTab: 'Create account',
    googleButton: 'Continue with Google', appleButton: 'Continue with Apple', orContinue: 'Or continue with phone',
    nameLabel: 'Your name', phoneLabel: 'Phone number', passwordLabel: 'Password', showPassword: 'Show',
    rememberMe: 'Remember me', forgotPassword: 'Forgot password?', termsPrefix: 'By continuing, you agree to our', termsLink: 'Terms of use', termsJoin: 'and', privacyLink: 'Privacy policy', termsSuffix: '.', helpText: 'Need help?'
  }
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
}

function setMode(mode) {
  authMode = mode;
  const isRegistering = mode === 'register';
  document.querySelectorAll('.auth-tab').forEach((tab) => {
    const active = tab.dataset.mode === mode;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  nameFields.hidden = !isRegistering;
  document.querySelector('#full-name').required = isRegistering;
  authTitle.textContent = isRegistering ? (language === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create your account') : (language === 'bn' ? 'আবার স্বাগতম' : 'Welcome back');
  authSubtitle.textContent = isRegistering ? (language === 'bn' ? 'LogiCompare-এ আপনার ব্যবসার ডেলিভারি সহজ করুন।' : 'Make your business deliveries simpler with LogiCompare.') : (language === 'bn' ? 'আপনার রেট ও চালান দেখতে লগইন করুন।' : 'Sign in to view your rates and shipments.');
  submitLabel.textContent = isRegistering ? (language === 'bn' ? 'রেজিস্ট্রেশন করুন' : 'Create account') : (language === 'bn' ? 'লগইন করুন' : 'Sign in');
}

function setLanguage(nextLanguage) {
  language = nextLanguage;
  localStorage.setItem('logicompare-language', language);
  document.documentElement.lang = language;
  document.title = language === 'bn' ? 'LogiCompare বাংলাদেশ | লগইন ও রেজিস্ট্রেশন' : 'LogiCompare Bangladesh | Login & Register';
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = translations[language][element.dataset.i18n];
  });
  document.querySelectorAll('[data-i18n-html]').forEach((element) => {
    element.innerHTML = translations[language][element.dataset.i18nHtml];
  });
  document.querySelectorAll('[data-placeholder-bn]').forEach((input) => {
    input.placeholder = input.dataset[`placeholder${language === 'bn' ? 'Bn' : 'En'}`];
  });
  document.querySelector('.password-toggle').setAttribute('aria-label', language === 'bn' ? 'পাসওয়ার্ড দেখুন' : 'Show password');
  document.querySelectorAll('.language-button').forEach((button) => { button.classList.toggle('is-active', button.dataset.language === language); button.textContent = language === 'bn' ? (button.dataset.language === 'bn' ? 'বাংলা' : 'ইংরেজি') : (button.dataset.language === 'bn' ? 'BN' : 'EN'); });
  setMode(authMode);
}

document.querySelectorAll('.auth-tab').forEach((tab) => tab.addEventListener('click', () => setMode(tab.dataset.mode)));
document.querySelectorAll('.language-button').forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.language)));
document.querySelectorAll('.social-button').forEach((button) => button.addEventListener('click', () => {
  const provider = button.dataset.provider;
  localStorage.setItem('logicompare-user', JSON.stringify({ id: `${provider.toLowerCase()}-customer`, name: `${provider} customer`, role: 'customer', provider }));
  showToast(language === 'bn' ? `${provider} দিয়ে লগইন সফল হয়েছে` : `${provider} sign-in successful`);
  window.setTimeout(() => { window.location.href = 'react.html#/'; }, 700);
}));

document.querySelector('.password-toggle').addEventListener('click', (event) => {
  const password = document.querySelector('#password');
  const showing = password.type === 'text';
  password.type = showing ? 'password' : 'text';
  event.currentTarget.textContent = showing ? (language === 'bn' ? 'দেখুন' : 'Show') : (language === 'bn' ? 'লুকান' : 'Hide');
});

authForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const phone = document.querySelector('#phone').value.trim();
  const password = document.querySelector('#password').value;
  const fullName = document.querySelector('#full-name').value.trim();
  if (!/^01\d{9}$/.test(phone)) {
    showToast(language === 'bn' ? 'সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন' : 'Enter a valid 11-digit Bangladesh mobile number');
    document.querySelector('#phone').focus();
    return;
  }
  if (password.length < 6) {
    showToast(language === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' : 'Password must be at least 6 characters');
    return;
  }
  if (authMode === 'register') {
    if (!fullName) {
      showToast(language === 'bn' ? 'আপনার নাম লিখুন' : 'Enter your full name');
      return;
    }
    if (accounts.some((account) => account.phone === phone)) {
      showToast(language === 'bn' ? 'এই নম্বরে আগে থেকেই অ্যাকাউন্ট আছে' : 'An account already exists for this number');
      setMode('login');
      return;
    }
    const account = { id: `customer-${Date.now()}`, name: fullName, phone, password, role: 'customer' };
    accounts = [...accounts, account];
    localStorage.setItem('logicompare-accounts', JSON.stringify(accounts));
    localStorage.setItem('logicompare-user', JSON.stringify({ id: account.id, name: account.name, role: account.role }));
    showToast(language === 'bn' ? 'আপনার অ্যাকাউন্ট তৈরি হয়েছে' : 'Your account has been created');
  } else {
    const account = accounts.find((item) => item.phone === phone && item.password === password);
    if (!account) {
      showToast(language === 'bn' ? 'মোবাইল নম্বর বা পাসওয়ার্ড সঠিক নয়' : 'Incorrect phone number or password');
      return;
    }
    localStorage.setItem('logicompare-user', JSON.stringify({ id: account.id, name: account.name, role: account.role }));
    showToast(language === 'bn' ? 'লগইন সফল হয়েছে' : 'Signed in successfully');
  }
  window.setTimeout(() => { window.location.href = 'react.html#/'; }, 900);
});

setLanguage(language);
setMode(window.location.hash === '#register' ? 'register' : 'login');
