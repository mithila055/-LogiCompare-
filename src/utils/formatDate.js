export function formatDate(value, language = 'en') {
  return new Intl.DateTimeFormat(language === 'bn' ? 'bn-BD' : 'en-BD', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}
