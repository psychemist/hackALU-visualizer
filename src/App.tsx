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
      <div className="grid h-full gap-6 lg:grid-cols-3">
        {/* Left Panel - Inputs */}
        <div className="space-y-4 lg:col-span-1">
          <InputPanel />
        </div>

        {/* Center Panel - Visualizer */}
        <div className="space-y-4 lg:col-span-1">
          <ALUVisualizer />
          <StepController />
        </div>

        {/* Right Panel - Output & Timeline */}
        <div className="space-y-4 lg:col-span-1">
          <OutputPanel />
          <TimelineView />
        </div>
      </div>
    </Layout>
  );
}

export default App;
