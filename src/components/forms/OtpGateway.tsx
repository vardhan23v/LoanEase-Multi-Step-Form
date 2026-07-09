import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';

interface OtpGatewayProps {
  onVerified: () => void;
}

export function OtpGateway({ onVerified }: OtpGatewayProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep('otp');
        setTimer(30);
        setTimeout(() => inputRefs[0].current?.focus(), 100);
      }, 800);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto-verify if all 4 digits entered
    if (newOtp.every(d => d !== '') && index === 3) {
      verifyOtp(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const verifyOtp = (code: string) => {
    if (code.length === 4) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onVerified();
      }, 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto bg-white/6 rounded-3xl p-8 border border-white/10/60 shadow-xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

      {step === 'phone' ? (
        <motion.div
          key="phone"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary-500/10 text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome to LoanEase</h2>
            <p className="text-sm text-white/40 font-medium">Enter your mobile number to start</p>
          </div>

          <form onSubmit={handlePhoneSubmit} className="space-y-5">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold border-r border-white/10 pr-3">+91</span>
              <input
                type="tel"
                maxLength={10}
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-16 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-bold text-lg text-white tracking-wide"
                placeholder="99999 99999"
                autoFocus
              />
            </div>
            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              disabled={phone.length < 10}
              className="py-3.5 text-base shadow-md shadow-primary-500/20"
            >
              Get OTP
            </Button>
          </form>
          <p className="text-[11px] text-white/30 text-center leading-relaxed font-medium px-4">
            By proceeding, you agree to our Terms & Conditions and Privacy Policy.
          </p>
        </motion.div>
      ) : (
        <motion.div
          key="otp"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6 relative z-10"
        >
          <div className="space-y-2">
            <button
              onClick={() => setStep('phone')}
              className="text-white/30 hover:text-white/70 transition-colors mb-2 -ml-2 p-2 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Verify Mobile</h2>
            <p className="text-sm text-white/40 font-medium">
              We've sent a 4-digit code to <span className="font-bold text-white">+91 {phone}</span>
            </p>
          </div>

          <div className="flex justify-between gap-3">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={inputRefs[i]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-14 h-14 md:w-16 md:h-16 text-center text-2xl font-black bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-white"
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-white/40 font-medium">
              Didn't receive code?
            </span>
            {timer > 0 ? (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 -rotate-90 text-primary-500/20" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  <motion.path 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3"
                    className="text-primary-400 drop-shadow-[0_0_3px_rgba(52,211,153,0.5)]"
                    initial={{ pathLength: timer / 30 }}
                    animate={{ pathLength: (timer - 1) / 30 }}
                    transition={{ duration: 1, ease: 'linear' }}
                  />
                </svg>
                <span className="font-bold text-white/70">00:{timer.toString().padStart(2, '0')}</span>
              </div>
            ) : (
              <button
                onClick={() => setTimer(30)}
                className="font-bold text-primary-400 hover:text-primary-300 transition-colors drop-shadow-[0_0_5px_rgba(52,211,153,0.4)]"
              >
                Resend OTP
              </button>
            )}
          </div>

          <Button
            onClick={() => verifyOtp(otp.join(''))}
            fullWidth
            isLoading={loading}
            disabled={otp.join('').length < 4}
            className="py-3.5 text-base shadow-md shadow-primary-500/20"
          >
            Verify & Continue
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
