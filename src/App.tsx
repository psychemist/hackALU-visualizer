import { useEffect } from 'react';
import { Layout } from './components/Layout';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { useALUStore } from './store/aluStore';

function App() {
  const compute = useALUStore((state) => state.compute);

  // Compute initial result on mount
  useEffect(() => {
    compute();
  }, [compute]);

  return (
    <Layout>
      <div className="grid h-full gap-6 lg:grid-cols-3">
        {/* Left Panel - Inputs */}
        <div className="lg:col-span-1">
          <InputPanel />
        </div>

        {/* Center Panel - Visualizer (placeholder for now) */}
        <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-600 lg:col-span-1">
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Visualizer Coming Soon
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Pipeline visualization will be implemented in Phase 4
            </p>
          </div>
        </div>

        {/* Right Panel - Output */}
        <div className="lg:col-span-1">
          <OutputPanel />
        </div>
      </div>
    </Layout>
  );
}

export default App;
