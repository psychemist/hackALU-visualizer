/**
 * Main Layout Component
 * Responsive SPA layout with top bar, panels, and footer
 */

import type { ReactNode } from 'react';

interface LayoutProps {
  children?: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Top Bar */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                ALU Visualizer
              </h1>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Hack ALU
              </span>
            </div>
            <nav className="flex items-center space-x-4">
              <button
                type="button"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                aria-label="Toggle theme"
              >
                Theme
              </button>
              <button
                type="button"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Share
              </button>
              <button
                type="button"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Export
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Panel - Inputs */}
            <aside className="lg:col-span-3">
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Inputs
                </h2>
                <div id="left-panel-content" className="space-y-4">
                  {/* Input components will go here */}
                </div>
              </div>
            </aside>

            {/* Center Panel - Visualizer */}
            <section className="lg:col-span-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  ALU Pipeline
                </h2>
                <div id="center-visualizer" className="min-h-96">
                  {children ?? (
                    <div className="flex h-96 items-center justify-center text-gray-500 dark:text-gray-400">
                      Visualizer will appear here
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Right Panel - Details */}
            <aside className="lg:col-span-3">
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Result & Details
                </h2>
                <div id="right-panel-content" className="space-y-4">
                  {/* Result components will go here */}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ALU Visualizer – Nand2Tetris Hack ALU Implementation
            </p>
            <div className="flex space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <a href="#about" className="hover:text-gray-900 dark:hover:text-gray-200">
                About
              </a>
              <a href="#keyboard" className="hover:text-gray-900 dark:hover:text-gray-200">
                Keyboard Shortcuts
              </a>
              <a href="#accessibility" className="hover:text-gray-900 dark:hover:text-gray-200">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
