// ============================================================
// Landing Page — Liquid Glass
// ============================================================

import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Button, EmiCalculator } from '@/components/common';
import { useResumeApplication } from '@/hooks';
import { Modal } from '@/components/common';
import { formatDate } from '@/utils';

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Lightning Fast',
    desc: 'Get approved in under 10 minutes with our AI-powered verification system.',
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Bank-Grade Security',
    desc: '256-bit encryption and two-factor authentication protect your data.',
    gradient: 'from-blue-400 to-cyan-400',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: '100% Digital',
    desc: 'Complete your entire application online. Zero paperwork, zero branch visits.',
    gradient: 'from-purple-400 to-pink-400',
  },
];

const STATS = [
  { label: 'Home Loan', rate: '8.5%', sublabel: 'Starting rate' },
  { label: 'Personal Loan', rate: '10.5%', sublabel: 'Starting rate' },
  { label: 'Business Loan', rate: '14.0%', sublabel: 'Starting rate' },
];

const LIVE_STATS = [
  { label: 'Loans Disbursed', value: 52400, suffix: '+', prefix: '' },
  { label: 'Happy Customers', value: 48700, suffix: '+', prefix: '' },
  { label: 'Avg. Approval', value: 8, suffix: ' min', prefix: '' },
  { label: 'Total Disbursed', value: 2400, suffix: ' Cr', prefix: '₹' },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Home Loan • ₹45L',
    text: 'The entire process was seamless. Got my home loan approved in just 12 minutes. The digital-first approach saved me weeks of paperwork.',
    rating: 5,
  },
  {
    name: 'Rajesh Kumar',
    role: 'Business Loan • ₹20L',
    text: 'Best lending experience I\'ve ever had. The interest rates are competitive and the team was incredibly supportive throughout.',
    rating: 5,
  },
  {
    name: 'Anita Desai',
    role: 'Personal Loan • ₹5L',
    text: 'From application to disbursement, everything happened online. No branch visits, no unnecessary documentation. Truly digital-first.',
    rating: 4,
  },
];

