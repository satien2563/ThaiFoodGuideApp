<<<<<<< HEAD
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import zh from './locales/zh.json';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    lng: Localization.locale?.startsWith('zh') ? 'zh' : 'en', // ใช้ 'zh' ถ้าภาษาระบบเริ่มด้วย zh
    fallbackLng: 'en', // ✅ English เป็นภาษาหลัก
    react: { useSuspense: false },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
=======
// ─── i18n.js ───
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import zh from './locales/zh.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: {
    en: { translation: en },
    zh: { translation: zh },
  },
  lng: 'en', // เริ่มต้นเป็นภาษาอังกฤษ
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
>>>>>>> 4e32320c7dd7c00d7db8810f9701a3a5a57e2cff
