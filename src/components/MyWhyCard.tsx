import { X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MyWhyCardProps {
  isOpen: boolean;
  onClose: () => void;
  myWhy: string;
}

export function MyWhyCard({ isOpen, onClose, myWhy }: MyWhyCardProps) {
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-pink to-mauve rounded-3xl p-8 z-50 max-w-md w-[90%] mx-auto shadow-2xl"
          >
            <div className="text-center space-y-6 text-crust">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-base/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto"
              >
                <Heart className="w-10 h-10 text-crust" />
              </motion.div>

              <div>
                <h2 className="mb-4">Your Why</h2>
                <div className="bg-base/20 backdrop-blur-sm rounded-2xl p-6">
                  <p className="text-xl leading-relaxed">
                    {myWhy}
                  </p>
                </div>
              </div>

              <div className="bg-base/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm">
                  Remember this moment. This is why you're on this journey. 
                  You're stronger than any craving. 💪
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-base text-mauve rounded-xl py-4 hover:bg-surface0 transition-colors shadow-lg"
              >
                I'm Ready to Continue
              </button>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-base/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-crust" />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
