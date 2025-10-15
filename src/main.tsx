import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import App from './App'
import './index.css'
import i18n from './i18n'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Root element with id "root" was not found in the document')
}

createRoot(container).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </StrictMode>,
)
