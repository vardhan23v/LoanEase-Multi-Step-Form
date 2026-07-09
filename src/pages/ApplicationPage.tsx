// ============================================================
// Application Page — Hosts the Wizard
// ============================================================

import { useState } from 'react';
import { WizardContainer } from '@/components/wizard/WizardContainer';
import { OtpGateway } from '@/components/forms/OtpGateway';
import { motion, AnimatePresence } from 'framer-motion';

export default function ApplicationPage() {
  const [isVerified, setIsVerified] = useState(false);

  return (
    <section aria-label="Loan Application Form" className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 md:py-16">
      <AnimatePresence mode="wait">
        {!isVerified ? (
          <motion.div
            key="otp"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            className="flex items-center justify-center min-h-[60vh]"
          >
            <OtpGateway onVerified={() => setIsVerified(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="wizard"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <WizardContainer />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
