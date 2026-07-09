import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormStore } from '@/store';
import { formatINR, calculateEMI } from '@/utils';
import { INTEREST_RATES } from '@/constants';

const generateAmortizationData = (principal: number, months: number, rate: number, extraPayment: number = 0) => {
  let balance = principal;
  const emi = calculateEMI(principal, rate, months);
  const monthlyRate = rate / 12 / 100;
  const data = [];

  for (let i = 1; i <= Math.min(months, 36); i++) {
    const interest = balance * monthlyRate;
    let principalPaid = emi - interest + extraPayment;
    
    if (principalPaid > balance) {
      principalPaid = balance;
    }
    
    balance -= principalPaid;
    
    data.push({
      month: `M${i}`,
      balance: Math.max(0, Math.round(balance)),
      principalPaid: Math.round(principalPaid),
      interestPaid: Math.round(interest)
    });
    
    if (balance <= 0) break;
  }
  return data;
};

const RECENT_TRANSACTIONS = [
  { id: 'TXN-001', date: '2024-03-01', description: 'Processing Fee', amount: 2500, status: 'Success' as const },
  { id: 'TXN-002', date: '2024-04-01', description: 'EMI Payment', amount: 45000, status: 'Success' as const },
  { id: 'TXN-003', date: '2024-05-01', description: 'EMI Payment', amount: 45000, status: 'Pending' as const },
];

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'documents', label: 'Documents (KYC)', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'payments', label: 'Payments', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
];

