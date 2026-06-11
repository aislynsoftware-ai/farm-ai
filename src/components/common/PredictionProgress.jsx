import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles, FileCheck, Loader } from 'lucide-react';

const steps = [
  { key: 'uploading', label: 'Uploading image...', icon: Upload },
  { key: 'analyzing', label: 'Analyzing with AI...', icon: Sparkles },
  { key: 'results', label: 'Fetching results...', icon: FileCheck },
];

export default function PredictionProgress({ startTime }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 300);
    return () => clearInterval(id);
  }, []);

  const elapsed = now - startTime;

  let currentStep = 0;
  if (elapsed > 2000) currentStep = 1;
  if (elapsed > 5000) currentStep = 2;

  const progress = Math.min(95, Math.round((elapsed / 8000) * 100));

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Processing</span>
        <span className="text-xs text-emerald-500">{progress}%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
      <div className="space-y-2">
        {steps.map((step, i) => {
          const StepIcon = step.icon;
          const active = i === currentStep;
          const done = i < currentStep;
          return (
            <div key={step.key} className="flex items-center gap-2.5">
              {active ? (
                <Loader size={14} className="text-emerald-500 animate-spin" />
              ) : (
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${done ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-600'}`}>
                  {done && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              )}
              <span className={`text-xs ${active ? 'text-emerald-700 dark:text-emerald-300 font-medium' : done ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-500'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
