import { useState } from 'react';
import { CigaretteLog } from '../App';
import { X, MapPin, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (log: Omit<CigaretteLog, 'id'>) => void;
}

const LOCATIONS = [
  'At Home',
  'At Work',
  'In Car',
  'With Coffee',
  'After Meal',
  'During Break',
  'Social Event',
  'During Stress',
  'Other',
];

export function QuickLogModal({ isOpen, onClose, onSubmit }: QuickLogModalProps) {
  const [location, setLocation] = useState('');
  const [cravingStrength, setCravingStrength] = useState(3);

  const handleSubmit = () => {
    onSubmit({
      timestamp: Date.now(),
      location: location || undefined,
      cravingStrength,
    });
    setLocation('');
    setCravingStrength(3);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-base rounded-3xl p-8 z-50 max-w-md w-[90%] mx-auto"
          >
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-text">Log Slip-Up</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-surface0 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-blue/20 border-2 border-blue rounded-xl p-4">
                  <p className="text-blue text-center">
                    It's okay to have setbacks. Logging helps you understand your patterns. 
                    Every moment is a new chance to start fresh! 💙
                  </p>
                </div>

                {/* Location */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-subtext1">
                    <MapPin className="w-5 h-5" />
                    Where/When? (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {LOCATIONS.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => setLocation(loc)}
                        className={`px-4 py-2 rounded-xl border-2 transition-colors ${
                          location === loc
                            ? 'bg-blue text-crust border-blue'
                            : 'bg-base text-subtext1 border-surface1 hover:border-blue'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Craving Strength */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-subtext1">
                    <Activity className="w-5 h-5" />
                    Craving Strength
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-subtext1">Mild</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={cravingStrength}
                      onChange={(e) => setCravingStrength(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-subtext1">Strong</span>
                  </div>
                  <div className="text-center">
                    <span className="inline-block bg-surface0 rounded-full px-4 py-2">
                      Level {cravingStrength}/5
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue text-crust rounded-xl py-4 hover:bg-overlay2 transition-colors"
                >
                  Log & Continue Journey
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
