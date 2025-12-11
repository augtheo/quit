import { useState } from 'react';
import { UserProfile } from '../App';
import { Wind, Brain, Coffee, Footprints, Music, Phone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CopingMechanismsProps {
  userProfile: UserProfile;
}

interface CopingTechnique {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: string;
  category: 'breathing' | 'distraction' | 'physical' | 'mental';
  instructions: string[];
}

const TECHNIQUES: CopingTechnique[] = [
  {
    id: '1',
    title: '4-7-8 Breathing',
    description: 'A calming breathing exercise to reduce cravings',
    duration: '1 minute',
    icon: 'wind',
    category: 'breathing',
    instructions: [
      'Exhale completely through your mouth',
      'Close your mouth and inhale through your nose for 4 seconds',
      'Hold your breath for 7 seconds',
      'Exhale completely through your mouth for 8 seconds',
      'Repeat 3-4 times',
    ],
  },
  {
    id: '2',
    title: 'The 5-4-3-2-1 Technique',
    description: 'Ground yourself in the present moment',
    duration: '2 minutes',
    icon: 'brain',
    category: 'mental',
    instructions: [
      'Name 5 things you can see around you',
      'Name 4 things you can touch',
      'Name 3 things you can hear',
      'Name 2 things you can smell',
      'Name 1 thing you can taste',
      'Take a deep breath and notice how you feel',
    ],
  },
  {
    id: '3',
    title: 'Quick Walk',
    description: 'Move your body to shift your focus',
    duration: '5 minutes',
    icon: 'footprints',
    category: 'physical',
    instructions: [
      'Stand up and stretch',
      'Walk around your space or step outside',
      'Focus on your breathing and surroundings',
      'Notice how your body feels as you move',
      'Return when the craving passes',
    ],
  },
  {
    id: '4',
    title: 'Drink Water',
    description: 'Hydrate and occupy your hands and mouth',
    duration: '30 seconds',
    icon: 'coffee',
    category: 'distraction',
    instructions: [
      'Get a glass of cold water',
      'Drink slowly, focusing on the sensation',
      'Hold the glass with both hands',
      'Take small sips and breathe between them',
      'Notice how refreshed you feel',
    ],
  },
  {
    id: '5',
    title: 'Call a Friend',
    description: 'Connect with someone who supports your journey',
    duration: '5-10 minutes',
    icon: 'phone',
    category: 'distraction',
    instructions: [
      'Think of someone supportive',
      'Call or text them',
      'Share that you\'re having a craving',
      'Talk about anything to distract yourself',
      'Thank them for their support',
    ],
  },
  {
    id: '6',
    title: 'Playlist Power',
    description: 'Use music to change your mood',
    duration: '3-5 minutes',
    icon: 'music',
    category: 'distraction',
    instructions: [
      'Put on your favorite upbeat song',
      'Turn up the volume',
      'Sing along or dance if you can',
      'Let the music shift your energy',
      'Notice the craving fade',
    ],
  },
];

export function CopingMechanisms({ userProfile }: CopingMechanismsProps) {
  const [selectedTechnique, setSelectedTechnique] = useState<CopingTechnique | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'wind':
        return <Wind className="w-8 h-8" />;
      case 'brain':
        return <Brain className="w-8 h-8" />;
      case 'footprints':
        return <Footprints className="w-8 h-8" />;
      case 'coffee':
        return <Coffee className="w-8 h-8" />;
      case 'phone':
        return <Phone className="w-8 h-8" />;
      case 'music':
        return <Music className="w-8 h-8" />;
      default:
        return <Wind className="w-8 h-8" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'breathing':
        return 'from-blue-400 to-cyan-500';
      case 'mental':
        return 'from-purple-400 to-pink-500';
      case 'physical':
        return 'from-green-400 to-emerald-500';
      case 'distraction':
        return 'from-orange-400 to-red-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const startTechnique = (technique: CopingTechnique) => {
    setSelectedTechnique(technique);
    setCurrentStep(0);
    setIsActive(true);
  };

  const nextStep = () => {
    if (selectedTechnique && currentStep < selectedTechnique.instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const closeTechnique = () => {
    setSelectedTechnique(null);
    setCurrentStep(0);
    setIsActive(false);
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 pt-4"
        >
          <h1 className="text-blue-900">Coping Tools</h1>
          <p className="text-gray-600">
            Quick techniques to beat cravings when they hit
          </p>
        </motion.div>

        {/* Emergency Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-red-400 to-pink-500 rounded-3xl p-6 text-white shadow-xl"
        >
          <h2 className="mb-2">Craving Right Now?</h2>
          <p className="text-sm opacity-90 mb-4">
            Pick a technique below and follow the steps. Cravings typically pass in 3-5 minutes!
          </p>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-sm">
              Remember: <strong>Cravings are temporary.</strong> You are stronger! 💪
            </p>
          </div>
        </motion.div>

        {/* Techniques Grid */}
        <div className="space-y-4">
          <h2 className="text-gray-900">Choose a Technique</h2>
          
          <div className="space-y-3">
            {TECHNIQUES.map((technique, index) => (
              <motion.button
                key={technique.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => startTechnique(technique)}
                className={`w-full text-left bg-gradient-to-r ${getCategoryColor(
                  technique.category
                )} rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all active:scale-98`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                    {getIcon(technique.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-white">{technique.title}</h3>
                      <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                        {technique.duration}
                      </span>
                    </div>
                    <p className="text-sm text-white/90">{technique.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg space-y-4"
        >
          <h3 className="text-gray-900">Quick Tips</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>✓ Cravings usually last 3-5 minutes</p>
            <p>✓ The urge will pass whether you smoke or not</p>
            <p>✓ Every craving you resist makes you stronger</p>
            <p>✓ Use multiple techniques if needed</p>
          </div>
        </motion.div>
      </div>

      {/* Technique Modal */}
      <AnimatePresence>
        {isActive && selectedTechnique && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeTechnique}
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br ${getCategoryColor(
                selectedTechnique.category
              )} rounded-3xl p-8 z-50 max-w-md w-[90%] mx-auto shadow-2xl text-white`}
            >
              <button
                onClick={closeTechnique}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                    {getIcon(selectedTechnique.icon)}
                  </div>
                  <h2 className="mb-2">{selectedTechnique.title}</h2>
                  <p className="text-sm opacity-90">{selectedTechnique.description}</p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm">
                      Step {currentStep + 1} of {selectedTechnique.instructions.length}
                    </span>
                  </div>
                  
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center"
                  >
                    <p className="text-xl leading-relaxed">
                      {selectedTechnique.instructions[currentStep]}
                    </p>
                  </motion.div>
                </div>

                <div className="flex gap-3">
                  {currentStep > 0 && (
                    <button
                      onClick={previousStep}
                      className="flex-1 bg-white/20 backdrop-blur-sm text-white rounded-xl py-3 hover:bg-white/30 transition-colors"
                    >
                      Previous
                    </button>
                  )}
                  {currentStep < selectedTechnique.instructions.length - 1 ? (
                    <button
                      onClick={nextStep}
                      className="flex-1 bg-white text-gray-900 rounded-xl py-3 hover:bg-gray-100 transition-colors"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      onClick={closeTechnique}
                      className="flex-1 bg-white text-gray-900 rounded-xl py-3 hover:bg-gray-100 transition-colors"
                    >
                      Complete! 🎉
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
