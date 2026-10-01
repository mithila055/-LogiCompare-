const authForm = document.querySelector('#auth-form');
const authTitle = document.querySelector('#auth-title');
const authSubtitle = document.querySelector('#auth-subtitle');
const submitLabel = document.querySelector('#submit-label');
const nameFields = document.querySelector('.auth-name-fields');
const confirmFields = document.querySelector('.auth-confirm-fields');
const phoneFields = document.querySelector('.phone-fields');
const emailFields = document.querySelector('.email-fields');
const toast = document.querySelector('#toast');
let authMode = 'login';
let authMethod = 'phone';
let language = localStorage.getItem('logicompare-language') || 'bn';
let accounts = JSON.parse(localStorage.getItem('logicompare-accounts') || '[]').filter((account) => account.passwordHash);
localStorage.setItem('logicompare-accounts', JSON.stringify(accounts));

const translations = {
  bn: {
    visualEyebrow: 'বাংলাদেশের ডেলিভারি ইন্টেলিজেন্স', visualHeadline: 'আপনার ডেলিভারি,<br /><em>আরও সহজ।</em>', visualDescription: 'দেশের সেরা কুরিয়ার রেট, দ্রুত তুলনা এবং প্রতিটি চালানের পরিষ্কার হিসাব এক জায়গায় রাখুন।', visualFoot: 'ঢাকা • চট্টগ্রাম • সিলেট • খুলনা • সারা বাংলাদেশ', dhaka: 'ঢাকা', chattogram: 'চট্টগ্রাম', kicker: 'লজিস্টিক কন্ট্রোল সেন্টার',
    accountLabel: 'আপনার অ্যাকাউন্ট', dashboardLink: '← ড্যাশবোর্ড', loginTab: 'লগইন', registerTab: 'নতুন অ্যাকাউন্ট',
    phoneMethod: 'ফোন নম্বর', emailMethod: 'ইমেইল', nameLabel: 'আপনার নাম', phoneLabel: 'মোবাইল নম্বর', emailLabel: 'ইমেইল', passwordLabel: 'পাসওয়ার্ড', confirmPasswordLabel: 'পাসওয়ার্ড নিশ্চিত করুন', showPassword: 'দেখুন',
    rememberMe: 'আমাকে মনে রাখুন', forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?', termsPrefix: 'চালিয়ে গেলে আপনি আমাদের', termsLink: 'ব্যবহারের শর্ত', termsJoin: 'ও', privacyLink: 'গোপনীয়তা নীতি', termsSuffix: '-তে সম্মতি দিচ্ছেন।', helpText: 'সহায়তা প্রয়োজন?'
  },
  en: {
    visualEyebrow: 'BANGLADESH DELIVERY INTELLIGENCE', visualHeadline: 'Your delivery,<br /><em>made simple.</em>', visualDescription: 'Compare trusted courier rates, track every shipment, and keep your delivery operations clear in one place.', visualFoot: 'Dhaka • Chattogram • Sylhet • Khulna • All Bangladesh', dhaka: 'Dhaka', chattogram: 'Chattogram', kicker: 'LOGISTIC CONTROL CENTER',
    accountLabel: 'Your account', dashboardLink: '← Dashboard', loginTab: 'Sign in', registerTab: 'Create account',
    phoneMethod: 'Phone number', emailMethod: 'Email', nameLabel: 'Your name', phoneLabel: 'Phone number', emailLabel: 'Email', passwordLabel: 'Password', confirmPasswordLabel: 'Confirm password', showPassword: 'Show',
    rememberMe: 'Remember me', forgotPassword: 'Forgot password?', termsPrefix: 'By continuing, you agree to our', termsLink: 'Terms of use', termsJoin: 'and', privacyLink: 'Privacy policy', termsSuffix: '.', helpText: 'Need help?'
  }
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
}

function normalizePhone(phone) {
  return phone.replace(/[\s-]/g, '');
}

async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function createSession(account) {
  const session = { token: crypto.randomUUID(), userId: account.id, role: account.role, createdAt: Date.now(), expiresAt: Date.now() + 1000 * 60 * 60 * 8 };
  localStorage.setItem('logicompare-session', JSON.stringify(session));
  localStorage.setItem('logicompare-user', JSON.stringify({ id: account.id, name: account.name, role: account.role }));
}

function failedAttempts(phone) {
  const key = `logicompare-login-attempts:${phone}`;
  const record = JSON.parse(localStorage.getItem(key) || '{"count":0,"lockedUntil":0}');
  if (record.lockedUntil > Date.now()) return record;
  if (record.lockedUntil) localStorage.removeItem(key);
  return { count: 0, lockedUntil: 0 };
}

function recordFailedAttempt(phone) {
  const key = `logicompare-login-attempts:${phone}`;
  const record = failedAttempts(phone);
  record.count += 1;
  if (record.count >= 5) record.lockedUntil = Date.now() + 15 * 60 * 1000;
  localStorage.setItem(key, JSON.stringify(record));
  return record;
}

