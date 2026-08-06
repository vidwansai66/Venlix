import { BrainCircuit } from 'lucide-react';

export const AssistantHeader = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-black text-brand-text tracking-tight flex items-center gap-2">
        <BrainCircuit className="text-primary" />
        AI Assistant
      </h1>
      <p className="text-muted mt-1 text-sm font-medium">
        Smart recommendations for safer and faster deliveries.
      </p>
    </div>
  );
};
export default AssistantHeader;
