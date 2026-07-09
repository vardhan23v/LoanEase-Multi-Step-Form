import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BANKS = [
  { id: 'hdfc', name: 'HDFC Bank', color: 'bg-[#004C8F]', logo: 'H' },
  { id: 'sbi', name: 'State Bank of India', color: 'bg-[#00529C]', logo: 'S' },
  { id: 'icici', name: 'ICICI Bank', color: 'bg-[#F26522]', logo: 'I' },
  { id: 'axis', name: 'Axis Bank', color: 'bg-[#89143B]', logo: 'A' },
  { id: 'kotak', name: 'Kotak Mahindra', color: 'bg-[#ED1C24]', logo: 'K' },
];

interface AccountAggregatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (income: number) => void;
}

export function AccountAggregator({ isOpen, onClose, onSuccess }: AccountAggregatorProps) {
  const [step, setStep] = useState<'select' | 'connecting' | 'success'>('select');

  const handleConnect = (_bankId: string) => {
    setStep('connecting');

    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        // Generate a random realistic salary between 60k and 150k
        const fakeIncome = Math.floor(Math.random() * 90000) + 60000;
        // round to nearest thousand
        const roundedIncome = Math.round(fakeIncome / 1000) * 1000;
        onSuccess(roundedIncome);
      }, 1500);
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-surface-900/60 backdrop-blur-sm"
          onClick={step === 'select' ? onClose : undefined}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative z-10"
        >
          {step === 'select' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Secure Bank Link</h3>
                <button onClick={onClose} className="p-2 text-white/30 hover:text-white/70 bg-white/5 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-white/40 mb-6">
                Verify your income instantly using Account Aggregator. 100% secure and encrypted.
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                {BANKS.map(bank => (
                  <button
                    key={bank.id}
                    onClick={() => handleConnect(bank.id)}
                    className="flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-primary-300 hover:bg-primary-500/10 transition-all text-left"
                  >
                    <div className={`w-10 h-10 rounded-full ${bank.color} flex items-center justify-center text-white font-bold`}>
                      {bank.logo}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{bank.name}</h4>
                      <p className="text-xs text-success-600 font-medium flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        Instant Verification
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'connecting' && (
            <div className="p-12 text-center flex flex-col items-center justify-center h-80">
              <div className="relative w-20 h-20 mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute inset-0 border-4 border-primary-500/20 border-t-primary-600 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">Connecting securely...</h3>
              <p className="text-sm text-white/40 mt-2">Fetching income details from your bank</p>
            </div>
          )}

          {step === 'success' && (
            <div className="p-12 text-center flex flex-col items-center justify-center h-80 bg-success-500/10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-success-500/100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-success-500/20"
              >
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-bold text-success-700">Verified Successfully!</h3>
              <p className="text-sm text-success-600 font-medium mt-2">Income details fetched securely.</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
