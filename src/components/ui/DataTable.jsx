import React from 'react';

const statusColors = {
  approved: 'text-emerald-400 bg-emerald-400/10',
  pending: 'text-yellow-400 bg-yellow-400/10',
  rejected: 'text-red-400 bg-red-400/10',
};

export function StatusBadge({ status }) {
  return (
    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${statusColors[status] || 'text-[#9CA3AF] bg-white/5'}`}>
      {status}
    </span>
  );
}

export default function DataTable({ columns, data, emptyMessage = 'No records found.' }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-[#9CA3AF] text-sm">{emptyMessage}</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#1F222A]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left text-[10px] font-bold text-[#6B7280] uppercase tracking-widest pb-3 pr-4 whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1F222A]/50">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-white/5 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="py-3.5 pr-4 text-white whitespace-nowrap">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
