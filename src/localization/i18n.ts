import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';

import en from './translations/en.json';
import frCA from './translations/fr-CA.json';

const resources = {
  en: { translation: en },
  'fr-CA': { translation: frCA },
};

const deviceLanguage = getLocales()[0]?.languageTag ?? 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
