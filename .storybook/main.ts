import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal(existingConfig) {
    return mergeConfig(existingConfig, {
      resolve: {
        alias: {
          '@': resolve(fileURLToPath(new URL('../src', import.meta.url))),
        },
      },
    })
  },
}

export default config
