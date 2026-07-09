import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

export function EmiCalculator() {
  const [amount, setAmount] = useState<number>(500000);
  const [tenure, setTenure] = useState<number>(60);
  const [interestRate, setInterestRate] = useState<number>(10.5);

  const { emi, totalInterest, totalPayment } = useMemo(() => {
    const p = amount;
    const r = interestRate / 12 / 100;
    const n = tenure;
    
    if (p === 0 || r === 0 || n === 0) {
      return { emi: 0, totalInterest: 0, totalPayment: amount };
    }

    const emiValue = p * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
    const totalPay = emiValue * n;
    const totalInt = totalPay - p;

    return {
      emi: Math.round(emiValue),
      totalInterest: Math.round(totalInt),
      totalPayment: Math.round(totalPay),
    };
  }, [amount, tenure, interestRate]);

  const chartData = [
    { name: 'Principal', value: amount, color: '#3b82f6' },
    { name: 'Interest', value: totalInterest, color: '#8b5cf6' },
  ];

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Calculate Your EMI
        </h2>
        <p className="text-white/40 mt-2 max-w-md mx-auto">
          Adjust the sliders to see your estimated monthly payments.
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto rounded-3xl liquid-glass-strong overflow-hidden specular-border">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Sliders Section */}
          <div className="p-6 md:p-8 flex flex-col gap-7">
            {/* Amount Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-white/70">Loan Amount</label>
                <span className="text-sm font-bold text-primary-300 bg-primary-500/15 px-3 py-1 rounded-lg border border-primary-500/20">
                  {formatCurrency(amount)}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="5000000"
                step="50000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-white/30 font-semibold uppercase tracking-wider">
                <span>₹50K</span>
                <span>₹50L</span>
              </div>
            </div>

            {/* Tenure Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-white/70">Tenure</label>
                <span className="text-sm font-bold text-primary-300 bg-primary-500/15 px-3 py-1 rounded-lg border border-primary-500/20">
                  {tenure} months
                </span>
              </div>
              <input
                type="range"
                min="12"
                max="120"
                step="12"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-white/30 font-semibold uppercase tracking-wider">
                <span>1 Year</span>
                <span>10 Years</span>
              </div>
            </div>

            {/* Interest Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-white/70">Interest Rate (% P.A.)</label>
                <span className="text-sm font-bold text-primary-300 bg-primary-500/15 px-3 py-1 rounded-lg border border-primary-500/20">
                  {interestRate}%
                </span>
              </div>
              <input
                type="range"
                min="7"
                max="24"
                step="0.5"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-white/30 font-semibold uppercase tracking-wider">
                <span>7%</span>
                <span>24%</span>
              </div>
            </div>
          </div>

          {/* Breakdown Section */}
          <div className="flex flex-col p-6 md:p-8 items-center justify-center relative overflow-hidden border-t lg:border-t-0 lg:border-l border-white/5 bg-white/3">
            {/* Decor glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/10 rounded-full blur-[80px]" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/8 rounded-full blur-[60px]" aria-hidden="true" />

            <div className="text-center mb-5 relative z-10">
              <p className="text-white/40 font-semibold mb-1 tracking-wide uppercase text-xs">Monthly EMI</p>
              <div className="text-4xl md:text-5xl font-black text-white tracking-tight">
                {formatCurrency(emi)}
              </div>
            </div>

            <div className="w-full h-[180px] relative z-10 mb-5">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: any) => formatCurrency(value as number)}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.3)',
                      padding: '10px 14px',
                      fontSize: '13px',
                      background: 'rgba(15,23,42,0.9)',
                      backdropFilter: 'blur(12px)',
                      color: '#e2e8f0',
                    }}
                    itemStyle={{ fontWeight: 600, color: '#e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full space-y-2.5 relative z-10">
              <div className="flex justify-between items-center text-sm bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0 shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
                  <span className="text-white/60 font-semibold">Principal</span>
                </div>
                <span className="font-bold text-white">{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between items-center text-sm bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-purple-500 shrink-0 shadow-[0_0_6px_rgba(139,92,246,0.5)]" />
                  <span className="text-white/60 font-semibold">Interest</span>
                </div>
                <span className="font-bold text-white">{formatCurrency(totalInterest)}</span>
              </div>
              <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                <span className="text-white/90 font-extrabold tracking-tight">Total Payment</span>
                <span className="font-black text-lg text-primary-400">{formatCurrency(totalPayment)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
