import React, { useState } from 'react';
import { Search, ShieldAlert, Download } from 'lucide-react';
import { auditLogs } from '../../data/mockData';
import PageHeader from '../../components/ui/PageHeader';

export default function AuditLogs() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = auditLogs.filter(log => {
    const matchSearch = log.action.toLowerCase().includes(search.toLowerCase()) || log.admin.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || log.type === filter.toLowerCase();
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PageHeader 
        title="Audit Logs" 
        subtitle="Track administrative actions and system security events" 
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0D0F14] border border-[#1F2937] rounded-xl text-xs font-semibold text-[#9CA3AF] hover:text-white hover:border-[#D4AF37]/40 transition-all">
            <Download size={14} /> Export Logs
          </button>
        }
      />

      <div className="bg-[#0D0F14] border border-[#1F2937] rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search logs by action or admin..." className="w-full pl-8 pr-4 py-2 bg-black/40 border border-[#1F2937] rounded-xl text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37]/40" />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-2 bg-black/40 border border-[#1F2937] rounded-xl text-xs text-[#9CA3AF] focus:outline-none focus:border-[#D4AF37]/40">
            <option>All</option>
            <option value="security">Security</option>
            <option value="approval">Approvals</option>
            <option value="system">System</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1F2937]">
                {['Timestamp', 'Admin', 'Action', 'Type', 'IP Address'].map(h => (
                  <th key={h} className="text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-widest pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id} className="border-b border-[#1F2937]/50 hover:bg-white/5 transition-colors">
                  <td className="py-3.5 pr-4 text-[10px] text-[#9CA3AF] whitespace-nowrap">{log.date}</td>
                  <td className="py-3.5 pr-4 text-xs font-bold text-white">{log.admin}</td>
                  <td className="py-3.5 pr-4">
                    <p className="text-xs text-white">{log.action}</p>
                    {log.details && <p className="text-[10px] text-[#6B7280] mt-0.5">{log.details}</p>}
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${log.type === 'security' ? 'text-red-400 bg-red-400/10' : log.type === 'approval' ? 'text-emerald-400 bg-emerald-400/10' : 'text-blue-400 bg-blue-400/10'}`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 font-mono text-[10px] text-[#9CA3AF]">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-10 text-[#9CA3AF] text-sm">No audit logs found.</p>}
        </div>
      </div>
    </div>
  );
}