// --- Animated Counter ---
function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-2xl sm:text-3xl font-black text-white tracking-tight">
      {prefix}{count.toLocaleString('en-IN')}{suffix}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { hasDraft, draftTimestamp, draftLoanType, isLoading, resumeDraft, startFresh } =
    useResumeApplication();

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const handleResume = async () => {
    await resumeDraft();
    navigate('/apply');
  };

  const handleStartFresh = useCallback(() => {
    startFresh();
    navigate('/apply');
  }, [startFresh, navigate]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-primary-400/20 border-t-primary-400 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-white/40">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ===== Hero Section ===== */}
      <section className="w-full py-20 md:py-28 relative overflow-hidden">
        {/* Extra hero orbs */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary-500/8 rounded-full blur-[120px] pointer-events-none animate-glow-pulse" aria-hidden="true" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/6 rounded-full blur-[100px] pointer-events-none animate-glow-pulse" style={{ animationDelay: '1.5s' }} aria-hidden="true" />

        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-12 flex flex-col items-center gap-10 md:gap-12 relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm font-semibold backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
            Trusted by 50,000+ borrowers
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-5 max-w-3xl"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-black text-white tracking-tight leading-[1.08]">
              Get Your Loan{' '}
              <span className="gradient-text-glow">In Minutes</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/40 font-medium max-w-[600px] mx-auto leading-relaxed">
              Apply for Personal, Home, or Business loans with our secure, digital-first process. Quick approvals, competitive rates.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex flex-col items-center gap-3"
          >
            <Button
              size="lg"
              onClick={handleStartFresh}
              rightIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              }
              className="px-10 py-4 text-base rounded-2xl"
            >
              Apply Now — It's Free
            </Button>
            <p className="text-sm text-white/30 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              No impact on your credit score
            </p>
          </motion.div>

          {/* Rate Cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="grid grid-cols-3 gap-3 sm:gap-5 w-full max-w-xl"
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center px-4 py-5 rounded-2xl liquid-glass card-hover text-center"
              >
                <span className="text-xl sm:text-2xl font-black text-primary-400 tracking-tight">{stat.rate}</span>
                <span className="text-xs sm:text-sm font-bold text-white/80 mt-0.5">{stat.label}</span>
                <span className="text-[10px] sm:text-[11px] text-white/30 font-medium">{stat.sublabel}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== Feature Cards Section ===== */}
      <section className="w-full py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Why choose LoanEase?
            </h2>
            <p className="text-white/40 mt-2 max-w-md mx-auto">
              Built for speed, security, and simplicity.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {FEATURES.map((feat, idx) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="p-6 rounded-2xl liquid-glass card-hover group"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-4 text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  {feat.icon}
                </div>
                <h3 className="font-bold text-base text-white mb-1.5">{feat.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Live Stats Section ===== */}
      <section className="w-full py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-12">
          <div className="liquid-glass-strong rounded-3xl p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Numbers that speak
              </h2>
              <p className="text-white/40 mt-2">Real-time platform metrics</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {LIVE_STATS.map((stat) => (
                <div key={stat.label} className="text-center space-y-1">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  <p className="text-sm text-white/40 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== EMI Calculator Section ===== */}
      <section className="w-full py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-12">
          <EmiCalculator />
        </div>
      </section>

      {/* ===== Testimonials Section ===== */}
      <section className="w-full py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              What our customers say
            </h2>
            <p className="text-white/40 mt-2 max-w-md mx-auto">
              Join thousands of satisfied borrowers
            </p>
          </div>

          <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}>
              {TESTIMONIALS.map((testimonial, idx) => (
                <div key={idx} className="w-full flex-shrink-0 px-2">
                  <div className="liquid-glass-strong rounded-2xl p-8 max-w-2xl mx-auto text-center">
                    <div className="flex justify-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-white/10'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-white/70 text-base leading-relaxed mb-6 italic">
                      "{testimonial.text}"
                    </p>
                    <div>
                      <p className="font-bold text-white">{testimonial.name}</p>
                      <p className="text-sm text-white/40">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === activeTestimonial
                      ? 'bg-primary-400 w-6 shadow-[0_0_8px_rgba(37,99,235,0.5)]'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`View testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Final CTA Section ===== */}
      <section className="w-full py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-12">
          <div className="liquid-glass-strong rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-purple-500/10 pointer-events-none" aria-hidden="true" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
                Ready to get started?
              </h2>
              <p className="text-white/40 text-lg mb-8 max-w-lg mx-auto">
                Join thousands of happy customers who got their loans approved in minutes.
              </p>
              <button
                onClick={handleStartFresh}
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-400 hover:to-primary-500 shadow-xl shadow-primary-500/25 hover:shadow-2xl hover:shadow-primary-500/40 transition-all duration-300 cursor-pointer border border-primary-400/30"
              >
                Start Your Application
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Draft Modal */}
      <Modal
        isOpen={hasDraft}
        onClose={handleStartFresh}
        title="Resume Your Application?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-white/50">
            You have a saved application draft. Would you like to continue where you left off?
          </p>
          {draftTimestamp && (
            <div className="p-3 bg-white/5 rounded-xl text-sm space-y-1 border border-white/5">
              <div className="flex justify-between">
                <span className="text-white/40">Saved</span>
                <span className="font-medium text-white/70">
                  {formatDate(draftTimestamp)}
                </span>
              </div>
              {draftLoanType && (
                <div className="flex justify-between">
                  <span className="text-white/40">Loan Type</span>
                  <span className="font-medium text-white/70">{draftLoanType}</span>
                </div>
              )}
            </div>
          )}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleStartFresh} fullWidth>
              Start Fresh
            </Button>
            <Button variant="primary" onClick={handleResume} fullWidth>
              Resume
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
