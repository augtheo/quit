import { useState, useEffect } from 'react';
import { UserProfile } from '../App';
import { Save, Trash2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface SettingsProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onResetApp: () => void;
}

export function Settings({ userProfile, onUpdateProfile, onResetApp }: SettingsProps) {
  const [quitDate, setQuitDate] = useState(userProfile.quitDate);
  const [dailyCigarettes, setDailyCigarettes] = useState(userProfile.dailyCigarettes.toString());
  const [costPerPack, setCostPerPack] = useState(userProfile.costPerPack.toString());
  const [cigarettesPerPack, setCigarettesPerPack] = useState(userProfile.cigarettesPerPack.toString());
  const [myWhy, setMyWhy] = useState(userProfile.myWhy);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const updatedProfile: UserProfile = {
      quitDate,
      dailyCigarettes: parseInt(dailyCigarettes),
      costPerPack: parseFloat(costPerPack),
      cigarettesPerPack: parseInt(cigarettesPerPack),
      myWhy,
      setupComplete: true,
    };
    onUpdateProfile(updatedProfile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 pt-4"
        >
          <h1 className="text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Update your profile and preferences
          </p>
        </motion.div>

        {/* Save Confirmation */}
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green/20 border-2 border-green rounded-2xl p-4 text-center"
            >
              <p className="text-green">✓ Settings saved successfully!</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Form */}
        <div className="bg-card rounded-3xl p-6 shadow-lg space-y-6">
          <div className="space-y-2">
            <label className="text-muted-foreground">Quit Date</label>
            <Input
              type="date"
              className="text-white-75"
              value={quitDate}
              onChange={(e) => setQuitDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <label className="text-muted-foreground">Cigarettes per day (baseline)</label>
            <Input
              type="number"
              className="text-white-75"
              value={dailyCigarettes}
              onChange={(e) => setDailyCigarettes(e.target.value)}
              min="1"
            />
          </div>

          <div className="space-y-2">
            <label className="text-muted-foreground">Cost per pack (₹)</label>
            <Input
              type="number"
              className="text-white-75"
              value={costPerPack}
              onChange={(e) => setCostPerPack(e.target.value)}
              min="0"
              step="0.01"
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

          <div className="space-y-2">
            <label className="text-muted-foreground">My Why</label>
            <Textarea
              className="text-white-75"
              value={myWhy}
              onChange={(e) => setMyWhy(e.target.value)}
              rows={4}
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-primary text-crust rounded-xl py-3 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>

        {/* Privacy Note */}
        <div className="bg-green/20 border-2 border-green rounded-2xl p-4">
          <h3 className="text-green mb-2">Privacy</h3>
          <p className="text-sm text-green/80">
            All your data is stored locally on your device. Nothing is sent to any server. 
            Your information is completely private and secure.
          </p>
        </div>

        {/* Danger Zone */}
        <div className="bg-red/20 border-2 border-red rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red" />
            <h3 className="text-red">Danger Zone</h3>
          </div>
          <p className="text-sm text-red/80 mb-4">
            This will delete all your progress, logs, and achievements. This action cannot be undone.
          </p>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full bg-red text-crust rounded-xl py-3 hover:bg-red/90 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Reset All Data
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowResetConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card rounded-3xl p-8 z-50 max-w-md w-[90%] mx-auto shadow-2xl"
            >
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-red/20 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-8 h-8 text-red" />
                </div>
                
                <div>
                  <h2 className="text-foreground mb-2">Are you sure?</h2>
                  <p className="text-muted-foreground">
                    This will permanently delete all your progress, achievements, and logs. 
                    This action cannot be undone.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={onResetApp}
                    className="w-full bg-red text-crust rounded-xl py-3 hover:bg-red/90 transition-colors"
                  >
                    Yes, Reset Everything
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="w-full bg-muted text-muted-foreground rounded-xl py-3 hover:bg-muted/90 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