export default function DashboardPage() {
  const { loanTypeData, personalInfo } = useFormStore();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [extraPayment, setExtraPayment] = useState(0);
  const [uploadedDocs, setUploadedDocs] = useState<{name: string, status: string}[]>([
    { name: 'Aadhaar Card', status: 'Verified' },
    { name: 'PAN Card', status: 'Verified' }
  ]);

  const principal = loanTypeData.loanAmount || 500000;
  const tenure = loanTypeData.tenure || 36;
  const rate = INTEREST_RATES[loanTypeData.loanType] || 10.5;
  
  const emi = calculateEMI(principal, rate, tenure);
  const totalPaid = emi * 3;
  const outstanding = principal - (totalPaid * 0.6);
  
  const originalAmortization = useMemo(() => generateAmortizationData(principal, tenure, rate, 0), [principal, tenure, rate]);
  const newAmortization = useMemo(() => generateAmortizationData(principal, tenure, rate, extraPayment), [principal, tenure, rate, extraPayment]);
  
  const originalTotalInterest = originalAmortization.reduce((sum, m) => sum + m.interestPaid, 0);
  const newTotalInterest = newAmortization.reduce((sum, m) => sum + m.interestPaid, 0);
  const interestSaved = originalTotalInterest - newTotalInterest;
  const monthsSaved = originalAmortization.length - newAmortization.length;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newDocs = acceptedFiles.map(file => ({ name: file.name, status: 'Uploading...' }));
    setUploadedDocs(prev => [...prev, ...newDocs]);
    
    // Simulate upload delay
    setTimeout(() => {
      setUploadedDocs(prev => prev.map(doc => 
        newDocs.find(n => n.name === doc.name) ? { ...doc, status: 'Verified' } : doc
      ));
    }, 2000);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Dynamic Theme Classes
  const bgClass = isDarkMode ? 'bg-surface-950 text-white' : 'bg-surface-50 text-surface-900';
  const cardClass = isDarkMode ? 'bg-surface-900 border-surface-800 text-white' : 'bg-white border-surface-200/60 text-surface-900';
  const textMutedClass = isDarkMode ? 'text-surface-400' : 'text-surface-500';
  const textHeadingClass = isDarkMode ? 'text-white' : 'text-surface-900';
  const sidebarClass = isDarkMode ? 'bg-black border-surface-800' : 'bg-surface-900 border-surface-800';
  
  return (
    <div className={`flex h-[calc(100vh-64px)] overflow-hidden transition-colors duration-300 ${bgClass}`}>
      {/* Sidebar */}
      <aside className={`hidden lg:flex w-64 flex-col border-r transition-colors duration-300 ${sidebarClass}`}>
        <div className="p-5 flex-1">
          <p className="text-[11px] font-bold text-surface-400 uppercase tracking-widest mb-5 px-3">Menu</p>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                    : 'text-surface-400 hover:bg-surface-800 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
                </svg>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-5 border-t border-surface-800">
          <div className="flex items-center justify-between mb-6 px-1">
            <span className="text-xs font-bold text-surface-400 uppercase tracking-wider">Dark Mode</span>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-11 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-primary-600' : 'bg-surface-700'}`}
            >
              <motion.div 
                animate={{ x: isDarkMode ? 20 : 0 }} 
                className="w-4 h-4 rounded-full bg-white shadow-sm"
              />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-inner">
              {personalInfo.fullName ? personalInfo.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{personalInfo.fullName || 'Guest User'}</p>
              <p className="text-xs text-surface-400 truncate">{personalInfo.email || 'guest@example.com'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${textHeadingClass}`}>
                {activeTab === 'overview' ? 'Dashboard' : activeTab === 'documents' ? 'Document Hub' : 'Payments'}
              </h1>
              <p className={`text-sm mt-1 ${textMutedClass}`}>
                {activeTab === 'overview' ? 'Manage your loan and track payments.' : 'Securely upload and manage your KYC documents.'}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/')}
                className={`px-4 py-2 text-sm font-bold border rounded-xl transition-colors cursor-pointer ${
                  isDarkMode ? 'border-surface-700 text-surface-300 hover:bg-surface-800' : 'border-surface-200 text-surface-600 hover:bg-surface-100'
                }`}
              >
                Back to Home
              </button>
              <button className="px-5 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-primary-500/20 transition-all flex items-center gap-2 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Pay EMI
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className={`p-5 rounded-2xl border shadow-sm ${cardClass}`}>
                    <p className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-surface-500' : 'text-surface-400'}`}>Total Loan</p>
                    <h3 className="text-2xl font-extrabold tracking-tight">{formatINR(principal)}</h3>
                    <p className="text-xs text-accent-500 font-bold mt-2 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      Disbursed
                    </p>
                  </div>
                  
                  <div className={`p-5 rounded-2xl border shadow-sm ${cardClass}`}>
                    <p className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-surface-500' : 'text-surface-400'}`}>Outstanding</p>
                    <h3 className="text-2xl font-extrabold tracking-tight">{formatINR(outstanding)}</h3>
                    <p className={`text-xs font-medium mt-2 ${textMutedClass}`}>As of today</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-primary-900 to-primary-800 p-5 rounded-2xl shadow-xl text-white relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-primary-600/40 rounded-full blur-2xl -mr-10 -mt-10" />
                    <p className="text-xs font-bold text-primary-200 uppercase tracking-wider mb-1.5 relative z-10">Next EMI</p>
                    <h3 className="text-2xl font-extrabold text-white relative z-10 tracking-tight">{formatINR(emi)}</h3>
                    <p className="text-xs text-primary-200 font-bold mt-2 flex items-center gap-1 relative z-10">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      Due 5th Oct 2024
                    </p>
                  </div>

                  <div className={`p-5 rounded-2xl border shadow-sm ${cardClass}`}>
                    <p className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-surface-500' : 'text-surface-400'}`}>Interest Rate</p>
                    <h3 className="text-2xl font-extrabold tracking-tight">{rate}%</h3>
                    <p className={`text-xs font-medium mt-2 ${textMutedClass}`}>Fixed Rate P.A.</p>
                  </div>
                </div>

                {/* Pre-payment Calculator & Chart */}
                <div className={`rounded-3xl border shadow-sm overflow-hidden ${cardClass}`}>
                  <div className={`p-6 border-b ${isDarkMode ? 'border-surface-800 bg-surface-800/50' : 'border-surface-100 bg-surface-50/50'}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                          Pre-payment Calculator
                        </h3>
                        <p className={`text-sm mt-1 ${textMutedClass}`}>See how paying extra each month saves you money.</p>
                      </div>
                      
                      <div className="flex-1 max-w-md w-full">
                        <div className="flex justify-between text-sm font-bold mb-2">
                          <span>Pay extra monthly:</span>
                          <span className="text-primary-500">{formatINR(extraPayment)}</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={50000}
                          step={1000}
                          value={extraPayment}
                          onChange={(e) => setExtraPayment(Number(e.target.value))}
                          className="w-full h-2 bg-surface-200 rounded-full appearance-none cursor-pointer
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600"
                        />
                        <div className="flex justify-between mt-1">
                          <span className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">₹0</span>
                          <span className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">₹50K</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {extraPayment > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-6 p-4 rounded-xl bg-gradient-to-r from-success-500/10 to-transparent border border-success-500/20 flex gap-4 items-center"
                      >
                        <div className="w-10 h-10 rounded-full bg-success-500/20 text-success-600 flex items-center justify-center shrink-0">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${isDarkMode ? 'text-success-400' : 'text-success-700'}`}>By paying {formatINR(extraPayment)} extra per month, you will save</p>
                          <p className="text-xl font-black text-success-500 mt-0.5">
                            {formatINR(interestSaved)} <span className="text-sm font-semibold opacity-70">in interest</span> and pay off your loan <span className="text-sm font-semibold opacity-70">{monthsSaved} months early!</span>
                          </p>
                        </div>
                      </motion.div>
                    )}
                    
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={newAmortization} margin={{ top: 5, right: 0, left: -15, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={extraPayment > 0 ? '#10b981' : '#4f46e5'} stopOpacity={0.2}/>
                              <stop offset="95%" stopColor={extraPayment > 0 ? '#10b981' : '#4f46e5'} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#64748b' }} dy={8} />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 11, fill: isDarkMode ? '#94a3b8' : '#64748b' }}
                            tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: isDarkMode ? '#1e293b' : '#fff', color: isDarkMode ? '#fff' : '#000', boxShadow: '0 4px 20px rgb(0 0 0 / 0.15)' }}
                            formatter={(value: any) => [formatINR(value as number), 'Balance']}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="balance" 
                            stroke={extraPayment > 0 ? '#10b981' : '#4f46e5'} 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorBalance)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Transactions row (reduced size) */}
                <div className={`p-6 rounded-3xl border shadow-sm ${cardClass}`}>
                   <h3 className="font-bold text-lg mb-5">Recent Transactions</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {RECENT_TRANSACTIONS.map((txn) => (
                       <div key={txn.id} className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? 'bg-surface-800/50 border-surface-700' : 'bg-surface-50 border-surface-200/60'}`}>
                         <div className="flex items-center gap-3">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${txn.status === 'Success' ? 'bg-success-100 text-success-600' : 'bg-warning-100 text-warning-600'}`}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {txn.status === 'Success' 
                                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                }
                              </svg>
                           </div>
                           <div>
                             <p className="font-bold text-sm">{txn.description}</p>
                             <p className={`text-xs ${textMutedClass}`}>{txn.date}</p>
                           </div>
                         </div>
                         <div className="text-right">
                           <p className="font-bold">{formatINR(txn.amount)}</p>
                           <p className={`text-[10px] font-bold uppercase tracking-widest ${txn.status === 'Success' ? 'text-success-500' : 'text-warning-500'}`}>{txn.status}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'documents' && (
              <motion.div
                key="documents"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className={`p-8 rounded-3xl border shadow-sm ${cardClass}`}>
                  <h3 className="text-xl font-bold mb-6">KYC Upload Hub</h3>
                  
                  <div 
                    {...getRootProps()} 
                    className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                      isDragActive 
                        ? 'border-primary-500 bg-primary-500/10' 
                        : isDarkMode ? 'border-surface-700 bg-surface-800/50 hover:bg-surface-800' : 'border-surface-300 bg-surface-50 hover:bg-surface-100'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${isDarkMode ? 'bg-surface-700 text-surface-400' : 'bg-white shadow-sm text-surface-500'}`}>
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    </div>
                    <p className="text-lg font-bold">Drag & drop your documents here</p>
                    <p className={`text-sm mt-2 ${textMutedClass}`}>Supports PDF, JPG, PNG (Max 5MB). Required: PAN Card, Aadhaar Card, Bank Statement.</p>
                  </div>

                  {uploadedDocs.length > 0 && (
                    <div className="mt-8 space-y-3">
                      <h4 className="font-bold text-sm uppercase tracking-wider mb-4 opacity-70">Uploaded Documents</h4>
                      {uploadedDocs.map((doc, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? 'bg-surface-800/50 border-surface-700' : 'bg-white border-surface-200'}`}>
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-surface-700 text-primary-400' : 'bg-primary-50 text-primary-600'}`}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <div>
                              <p className="font-bold">{doc.name}</p>
                              <p className={`text-xs mt-0.5 ${textMutedClass}`}>Document • 1.2 MB</p>
                            </div>
                          </div>
                          {doc.status === 'Verified' ? (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-success-500/10 text-success-600 text-xs font-bold uppercase tracking-wider rounded-full">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                              Verified
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-warning-500/10 text-warning-600 text-xs font-bold uppercase tracking-wider rounded-full">
                              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                              Uploading...
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}
