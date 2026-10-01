const form = document.querySelector('#rate-form');
const originInput = document.querySelector('#origin');
const destinationInput = document.querySelector('#destination');
const weightInput = document.querySelector('#weight');
const rateRows = [...document.querySelectorAll('#rate-rows tr')];
const rateBody = document.querySelector('#rate-rows');
const emptyState = document.querySelector('#empty-state');
const toast = document.querySelector('#toast');
let activeFilter = 'all';
let sortAscending = true;
let toastTimer;
let language = localStorage.getItem('logicompare-language') || 'bn';

const dashboardCopy = {
  bn: {
    workspace: 'ওয়ার্কস্পেস', account: 'অ্যাকাউন্ট', compare: 'রেট তুলনা', booking: 'পিকআপ বুক করুন', tracking: 'চালান ট্র্যাক করুন', shipments: 'চালান', analytics: 'বিশ্লেষণ', accountLink: 'অ্যাকাউন্ট', help: 'সহায়তা কেন্দ্র', greeting: 'শুভ সকাল, রাফি', date: 'বুধবার, ১৪ আগস্ট ২০২৪',
    heroEyebrow: 'বাংলাদেশ ডেলিভারি ইন্টেলিজেন্স', heroTitle: 'আরও বুদ্ধিমান ডেলিভারি।<br /><em>খরচ কমান।</em>', heroDescription: 'ঢাকা থেকে দেশের যেকোনো প্রান্তে পাঠানোর আগে এক জায়গায় কুরিয়ার ও ট্রাকিং রেট তুলনা করুন।',
    originLabel: 'পাঠাবেন যেখান থেকে', destinationLabel: 'পাঠাবেন যেখানে', weightLabel: 'ওজন', weightUnit: 'কেজি', compareButton: 'রেট তুলনা করুন', liveMeta: 'সরাসরি কুরিয়ার রেট', updatedMeta: '২ মিনিটের মধ্যে আপডেট হয়েছে', latest: 'আপনার সর্বশেষ তুলনা', bestRates: 'আপনার রুটের সেরা রেট', viewAll: 'সব তুলনা দেখুন', allRates: 'সব রেট', recommended: 'সেরা পছন্দ', fastest: 'দ্রুততম', sortLow: 'কম খরচ', sortHigh: 'বেশি খরচ', noRates: 'এই ভিউতে কোনো রেট নেই।', save: 'রেট সংরক্ষণ করুন',
    table: ['কুরিয়ার', 'সেবা', 'সম্ভাব্য ডেলিভারি', 'খরচ', 'নির্ভরযোগ্যতা'], savings: 'সম্ভাব্য সাশ্রয়', savingsValue: '৳১,২৮৪.৬০', month: 'এই মাসে', reliability: 'কুরিয়ার নির্ভরযোগ্যতা', rating: 'গড় রেটিং', reliabilityValue: '৯৪.২%', completed: '১২৮টি সম্পন্ন চালানের ভিত্তিতে', activeLane: 'সবচেয়ে সক্রিয় রুট', shipmentsMonth: 'এই মাসে ২৬টি চালান', footerPrivacy: 'গোপনীয়তা', footerTerms: 'শর্তাবলি', system: 'সব সিস্টেম সচল'
  },
  en: {
    workspace: 'Workspace', account: 'Account', compare: 'Compare rates', booking: 'Book pickup', tracking: 'Track shipment', shipments: 'Shipments', analytics: 'Analytics', accountLink: 'Account', help: 'Help center', greeting: 'Good morning, Rafi', date: 'Wednesday, 14 August 2024',
    heroEyebrow: 'Bangladesh delivery intelligence', heroTitle: 'Deliver smarter.<br /><em>Spend less.</em>', heroDescription: 'Compare courier and freight rates before sending from Dhaka to anywhere in Bangladesh.',
    originLabel: 'Ship from', destinationLabel: 'Ship to', weightLabel: 'Weight', weightUnit: 'kg', compareButton: 'Compare rates', liveMeta: 'Live courier pricing', updatedMeta: 'Updated less than 2 min ago', latest: 'Your latest comparison', bestRates: 'Best rates for your route', viewAll: 'View all comparisons', allRates: 'All rates', recommended: 'Recommended', fastest: 'Fastest', sortLow: 'Lowest price', sortHigh: 'Highest price', noRates: 'No rates match this view.', save: 'Save rate',
    table: ['Carrier', 'Service', 'Est. delivery', 'Price', 'Confidence'], savings: 'Potential savings', savingsValue: 'BDT 1,284.60', month: 'this month', reliability: 'Carrier reliability', rating: 'avg. rating', reliabilityValue: '94.2%', completed: 'Across 128 completed shipments', activeLane: 'Most active lane', shipmentsMonth: '26 shipments this month', footerPrivacy: 'Privacy', footerTerms: 'Terms', system: 'All systems operational'
  }
};

