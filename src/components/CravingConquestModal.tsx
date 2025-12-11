import { X, Sparkles, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CravingConquestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConquer: () => void;
}

export function CravingConquestModal({ isOpen, onClose, onConquer }: CravingConquestModalProps) {
  const handleConquer = () => {
    onConquer();
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-8 z-50 max-w-md w-[90%] mx-auto"
          >
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto"
              >
                <Trophy className="w-10 h-10 text-white" />
              </motion.div>

              <div>
                <h2 className="text-green-600 mb-2">Amazing!</h2>
                <p className="text-gray-600">
                  You just conquered a craving! That takes real strength and determination.
                </p>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  <span className="text-2xl text-green-600">+10 Points</span>
                </div>
                <p className="text-sm text-gray-600">
                  Every craving you resist makes you stronger!
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleConquer}
                  className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl py-4 hover:from-green-500 hover:to-emerald-600 transition-all shadow-lg"
                >
                  Claim Victory! 🎉
                </button>
                <button
                  onClick={onClose}
                  className="w-full text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
