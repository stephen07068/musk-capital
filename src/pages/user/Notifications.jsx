import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, ArrowDownCircle, ArrowUpCircle, TrendingUp, ShieldAlert } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { notificationsAPI } from '../../services/api';
import { useApi } from '../../hooks/useApi';

const getIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'deposit': return <ArrowDownCircle size={16} className="text-emerald-400" />;
    case 'withdrawal': return <ArrowUpCircle size={16} className="text-red-400" />;
    case 'market': return <TrendingUp size={16} className="text-[#D4AF37]" />;
    case 'system': return <ShieldAlert size={16} className="text-blue-400" />;
    default: return <Bell size={16} className="text-[#9CA3AF]" />;
  }
};

export default function Notifications() {
  const { data, loading, setData } = useApi(notificationsAPI.getAll, { notifications: [], unread: 0 }, []);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    if (data?.notifications) {
      setNotifs(data.notifications);
    }
  }, [data]);

  const markAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      setNotifs(notifs.map(n => ({ ...n, is_read: true })));
    } catch (e) { console.error(e); }
  };

  const markRead = async (id) => {
    try {
      await notificationsAPI.markRead(id);
      setNotifs(notifs.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (e) { console.error(e); }
  };

  const unreadCount = notifs.filter(n => !n.is_read).length;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Notifications"
        subtitle={`You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
        actions={
          <div className="flex gap-2">
            <button onClick={markAllRead} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0D0F14] border border-[#1F222A] rounded-xl text-xs font-semibold text-[#9CA3AF] hover:text-white transition-all">
              <Check size={14} /> Mark all read
            </button>
          </div>
        }
      />

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-10 text-[#9CA3AF] text-sm animate-pulse">Loading notifications...</div>
        ) : (
          <AnimatePresence>
            {notifs.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={() => { if (!n.is_read) markRead(n.id); }}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${
                  !n.is_read ? 'bg-[#D4AF37]/5 border-[#D4AF37]/30' : 'bg-[#0D0F14] border-[#1F222A] hover:border-white/10'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!n.is_read ? 'bg-[#D4AF37]/10' : 'bg-white/5'}`}>
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <h4 className={`text-sm font-bold ${!n.is_read ? 'text-white' : 'text-[#9CA3AF]'}`}>{n.title}</h4>
                    <span className="text-[10px] text-[#6B7280] shrink-0">{n.date}</span>
                  </div>
                  <p className={`text-xs ${!n.is_read ? 'text-[#E5E7EB]' : 'text-[#6B7280]'} leading-relaxed`}>
                    {n.message}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!loading && notifs.length === 0 && (
          <div className="text-center py-16 text-[#9CA3AF]">
            <Bell size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">You're all caught up</p>
            <p className="text-sm mt-1">No new notifications to display.</p>
          </div>
        )}
      </div>
    </div>
  );
}