const rowCopy = {
  bn: [['সুন্দরবন', 'ইকোনমি ডেলিভারি', 'পার্সেল', '১৬ আগস্ট', '২-৩ কর্মদিবস', '৳২৮০', 'সব খরচসহ', '৯৮% মিল'], ['রেডএক্স', 'প্রায়োরিটি ডেলিভারি', 'পার্সেল', '১৫ আগস্ট', '১-২ কর্মদিবস', '৳৩২০', 'সব খরচসহ', '৯৫% মিল'], ['পাঠাও', 'এক্সপ্রেস ডেলিভারি', 'পার্সেল', '১৫ আগস্ট', '১ কর্মদিবস', '৳৩৫০', 'সব খরচসহ', '৮৯% মিল'], ['কন্টিনেন্টাল', 'স্ট্যান্ডার্ড ডেলিভারি', 'পার্সেল', '১৭ আগস্ট', '৩-৪ কর্মদিবস', '৳৩৯০', 'সব খরচসহ', '৮৭% মিল'], ['ই-কুরিয়ার', 'রেগুলার ডেলিভারি', 'পার্সেল', '১৮ আগস্ট', '৪-৫ কর্মদিবস', '৳৪৫০', 'সব খরচসহ', '৮১% মিল']],
  en: [['Sundarban', 'Economy delivery', 'Parcel', 'Aug 16', '2-3 business days', 'BDT 280', 'all-in estimate', '98% match'], ['RedX', 'Priority delivery', 'Parcel', 'Aug 15', '1-2 business days', 'BDT 320', 'all-in estimate', '95% match'], ['Pathao', 'Express delivery', 'Parcel', 'Aug 15', '1 business day', 'BDT 350', 'all-in estimate', '89% match'], ['Continental', 'Standard delivery', 'Parcel', 'Aug 17', '3-4 business days', 'BDT 390', 'all-in estimate', '87% match'], ['eCourier', 'Regular delivery', 'Parcel', 'Aug 18', '4-5 business days', 'BDT 450', 'all-in estimate', '81% match']]
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

function textNode(element, value) {
  const node = [...element.childNodes].find((child) => child.nodeType === Node.TEXT_NODE && child.textContent.trim());
  if (node) node.textContent = value;
}

function setDashboardLanguage(nextLanguage) {
  language = nextLanguage;
  localStorage.setItem('logicompare-language', language);
  document.documentElement.lang = language;
  document.title = language === 'bn' ? 'LogiCompare বাংলাদেশ | ডেলিভারি রেট তুলনা' : 'LogiCompare Bangladesh | Delivery rate intelligence';
  const copy = dashboardCopy[language];
  document.querySelectorAll('.language-button').forEach((button) => { button.classList.toggle('is-active', button.dataset.language === language); button.textContent = language === 'bn' ? (button.dataset.language === 'bn' ? 'বাংলা' : 'ইংরেজি') : (button.dataset.language === 'bn' ? 'BN' : 'EN'); });
  document.querySelectorAll('.nav-label')[0].textContent = copy.workspace;
  document.querySelectorAll('.nav-label')[1].textContent = copy.account;
  const navItems = document.querySelectorAll('.nav-group:first-of-type .nav-item');
  [copy.compare, copy.booking, copy.tracking, copy.shipments, copy.analytics].forEach((label, index) => textNode(navItems[index], label));
  textNode(document.querySelector('.nav-group-bottom .nav-item'), copy.accountLink);
  textNode(document.querySelector('.nav-group-bottom a[href^="mailto"]'), copy.help);
  textNode(document.querySelector('#logout-button'), language === 'bn' ? 'লগআউট' : 'Log out');
  textNode(document.querySelector('.sidebar-footer strong'), language === 'bn' ? 'রাফি আহমেদ' : 'Rafi Ahmed');
  textNode(document.querySelector('.sidebar-footer span'), language === 'bn' ? 'অপারেশনস লিড' : 'Operations lead');
  textNode(document.querySelector('.topbar .eyebrow'), copy.date);
  textNode(document.querySelector('h1'), copy.greeting + ' ');
  document.querySelector('.hero-copy .eyebrow').textContent = copy.heroEyebrow;
  document.querySelector('#compare-title').innerHTML = copy.heroTitle;
  document.querySelector('.hero-copy p:last-child').textContent = copy.heroDescription;
  document.querySelector('.orbit-core small').textContent = language === 'bn' ? 'সরাসরি' : 'LIVE';
  document.querySelector('.node-one').textContent = language === 'bn' ? '৳' : '$';
  if (originInput.value === 'ঢাকা, বাংলাদেশ' || originInput.value === 'Dhaka, Bangladesh') originInput.value = language === 'bn' ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh';
  if (destinationInput.value === 'চট্টগ্রাম, বাংলাদেশ' || destinationInput.value === 'Chattogram, Bangladesh') destinationInput.value = language === 'bn' ? 'চট্টগ্রাম, বাংলাদেশ' : 'Chattogram, Bangladesh';
  if (weightInput.value === '২০' || weightInput.value === '20') weightInput.value = language === 'bn' ? '২০' : '20';
  document.querySelector('label[for="origin"]').textContent = copy.originLabel;
  document.querySelector('label[for="destination"]').textContent = copy.destinationLabel;
  document.querySelector('label[for="weight"]').textContent = copy.weightLabel;
  document.querySelector('.input-suffix').textContent = copy.weightUnit;
  document.querySelector('.primary-button').innerHTML = `<span>${copy.compareButton}</span><span aria-hidden="true">↗</span>`;
  document.querySelector('.search-meta').innerHTML = `<span class="live-dot"></span>${copy.liveMeta} <span class="meta-divider"></span>${copy.updatedMeta}`;
  document.querySelector('.section-heading .eyebrow').textContent = copy.latest;
  document.querySelector('#results-title').textContent = copy.bestRates;
  document.querySelector('#view-all').innerHTML = `${copy.viewAll} <span>→</span>`;
  const tabs = document.querySelectorAll('.tab');
  [copy.allRates, copy.recommended, copy.fastest].forEach((label, index) => { textNode(tabs[index], label + ' '); tabs[index].querySelector('span').textContent = language === 'bn' ? ['৫', '২', '২'][index] : ['5', '2', '2'][index]; });
  document.querySelector('#sort-button').innerHTML = `${language === 'bn' ? 'সাজান:' : 'Sort:'} <strong>${sortAscending ? copy.sortLow : copy.sortHigh}</strong> <span>⌄</span>`;
  document.querySelectorAll('th').forEach((header, index) => { if (index < copy.table.length) header.textContent = copy.table[index]; });
  document.querySelector('#empty-state').textContent = copy.noRates;
  document.querySelector('.savings-card p').textContent = copy.savings;
  document.querySelector('.savings-card > strong').textContent = copy.savingsValue;
  document.querySelector('.savings-card .trend small').textContent = copy.month;
  document.querySelector('.insight-card:nth-child(2) p').textContent = copy.reliability;
  document.querySelector('.insight-card:nth-child(2) > strong').textContent = copy.reliabilityValue;
  document.querySelector('.insight-card:nth-child(2) .trend small').textContent = copy.rating;
  document.querySelector('.insight-foot').textContent = copy.completed;
  document.querySelector('.route-insight p').textContent = copy.activeLane;
  document.querySelector('.route-insight strong').textContent = language === 'bn' ? 'পশ্চিম → মধ্যাঞ্চল' : 'West → Midwest';
  document.querySelector('.route-insight small').textContent = copy.shipmentsMonth;
  const footerLinks = document.querySelectorAll('.footer a');
  footerLinks[0].textContent = copy.footerPrivacy;
  footerLinks[1].textContent = copy.footerTerms;
  document.querySelector('.status').lastChild.textContent = copy.system;
  document.querySelectorAll('#rate-rows tr').forEach((row, index) => {
    const values = rowCopy[language][Number(row.dataset.rowIndex ?? index)];
    const cells = row.querySelectorAll('td');
    cells[0].querySelector('strong').textContent = values[0];
    cells[0].querySelector('small').textContent = values[1];
    cells[1].querySelector('.service-pill').textContent = values[2];
    cells[2].querySelector('strong').textContent = values[3];
    cells[2].querySelector('small').textContent = values[4];
    cells[3].querySelector('.price').textContent = values[5];
    cells[3].querySelector('small').textContent = values[6];
    cells[4].querySelector('.confidence').lastChild.textContent = values[7];
  });
}

function renderRates() {
  let visibleRows = rateRows.filter((row) => activeFilter === 'all' || row.dataset.tags.split(' ').includes(activeFilter));
  visibleRows.sort((a, b) => (Number(a.dataset.price) - Number(b.dataset.price)) * (sortAscending ? 1 : -1));
  rateRows.forEach((row) => { row.hidden = !visibleRows.includes(row); });
  visibleRows.forEach((row) => rateBody.appendChild(row));
  emptyState.hidden = visibleRows.length > 0;
}

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((item) => {
      item.classList.remove('is-active');
      item.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');
    activeFilter = tab.dataset.filter;
    renderRates();
  });
});

