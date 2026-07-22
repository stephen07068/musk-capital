import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, UserCheck, UserX, Trash2 } from 'lucide-react';
import { adminUsers } from '../../data/mockData';
import PageHeader from '../../components/ui/PageHeader';

export default function UserManagement() {
  const [users, setUsers] = useState(adminUsers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const toggleStatus = (id) => setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
  const deleteUser = (id) => setUsers(prev => prev.filter(u => u.id !== id));

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || u.status === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader title="User Management" subtitle="View, manage, and moderate platform users" />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Users', value: users.length },
          { label: 'Active', value: users.filter(u => u.status === 'active').length },
          { label: 'Suspended', value: users.filter(u => u.status === 'suspended').length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-4">
            <p className="text-[10px] text-[#9CA3AF] mb-1">{label}</p>
            <p className="text-2xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-8 pr-4 py-2 bg-black/40 border border-[#1F2937] rounded-xl text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37]/40" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 bg-black/40 border border-[#1F2937] rounded-xl text-xs text-[#9CA3AF] focus:outline-none focus:border-[#D4AF37]/40">
            <option>All</option>
            <option>Active</option>
            <option>Suspended</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F2937]">
                {['User', 'Username', 'Country', 'Balance', 'Joined', 'Last Login', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-widest pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <motion.tr key={u.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="border-b border-[#1F2937]/50 hover:bg-white/5 transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-black text-xs font-bold shrink-0">{u.avatar}</div>
                      <div>
                        <p className="text-xs font-bold text-white">{u.name}</p>
                        <p className="text-[10px] text-[#9CA3AF]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-xs text-[#9CA3AF]">@{u.username}</td>
                  <td className="py-3.5 pr-4 text-xs text-white">{u.country}</td>
                  <td className="py-3.5 pr-4 text-xs font-bold text-[#D4AF37]">${u.balance.toLocaleString()}</td>
                  <td className="py-3.5 pr-4 text-[10px] text-[#9CA3AF] whitespace-nowrap">{u.joined}</td>
                  <td className="py-3.5 pr-4 text-[10px] text-[#9CA3AF] whitespace-nowrap">{u.lastLogin}</td>
                  <td className="py-3.5 pr-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${u.status === 'active' ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>{u.status}</span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button className="p-1.5 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition-colors" title="View">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => toggleStatus(u.id)} className={`p-1.5 rounded-lg transition-colors ${u.status === 'active' ? 'text-red-400 hover:bg-red-400/10' : 'text-emerald-400 hover:bg-emerald-400/10'}`} title={u.status === 'active' ? 'Suspend' : 'Activate'}>
                        {u.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                      <button onClick={() => deleteUser(u.id)} className="p-1.5 text-[#6B7280] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-10 text-[#9CA3AF] text-sm">No users found.</p>}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#1F2937]">
          <p className="text-xs text-[#9CA3AF]">Showing {filtered.length} of {users.length} users</p>
        </div>
      </div>
    </div>
  );
}
