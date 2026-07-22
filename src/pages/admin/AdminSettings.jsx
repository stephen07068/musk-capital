import React, { useState, useEffect } from 'react';
import { Save, Shield, Globe, CreditCard, Mail, Key, Bitcoin } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { adminAPI } from '../../services/api';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletAddresses, setWalletAddresses] = useState({
    BTC: '',
    ETH: '',
    USDT: ''
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'wallets', label: 'Wallet Addresses', icon: Bitcoin },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'api', label: 'API Keys', icon: Key },
  ];

  // Load wallet addresses on mount
  useEffect(() => {
    const loadWallets = async () => {
      try {
        const response = await fetch('/api/deposits/addresses');
        const data = await response.json();
        setWalletAddresses(data);
      } catch (error) {
        console.error('Failed to load wallet addresses:', error);
      }
    };
    loadWallets();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      // In a real app, this would call an API to save the settings
      await adminAPI.updateSettings({ walletAddresses });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-[#111827] border border-[#1F2937] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors";
  const labelCls = "text-xs text-[#9CA3AF] block mb-1.5 font-medium";

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader title="Platform Settings" subtitle="Configure platform rules, security, and global preferences" />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-2 flex flex-col gap-1">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === t.id ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20' : 'text-[#9CA3AF] hover:text-white hover:bg-white/5 border border-transparent'}`}
              >
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Panel */}
        <div className="flex-1 bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6 capitalize">{activeTab} Settings</h2>

          <div className="space-y-5 max-w-2xl">
            {activeTab === 'general' && (
              <>
                <div><label className={labelCls}>Platform Name</label><input className={inputCls} defaultValue="Musk Capital" /></div>
                <div><label className={labelCls}>Support Email</label><input className={inputCls} defaultValue="support@muskcapital.com" /></div>
                <div>
                  <label className={labelCls}>Maintenance Mode</label>
                  <select className={inputCls}><option value="off">Disabled</option><option value="on">Enabled</option></select>
                </div>
              </>
            )}

            {activeTab === 'security' && (
              <>
                <div><label className={labelCls}>Admin 2FA</label><select className={inputCls}><option>Required for all admins</option><option>Optional</option></select></div>
                <div><label className={labelCls}>Session Timeout (Minutes)</label><input type="number" className={inputCls} defaultValue="30" /></div>
                <div><label className={labelCls}>Max Login Attempts</label><input type="number" className={inputCls} defaultValue="5" /></div>
              </>
            )}

            {activeTab === 'payments' && (
              <>
                <div><label className={labelCls}>Minimum Deposit (USD)</label><input type="number" className={inputCls} defaultValue="100" /></div>
                <div><label className={labelCls}>Minimum Withdrawal (USD)</label><input type="number" className={inputCls} defaultValue="500" /></div>
                <div><label className={labelCls}>Crypto Deposit Network Confirmations</label><input type="number" className={inputCls} defaultValue="3" /></div>
              </>
            )}

            {activeTab === 'wallets' && (
              <>
                <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-4 mb-4">
                  <p className="text-xs text-yellow-200 flex items-center gap-2">
                    <Shield size={14} />
                    <span className="font-semibold">Security Notice:</span> These wallet addresses will be shown to users for deposits. Ensure they are accurate and secure.
                  </p>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className={labelCls}>Bitcoin (BTC) Wallet Address</label>
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <input 
                          type="text"
                          className={inputCls + " font-mono text-xs"}
                          value={walletAddresses.BTC}
                          onChange={(e) => setWalletAddresses({...walletAddresses, BTC: e.target.value})}
                          placeholder="bc1q..."
                        />
                        <p className="text-xs text-[#6B7280] mt-1">Bitcoin network (BTC) - Native SegWit recommended</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Ethereum (ETH) Wallet Address</label>
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <input 
                          type="text"
                          className={inputCls + " font-mono text-xs"}
                          value={walletAddresses.ETH}
                          onChange={(e) => setWalletAddresses({...walletAddresses, ETH: e.target.value})}
                          placeholder="0x..."
                        />
                        <p className="text-xs text-[#6B7280] mt-1">Ethereum network (ERC-20) - Supports ETH and ERC-20 tokens</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>USDT (Tron) Wallet Address</label>
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <input 
                          type="text"
                          className={inputCls + " font-mono text-xs"}
                          value={walletAddresses.USDT}
                          onChange={(e) => setWalletAddresses({...walletAddresses, USDT: e.target.value})}
                          placeholder="T..."
                        />
                        <p className="text-xs text-[#6B7280] mt-1">Tron network (TRC-20) - Lower fees for USDT transfers</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-400/10 border border-blue-400/20 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-white mb-2">Current Addresses Preview</h4>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between items-center bg-black/40 px-3 py-2 rounded-lg">
                        <span className="text-[#9CA3AF]">BTC:</span>
                        <span className="text-white truncate ml-2 max-w-[200px]">{walletAddresses.BTC || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between items-center bg-black/40 px-3 py-2 rounded-lg">
                        <span className="text-[#9CA3AF]">ETH:</span>
                        <span className="text-white truncate ml-2 max-w-[200px]">{walletAddresses.ETH || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between items-center bg-black/40 px-3 py-2 rounded-lg">
                        <span className="text-[#9CA3AF]">USDT:</span>
                        <span className="text-white truncate ml-2 max-w-[200px]">{walletAddresses.USDT || 'Not set'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'email' && (
              <>
                <div><label className={labelCls}>SMTP Host</label><input className={inputCls} defaultValue="smtp.mailgun.org" /></div>
                <div><label className={labelCls}>SMTP Port</label><input type="number" className={inputCls} defaultValue="587" /></div>
                <div><label className={labelCls}>Sender Address</label><input className={inputCls} defaultValue="noreply@muskcapital.com" /></div>
              </>
            )}

            {activeTab === 'api' && (
              <>
                <div><label className={labelCls}>CoinMarketCap API Key</label><input type="password" className={inputCls} defaultValue="••••••••••••••••" /></div>
                <div><label className={labelCls}>Binance API Key</label><input type="password" className={inputCls} defaultValue="••••••••••••••••" /></div>
                <div><label className={labelCls}>News API Key</label><input type="password" className={inputCls} defaultValue="••••••••••••••••" /></div>
              </>
            )}

            <div className="pt-4 border-t border-[#1F2937] flex items-center gap-4">
              <button 
                onClick={handleSave} 
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-[#C9A227] transition-colors disabled:opacity-50"
              >
                <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
              {saved && <span className="text-emerald-400 text-sm font-bold">✓ Saved successfully</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
