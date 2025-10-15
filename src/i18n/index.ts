import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { env } from '@/config/env'
import common from './locales/en/common.json'

export const defaultNS = 'common' as const

export const resources = {
  en: {
    common,
  },
} as const

void i18n.use(initReactI18next).init({
  resources,
  lng: env.defaultLocale,
  fallbackLng: 'en',
  defaultNS,
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
