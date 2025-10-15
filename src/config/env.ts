import { z } from 'zod'

const schema = z
  .object({
    VITE_APP_NAME: z.string().trim().optional(),
    VITE_DEFAULT_LOCALE: z.string().trim().optional(),
  })
  .catchall(z.unknown())

const parsed = schema.safeParse(import.meta.env)

if (!parsed.success) {
  console.warn('Invalid environment variable configuration detected', parsed.error.issues)
}

const envVars = parsed.success ? parsed.data : {}

export const env = {
  appName: envVars.VITE_APP_NAME ?? 'ALU Visualizer',
  defaultLocale: envVars.VITE_DEFAULT_LOCALE ?? 'en',
} as const
