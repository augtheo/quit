import { useState, useEffect } from 'react';
import { UserProfile } from '../App';
import { Save, Trash2, AlertTriangle, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Switch } from './ui/switch';

interface SettingsProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onResetApp: () => void;
  onToggleDarkMode: (enabled: boolean) => void;
}

export function Settings({ userProfile, onUpdateProfile, onResetApp, onToggleDarkMode }: SettingsProps) {
  const [quitDate, setQuitDate] = useState(userProfile.quitDate);
  const [dailyCigarettes, setDailyCigarettes] = useState(userProfile.dailyCigarettes.toString());
  const [costPerPack, setCostPerPack] = useState(userProfile.costPerPack.toString());
  const [cigarettesPerPack, setCigarettesPerPack] = useState(userProfile.cigarettesPerPack.toString());
  const [myWhy, setMyWhy] = useState(userProfile.myWhy);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('quieresfumar_darkmode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  const handleDarkModeToggle = (enabled: boolean) => {
    setDarkMode(enabled);
    onToggleDarkMode(enabled);
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 pt-4"
        >
          <h1 className="text-blue-900">Settings</h1>
          <p className="text-gray-600">
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
              className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 text-center"
            >
              <p className="text-green-900">✓ Settings saved successfully!</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Form */}
        <div className="bg-white rounded-3xl p-6 shadow-lg space-y-6">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5 text-gray-700" /> : <Sun className="w-5 h-5 text-gray-700" />}
              <div>
                <label className="text-gray-700">Dark Mode</label>
                <p className="text-sm text-gray-500">Toggle dark theme</p>
              </div>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={handleDarkModeToggle}
            />
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-6">
            <div className="space-y-2">
              <label className="text-gray-700">Quit Date</label>
              <input
                type="date"
                value={quitDate}
                onChange={(e) => setQuitDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-700">Cigarettes per day (baseline)</label>
              <input
                type="number"
                value={dailyCigarettes}
                onChange={(e) => setDailyCigarettes(e.target.value)}
                min="1"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-700">Cost per pack (₹)</label>
              <input
                type="number"
                value={costPerPack}
                onChange={(e) => setCostPerPack(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-700">Cigarettes per pack</label>
              <select
                value={cigarettesPerPack}
                onChange={(e) => setCigarettesPerPack(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              >
                <option value="20">20 (Standard)</option>
                <option value="25">25</option>
                <option value="30">30</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-gray-700">My Why</label>
              <textarea
                value={myWhy}
                onChange={(e) => setMyWhy(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors resize-none"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white rounded-xl py-3 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
          <h3 className="text-blue-900 mb-2">Privacy</h3>
          <p className="text-sm text-blue-800">
            All your data is stored locally on your device. Nothing is sent to any server. 
            Your information is completely private and secure.
          </p>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-red-900">Danger Zone</h3>
          </div>
          <p className="text-sm text-red-800 mb-4">
            This will delete all your progress, logs, and achievements. This action cannot be undone.
          </p>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full bg-red-600 text-white rounded-xl py-3 hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
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
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-8 z-50 max-w-md w-[90%] mx-auto shadow-2xl"
            >
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                
                <div>
                  <h2 className="text-gray-900 mb-2">Are you sure?</h2>
                  <p className="text-gray-600">
                    This will permanently delete all your progress, achievements, and logs. 
                    This action cannot be undone.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={onResetApp}
                    className="w-full bg-red-600 text-white rounded-xl py-3 hover:bg-red-700 transition-colors"
                  >
                    Yes, Reset Everything
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="w-full bg-gray-200 text-gray-700 rounded-xl py-3 hover:bg-gray-300 transition-colors"
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