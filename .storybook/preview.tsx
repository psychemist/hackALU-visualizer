import type { Decorator, Preview } from '@storybook/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../src/i18n'
import '../src/index.css'

const withI18n: Decorator = (Story) => (
  <I18nextProvider i18n={i18n}>
    <Story />
  </I18nextProvider>
)

const preview: Preview = {
  decorators: [withI18n],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'slate',
      values: [
        { name: 'slate', value: '#0f172a' },
        { name: 'light', value: '#f8fafc' },
      ],
    },
    layout: 'fullscreen',
  },
}

export default preview