document.querySelector('#sort-button').addEventListener('click', (event) => {
  sortAscending = !sortAscending;
  const copy = dashboardCopy[language];
  event.currentTarget.innerHTML = `${language === 'bn' ? 'সাজান:' : 'Sort:'} <strong>${sortAscending ? copy.sortLow : copy.sortHigh}</strong> <span>⌄</span>`;
  renderRates();
});

document.querySelectorAll('.save-button').forEach((button) => {
  button.addEventListener('click', () => {
    const isSaved = button.classList.toggle('is-saved');
    button.textContent = isSaved ? '★' : '☆';
    showToast(isSaved ? (language === 'bn' ? 'রেট সংরক্ষণ করা হয়েছে' : 'Rate saved to your shortlist') : (language === 'bn' ? 'সংরক্ষিত রেট থেকে সরানো হয়েছে' : 'Rate removed from your shortlist'));
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const origin = originInput.value.trim() || 'your origin';
  const destination = destinationInput.value.trim() || 'your destination';
  const weight = Number(weightInput.value.replace(/[০-৯]/g, (digit) => '০১২৩৪৫৬৭৮৯'.indexOf(digit)));
  if (!Number.isFinite(weight) || weight <= 0) {
    weightInput.focus();
    showToast('সঠিক ওজন লিখুন');
    return;
  }
  document.querySelector('#results-title').textContent = language === 'bn' ? `সেরা রেট: ${origin} → ${destination}` : `Best rates: ${origin} to ${destination}`;
  showToast(language === 'bn' ? `${weight} কেজি চালানের রেট আপডেট হয়েছে` : `Rates refreshed for ${weight} kg shipment`);
  document.querySelector('#results-title').scrollIntoView({ behavior: 'smooth', block: 'center' });
});

document.querySelector('#view-all').addEventListener('click', () => { window.location.href = window.location.protocol === 'file:' ? 'index.html#compare' : 'react.html#/compare'; });
document.querySelector('.notification-button').addEventListener('click', () => showToast(language === 'bn' ? 'নতুন কোনো alert নেই। আপনার চালান ঠিক আছে।' : 'No new alerts. Your shipments are on track.'));
document.querySelector('#logout-button').addEventListener('click', () => { localStorage.removeItem('logicompare-user'); localStorage.removeItem('logicompare-session'); window.location.href = 'auth.html#login'; });
document.querySelectorAll('.language-button').forEach((button) => button.addEventListener('click', () => setDashboardLanguage(button.dataset.language)));
setDashboardLanguage(language);
renderRates();
