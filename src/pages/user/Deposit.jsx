import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownCircle, Bitcoin, CreditCard, UploadCloud, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { depositsAPI } from '../../services/api';

const methods = [
  { id: 'crypto', label: 'Cryptocurrency', icon: Bitcoin, desc: 'BTC, ETH, USDT' },
  { id: 'giftcard', label: 'Gift Card', icon: CreditCard, desc: 'Amazon, Apple, etc.' },
];

export default function Deposit() {
  const [method, setMethod] = useState('crypto');
  
  // Crypto State
  const [coin, setCoin] = useState('BTC');
  const [copied, setCopied] = useState(false);
  const [wallets, setWallets] = useState({ BTC: '', ETH: '', USDT: '' });
  const [cryptoForm, setCryptoForm] = useState({ amount: '', tx_hash: '' });
  // Gift Card State
  const [cardBrand, setCardBrand] = useState('Steam');
  const [cardFile, setCardFile] = useState(null);
  const [cardNotes, setCardNotes] = useState('');
  const [gcError, setGcError] = useState('');
  
  // Submission
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    depositsAPI.getAddresses()
      .then(res => setWallets(res.data))
      .catch(console.error);
  }, []);

  const copyAddress = () => {
    navigator.clipboard.writeText(wallets[coin]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCryptoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCryptoError('');
    try {
      await depositsAPI.crypto({
        currency: coin,
        amount: Number(cryptoForm.amount),
        tx_hash: cryptoForm.tx_hash
      });
      setSubmitted(true);
      setCryptoForm({ amount: '', tx_hash: '' });
    } catch (err) {
      setCryptoError(err.response?.data?.message || 'Failed to submit deposit');
    } finally {
      setLoading(false);
    }
  };

  const handleGcSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGcError('');
    try {
      const formData = new FormData();
      formData.append('card_type', cardBrand);
      formData.append('value', cardValue);
      if (cardNotes) formData.append('notes', cardNotes);
      if (cardFile) formData.append('image', cardFile);

      await depositsAPI.giftCard(formData);
      setSubmitted(true);
      setCardValue('');
      setCardNotes('');
      setCardFile(null);
    } catch (err) {
      setGcError(err.response?.data?.message || 'Failed to submit gift card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Deposit Funds"
        subtitle="Add funds to your portfolio to start investing"
      />

      {/* Method Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {methods.map((m) => (
          <button
            key={m.id}
            onClick={() => { setMethod(m.id); setSubmitted(false); }}
            className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${
              method === m.id
                ? 'bg-[#D4AF37]/10 border-[#D4AF37] ring-1 ring-[#D4AF37]'
                : 'bg-[#0D0F14] border-[#1F222A] hover:border-[#D4AF37]/40'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              method === m.id ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-[#9CA3AF]'
            }`}>
              <m.icon size={24} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{m.label}</p>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">{m.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <motion.div
        key={method}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0D0F14] border border-[#1F222A] rounded-2xl p-6"
      >
        {submitted ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-emerald-400/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Deposit Submitted</h3>
            <p className="text-sm text-[#9CA3AF] mb-6">Your deposit request is now pending admin approval.</p>
            <button onClick={() => setSubmitted(false)} className="px-6 py-2 bg-[#1F222A] text-white rounded-xl text-sm hover:bg-white/10 transition">
              Make another deposit
            </button>
          </div>
        ) : method === 'crypto' ? (
          /* Crypto Deposit */
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Bitcoin size={20} className="text-[#D4AF37]" /> Cryptocurrency Deposit
            </h3>
            
            <div>
              <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-2">Select Coin</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.keys(wallets).map((c) => (
                  <button
                    key={c}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="bg-white p-4 rounded-2xl max-w-[200px] mx-auto md:mx-0">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${wallets[coin]}`} alt="QR" className="w-full h-auto" />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[#9CA3AF] mb-1">Network</p>
                  <p className="text-sm font-bold text-white bg-black/40 px-3 py-2 rounded-lg border border-[#1F222A]">
                    {coin === 'BTC' ? 'Bitcoin (BTC)' : coin === 'ETH' ? 'Ethereum (ERC20)' : 'Tron (TRC20)'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF] mb-1">Wallet Address</p>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={wallets[coin]}
                      className="flex-1 bg-black/40 border border-[#1F222A] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
                    />
                    <button
                      onClick={copyAddress}
                      className="p-2 bg-[#D4AF37] text-black rounded-lg hover:opacity-90 transition-opacity"
                    >
                      {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
                <div className="bg-yellow-400/10 border border-yellow-400/20 p-3 rounded-lg text-xs text-yellow-200">
                  <span className="font-bold">Warning:</span> Only send {coin} to this address via the correct network.
                </div>
              </div>
            </div>

            <form onSubmit={handleCryptoSubmit} className="border-t border-[#1F222A] pt-6 mt-6">
              <h4 className="text-sm font-bold text-white mb-4">Confirm Deposit</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-[#9CA3AF] mb-1">Amount Sent</label>
                  <input required type="number" step="any" value={cryptoForm.amount} onChange={e => setCryptoForm({...cryptoForm, amount: e.target.value})} placeholder="0.00" className="w-full bg-black/40 border border-[#1F222A] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div>
                  <label className="block text-xs text-[#9CA3AF] mb-1">Transaction Hash</label>
                  <input required type="text" value={cryptoForm.tx_hash} onChange={e => setCryptoForm({...cryptoForm, tx_hash: e.target.value})} placeholder="0x..." className="w-full bg-black/40 border border-[#1F222A] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]" />
                </div>
              </div>
              {cryptoError && <div className="text-red-400 text-xs font-bold mb-4 flex items-center gap-1"><AlertCircle size={14}/> {cryptoError}</div>}
              <button disabled={loading} type="submit" className="w-full py-3 bg-[#D4AF37] text-black font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Deposit'} <ArrowDownCircle size={18} />
              </button>
            </form>
          </div>
        ) : (
          /* Gift Card Deposit */
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard size={20} className="text-[#D4AF37]" /> Gift Card Deposit
            </h3>
            
            <form onSubmit={handleGcSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#9CA3AF] mb-1">Card Brand</label>
                  <select
                    value={cardBrand}
                    onChange={(e) => setCardBrand(e.target.value)}
                    className="w-full bg-black/40 border border-[#1F222A] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37] appearance-none"
                  >
                    <option value="Steam">Steam</option>
                    <option value="Razer Gold">Razer Gold</option>
                    <option value="Apple">Apple Gift Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#9CA3AF] mb-1">Card Value ($)</label>
                  <input
                    required
                    type="number"
                    value={cardValue}
                    onChange={(e) => setCardValue(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full bg-black/40 border border-[#1F222A] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1">Upload Card Images (Front & Back)</label>
                <div className="border-2 border-dashed border-[#1F222A] rounded-2xl p-8 text-center hover:border-[#D4AF37]/50 transition-colors cursor-pointer relative">
                  <input type="file" accept="image/*" onChange={e => setCardFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <UploadCloud size={32} className={`mx-auto mb-3 ${cardFile ? 'text-emerald-400' : 'text-[#6B7280]'}`} />
                  <p className="text-sm font-semibold text-white">{cardFile ? cardFile.name : 'Click to upload images'}</p>
                  <p className="text-xs text-[#6B7280] mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1">Notes / Card Code (Optional)</label>
                <textarea value={cardNotes} onChange={e => setCardNotes(e.target.value)} rows="3" className="w-full bg-black/40 border border-[#1F222A] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]" placeholder="Enter exact card code if applicable..." />
              </div>

              <div className="bg-yellow-400/10 border border-yellow-400/20 p-3 rounded-lg text-xs text-yellow-200">
                <span className="font-bold">Note:</span> Gift card deposits require manual verification and may take up to 24 hours to reflect in your balance.
              </div>

              {gcError && <div className="text-red-400 text-xs font-bold flex items-center gap-1"><AlertCircle size={14}/> {gcError}</div>}
              
              <button disabled={loading} type="submit" className="w-full py-3 bg-[#D4AF37] text-black font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Gift Card'} <ArrowDownCircle size={18} />
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
