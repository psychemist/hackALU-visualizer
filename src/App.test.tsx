import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it } from 'vitest'
import App from './App'
import i18n from './i18n'

describe('App', () => {
  it('renders the Phase 0 callout', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>,
    )

    expect(screen.getByRole('heading', { name: /ALU Visualizer/i })).toBeInTheDocument()
    expect(
      screen.getByText(/Phase 1 will focus on the pure simulation core/i),
    ).toBeInTheDocument()
  })
})
