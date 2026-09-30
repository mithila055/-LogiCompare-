export function formatPrice(value, language = 'en') {
  return new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(value);
}
