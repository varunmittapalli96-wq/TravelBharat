'use client';

import { useState, useEffect } from 'react';
import { History, ShieldCheck, User } from 'lucide-react';
import { getPublicApiUrl } from '../../../lib/api';

const API_URL = getPublicApiUrl();

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAudit() {
      try {
        const res = await fetch(`${API_URL}/admin/audit?limit=50`, {
          credentials: 'include',
        });
        if (res.ok) {
          const json = await res.json();
          setLogs(json.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAudit();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          Security & Audit Trail
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Immutable log of administrative operations, logins, status changes, and content modifications.
        </p>
      </div>

      <div className="card bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-stone-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity Type</th>
                <th className="py-3 px-4">Entity ID</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-stone-400">
                    Loading audit trail...
                  </td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-stone-800 dark:text-stone-200">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-stone-600 dark:text-stone-300">
                      {log.entity}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-stone-400">
                      {log.entityId}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 dark:text-stone-300">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        <span>{log.user?.email || 'System'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-stone-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-stone-400">
                    No audit records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