function clearFailedAttempts(phone) {
  localStorage.removeItem(`logicompare-login-attempts:${phone}`);
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
  confirmFields.hidden = !isRegistering;
  document.querySelector('#full-name').required = isRegistering;
  document.querySelector('#confirm-password').required = isRegistering;
  phoneFields.hidden = authMethod !== 'phone';
  emailFields.hidden = authMethod !== 'email';
  document.querySelector('#phone').required = authMethod === 'phone';
  document.querySelector('#email').required = authMethod === 'email';
  authTitle.textContent = isRegistering ? (language === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create your account') : (language === 'bn' ? 'আবার স্বাগতম' : 'Welcome back');
  authSubtitle.textContent = isRegistering ? (language === 'bn' ? 'LogiCompare-এ আপনার ব্যবসার ডেলিভারি সহজ করুন।' : 'Make your business deliveries simpler with LogiCompare.') : (language === 'bn' ? 'আপনার রেট ও চালান দেখতে লগইন করুন।' : 'Sign in to view your rates and shipments.');
  submitLabel.textContent = isRegistering ? (language === 'bn' ? 'রেজিস্ট্রেশন করুন' : 'Create account') : (language === 'bn' ? 'লগইন করুন' : 'Sign in');
}

function setAuthMethod(method) {
  authMethod = method;
  document.querySelectorAll('.auth-method').forEach((button) => button.classList.toggle('is-active', button.dataset.method === method));
  setMode(authMode);
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
document.querySelectorAll('.auth-method').forEach((button) => button.addEventListener('click', () => setAuthMethod(button.dataset.method)));
document.querySelectorAll('.language-button').forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.language)));

document.querySelector('.password-toggle').addEventListener('click', (event) => {
  const password = document.querySelector('#password');
  const showing = password.type === 'text';
  password.type = showing ? 'password' : 'text';
  event.currentTarget.textContent = showing ? (language === 'bn' ? 'দেখুন' : 'Show') : (language === 'bn' ? 'লুকান' : 'Hide');
});

document.querySelectorAll('a[href="#forgot"], a[href="#terms"], a[href="#privacy"]').forEach((link) => link.addEventListener('click', (event) => {
  event.preventDefault();
  const messages = { '#forgot': language === 'bn' ? 'পাসওয়ার্ড রিসেট করতে support@logicompare.bd-এ যোগাযোগ করুন' : 'Contact support@logicompare.bd to reset your password', '#terms': language === 'bn' ? 'ব্যবহারের শর্ত শিগগিরই প্রকাশ করা হবে' : 'Terms of use will be published shortly', '#privacy': language === 'bn' ? 'গোপনীয়তা নীতি শিগগিরই প্রকাশ করা হবে' : 'Privacy policy will be published shortly' };
  showToast(messages[link.getAttribute('href')]);
}));

authForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const phone = normalizePhone(document.querySelector('#phone').value.trim());
  const email = document.querySelector('#email').value.trim().toLowerCase();
  const password = document.querySelector('#password').value;
  const fullName = document.querySelector('#full-name').value.trim();
  if (authMethod === 'phone' && !/^01\d{9}$/.test(phone)) {
    showToast(language === 'bn' ? 'সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন' : 'Enter a valid 11-digit Bangladesh mobile number');
    document.querySelector('#phone').focus();
    return;
  }
  if (authMethod === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast(language === 'bn' ? 'সঠিক ইমেইল ঠিকানা দিন' : 'Enter a valid email address');
    document.querySelector('#email').focus();
    return;
  }
  if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
    showToast(language === 'bn' ? 'পাসওয়ার্ডে ৮ অক্ষর, বড় হাতের অক্ষর, ছোট হাতের অক্ষর ও সংখ্যা রাখুন' : 'Use 8+ characters with uppercase, lowercase, and a number');
    return;
  }
  const identifier = authMethod === 'phone' ? phone : email;
  const attempts = failedAttempts(identifier);
  if (attempts.lockedUntil > Date.now()) {
    const minutes = Math.ceil((attempts.lockedUntil - Date.now()) / 60000);
    showToast(language === 'bn' ? `${minutes} মিনিট পরে আবার চেষ্টা করুন` : `Try again in ${minutes} minutes`);
    return;
  }
  if (authMode === 'register') {
    if (!fullName) {
      showToast(language === 'bn' ? 'আপনার নাম লিখুন' : 'Enter your full name');
      return;
    }
    if (accounts.some((account) => account[authMethod] === identifier)) {
      showToast(language === 'bn' ? 'এই নম্বরে আগে থেকেই অ্যাকাউন্ট আছে' : 'An account already exists for this number');
      setMode('login');
      return;
    }
    const salt = crypto.randomUUID();
    const passwordHash = await hashPassword(password, salt);
    const account = { id: `customer-${Date.now()}`, name: fullName, ...(authMethod === 'phone' ? { phone } : { email }), salt, passwordHash, role: 'customer' };
    accounts = [...accounts, account];
    localStorage.setItem('logicompare-accounts', JSON.stringify(accounts));
    createSession(account);
    showToast(language === 'bn' ? 'আপনার অ্যাকাউন্ট তৈরি হয়েছে' : 'Your account has been created');
  } else {
    const account = accounts.find((item) => item[authMethod] === identifier);
    const passwordHash = account ? await hashPassword(password, account.salt) : '';
    if (!account || passwordHash !== account.passwordHash) {
      recordFailedAttempt(identifier);
      showToast(language === 'bn' ? 'মোবাইল নম্বর বা পাসওয়ার্ড সঠিক নয়' : 'Incorrect phone number or password');
      return;
    }
    clearFailedAttempts(identifier);
    createSession(account);
    showToast(language === 'bn' ? 'লগইন সফল হয়েছে' : 'Signed in successfully');
  }
  window.setTimeout(() => { window.location.href = window.location.protocol === 'file:' ? 'index.html#compare' : 'react.html#/'; }, 900);
});

function syncModeFromHash() {
  setMode(window.location.hash.toLowerCase().includes('register') ? 'register' : 'login');
}

window.addEventListener('hashchange', syncModeFromHash);
setLanguage(language);
syncModeFromHash();
