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
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 max-h-[80vh] overflow-y-auto"
          >
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">Log Slip-Up</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <p className="text-blue-900 text-center">
                    It's okay to have setbacks. Logging helps you understand your patterns. 
                    Every moment is a new chance to start fresh! 💙
                  </p>
                </div>

                {/* Location */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-gray-700">
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
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Craving Strength */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-gray-700">
                    <Activity className="w-5 h-5" />
                    Craving Strength
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">Mild</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={cravingStrength}
                      onChange={(e) => setCravingStrength(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500">Strong</span>
                  </div>
                  <div className="text-center">
                    <span className="inline-block bg-gray-100 rounded-full px-4 py-2">
                      Level {cravingStrength}/5
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-gray-600 text-white rounded-xl py-4 hover:bg-gray-700 transition-colors"
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
