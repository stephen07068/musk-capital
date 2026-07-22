import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpCircle, Bitcoin, Clock, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import DataTable, { StatusBadge } from '../../components/ui/DataTable';
import { withdrawalsAPI, portfolioAPI } from '../../services/api';

const coins = ['BTC', 'ETH', 'USDT (ERC20)', 'USDT (TRC20)'];

export default function Withdraw() {
  const [coin, setCoin] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [portfolio, setPortfolio] = useState({ cash_balance: 0, total_value: 0 });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    portfolioAPI.get().then(res => setPortfolio(res.data)).catch(console.error);
    withdrawalsAPI.getAll().then(res => setHistory(res.data.withdrawals || [])).catch(console.error);
  }, [submitted]); // refetch on new submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await withdrawalsAPI.request({
        currency: coin,
        amount: Number(amount),
        wallet_address: address
      });
      setSubmitted(true);
      setAmount('');
      setAddress('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit withdrawal');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'currency', label: 'Asset', render: (val) => <span className="font-bold">{val}</span> },
    { key: 'wallet_address', label: 'Destination', render: (val) => <span className="font-mono text-[11px] text-[#9CA3AF] truncate max-w-[150px] inline-block">{val}</span> },
    { key: 'amount', label: 'Amount', render: (val) => <span className="font-bold text-white">${val.toLocaleString(undefined, {minimumFractionDigits: 2})}</span> },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Request Withdrawal"
        subtitle="Withdraw your available balance to your crypto wallet"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-6"
          >
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-400/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Withdrawal Request Submitted</h3>
                <p className="text-sm text-[#9CA3AF] mb-6">Your request is pending administrative review. You'll be notified once processed.</p>
                <button onClick={() => setSubmitted(false)} className="px-6 py-2 bg-[#1F222A] text-white rounded-xl text-sm hover:bg-white/10 transition">
                  Make another withdrawal
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                  <Bitcoin size={20} className="text-[#D4AF37]" /> Withdrawal Details
                </h3>

                <div>
                  <label className="block text-xs text-[#9CA3AF] mb-2">Select Asset</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {coins.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCoin(c)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                          coin === c
                            ? 'bg-[#D4AF37] border-[#D4AF37] text-black'
                            : 'bg-black/40 border-[#1F222A] text-white hover:border-[#D4AF37]/40'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#9CA3AF] mb-1">Amount ($)</label>
                  <div className="relative">
                    <input
                      required
                      type="number"
                      step="any"
                      max={portfolio.cash_balance}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-black/40 border border-[#1F222A] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={() => setAmount(portfolio.cash_balance)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#D4AF37] hover:bg-[#D4AF37]/10 px-2 py-1 rounded transition-colors"
                    >
                      MAX
                    </button>
                  </div>
                  <p className="text-[10px] text-[#6B7280] mt-1">Available balance: ${(portfolio.cash_balance || 0).toLocaleString()}</p>
                </div>

                <div>
                  <label className="block text-xs text-[#9CA3AF] mb-1">Destination Wallet Address</label>
                  <input
                    required
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter valid address..."
                    className="w-full bg-black/40 border border-[#1F222A] rounded-xl px-4 py-2 text-sm font-mono text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="bg-yellow-400/10 border border-yellow-400/20 p-3 rounded-xl flex gap-3 items-start">
                  <AlertTriangle size={16} className="text-yellow-400 mt-0.5 shrink-0" />
                  <div className="text-xs text-yellow-200 leading-relaxed">
                    <p className="font-bold mb-1">Important Notice:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Please double-check your wallet address. Funds sent to wrong addresses cannot be recovered.</li>
                      <li>Withdrawals require admin approval for security purposes.</li>
                      <li>Processing typically takes 12-24 hours.</li>
                    </ul>
                  </div>
                </div>

                {error && <div className="text-red-400 text-xs font-bold mb-4 flex items-center gap-1"><AlertCircle size={14}/> {error}</div>}

                <button disabled={loading} type="submit" className="w-full py-3 bg-[#D4AF37] text-black font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? 'Submitting...' : 'Request Withdrawal'} <ArrowUpCircle size={18} />
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-4">Balances</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[#9CA3AF] mb-1">Cash Balance</p>
                <p className="text-xl font-black text-white">${(portfolio.cash_balance || 0).toLocaleString()}</p>
              </div>
              <div className="h-px bg-[#1F222A]" />
              <div>
                <p className="text-xs text-[#9CA3AF] mb-1">Total Portfolio Value</p>
                <p className="text-lg font-bold text-[#6B7280]">${(portfolio.total_value || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-3">Withdrawal Limits</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">Daily Limit</span>
                <span className="text-white font-medium">$50,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">Monthly Limit</span>
                <span className="text-white font-medium">$500,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">Min. Withdrawal</span>
                <span className="text-white font-medium">$50</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-[#D4AF37]" />
          <h3 className="text-sm font-bold text-white">Recent Withdrawals</h3>
        </div>
        <DataTable columns={columns} data={history} emptyMessage="No recent withdrawals." />
      </div>
    </div>
  );
}
