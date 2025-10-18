import { useEffect } from 'react';
import { Layout } from './components/Layout';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { ALUVisualizer, StepController, TimelineView } from './components/visualizer';
import { useALUStore } from './store/aluStore';
import { useAnimationLoop } from './hooks/useAnimationLoop';

function App() {
  const compute = useALUStore((state) => state.compute);

  // Compute initial result on mount
  useEffect(() => {
    compute();
  }, [compute]);

  // Enable animation loop
  useAnimationLoop();

  return (
    <Layout>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Panel - Inputs */}
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Inputs
              </h2>
            </div>
            <div className="p-4">
              <InputPanel />
            </div>
          </div>
        </div>

        {/* Center Panel - Visualizer */}
        <div className="space-y-4 lg:col-span-6">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                ALU Pipeline
              </h2>
            </div>
            <div className="p-4">
              <ALUVisualizer />
            </div>
          </div>
          
          <StepController />
          
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <TimelineView />
          </div>
        </div>

        {/* Right Panel - Output */}
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Result & Details
              </h2>
            </div>
            <div className="p-4">
              <OutputPanel />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
