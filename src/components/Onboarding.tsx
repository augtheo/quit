import { useState } from 'react';
import { UserProfile } from '../App';
import { Cigarette, DollarSign, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [quitDate, setQuitDate] = useState('');
  const [dailyCigarettes, setDailyCigarettes] = useState('');
  const [costPerPack, setCostPerPack] = useState('');
  const [cigarettesPerPack, setCigarettesPerPack] = useState('20');
  const [myWhy, setMyWhy] = useState('');

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleComplete = () => {
    const profile: UserProfile = {
      quitDate,
      dailyCigarettes: parseInt(dailyCigarettes),
      costPerPack: parseFloat(costPerPack),
      cigarettesPerPack: parseInt(cigarettesPerPack),
      myWhy,
      setupComplete: true,
    };
    onComplete(profile);
  };

  const canProceed = () => {
    if (step === 1) return quitDate !== '';
    if (step === 2) return dailyCigarettes !== '' && parseInt(dailyCigarettes) > 0;
    if (step === 3) return costPerPack !== '' && parseFloat(costPerPack) > 0;
    if (step === 4) return myWhy.trim() !== '';
    return false;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card text-foreground rounded-3xl shadow-2xl p-8"
      >
        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition-colors ${
                i <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Quit Date */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Cigarette className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-center text-foreground">Welcome to Quieres fumar?</h1>
              <p className="text-center text-muted-foreground">
                Let's start your journey to a smoke-free life!
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-muted-foreground">When did you (or will you) quit?</label>
              <Input
                type="date"
                value={quitDate}
              className="text-white-75"
                onChange={(e) => setQuitDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </motion.div>
        )}

        {/* Step 2: Daily Cigarettes */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Cigarette className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-center text-foreground">Your Baseline</h2>
              <p className="text-center text-muted-foreground">
                How many cigarettes did you smoke per day on average?
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-muted-foreground">Cigarettes per day</label>
              <Input
                type="number"
              className="text-white-75"
                value={dailyCigarettes}
                onChange={(e) => setDailyCigarettes(e.target.value)}
                min="1"
                placeholder="e.g., 10"
              />
            </div>
          </motion.div>
        )}

        {/* Step 3: Cost Per Pack */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-center text-foreground">Financial Freedom</h2>
              <p className="text-center text-muted-foreground">
                Let's calculate how much money you're saving!
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-muted-foreground">Cost per pack (₹)</label>
                <Input
                  type="number"
              className="text-white-75"
                  value={costPerPack}
                  onChange={(e) => setCostPerPack(e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="e.g., 350"
                />
              </div>

              <div className="space-y-2">
                <label className="text-muted-foreground">Cigarettes per pack</label>
                <Select
                  value={cigarettesPerPack}
                  onValueChange={setCigarettesPerPack}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a value" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20 (Standard)</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: My Why */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-center text-foreground">Your Why</h2>
              <p className="text-center text-muted-foreground">
                What's your personal motivation for quitting?
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-muted-foreground">My reason for quitting</label>
              <Textarea
                value={myWhy}
              className="text-white-75"
                onChange={(e) => setMyWhy(e.target.value)}
                placeholder="e.g., To run a 5k, Save monies "
                rows={4}
              />
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 px-6 py-3 border-2 border-border text-muted-foreground rounded-xl hover:bg-muted transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={step === 4 ? handleComplete : handleNext}
            disabled={!canProceed()}
            className="flex-1 px-6 py-3 bg-primary text-crust rounded-xl hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {step === 4 ? "Let's Start!" : 'Next'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
