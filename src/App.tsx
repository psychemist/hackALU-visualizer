import { useTranslation } from 'react-i18next'
import { env } from './config/env'

const checklist = [
  'scaffold.checkpoints.tooling',
  'scaffold.checkpoints.testing',
  'scaffold.checkpoints.storybook',
  'scaffold.checkpoints.pwa',
] as const

function App() {
  const { t } = useTranslation()
  const resourceList = t('scaffold.resources.items', { returnObjects: true }) as string[]

  return (
    <div className="flex min-h-dvh flex-col bg-background text-slate-100">
      <header className="border-b border-slate-800 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-base font-semibold tracking-wide text-slate-100">
            {env.appName}
          </span>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase text-emerald-300">
            {t('scaffold.phase0Banner')}
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
        <section className="rounded-xl border border-slate-800 bg-surface/80 p-6 shadow-xl shadow-black/20">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            {t('scaffold.title')}
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-300">
            {t('scaffold.subtitle')}
          </p>

          <ul className="mt-6 space-y-3">
            {checklist.map((key, index) => (
              <li key={key} className="flex items-center gap-3 text-sm text-slate-200">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 font-mono text-xs text-emerald-300">
                  {index + 1}
                </span>
                {t(key)}
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-xl border border-slate-800 bg-surface/70 p-6">
            <h2 className="text-lg font-semibold text-white">
              {t('scaffold.nextSteps.title')}
            </h2>
            <p className="mt-2 text-sm text-slate-300">{t('scaffold.nextSteps.body')}</p>
          </article>
          <article className="rounded-xl border border-slate-800 bg-surface/70 p-6">
            <h2 className="text-lg font-semibold text-white">
              {t('scaffold.resources.title')}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              {resourceList.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span aria-hidden className="text-sky-400">
                    •
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-surface/90 px-6 py-4 text-center text-xs text-slate-500">
        {t('scaffold.footer')}
      </footer>
    </div>
  )
}

export default App
