'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Landmark,
  CheckCircle,
  Clock,
  FileEdit,
  Trash2,
  ExternalLink,
  Search,
  Filter,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export default function AdminPlacesPage() {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadPlaces = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/admin/places?limit=100`;
      if (statusFilter) url += `&status=${statusFilter}`;
      const res = await fetch(url, { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        setPlaces(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaces();
  }, [statusFilter]);

  const handleStatusChange = async (placeId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/places/${placeId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setPlaces((prev) =>
          prev.map((p) => (p.id === placeId ? { ...p, status: newStatus } : p))
        );
      }
    } catch (err) {
      console.error('Failed to change status', err);
    }
  };

  const handleDelete = async (placeId: string, placeName: string) => {
    if (!confirm(`Are you sure you want to soft-delete "${placeName}"?`)) return;

    try {
      const res = await fetch(`${API_URL}/admin/places/${placeId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setPlaces((prev) => prev.filter((p) => p.id !== placeId));
      }
    } catch (err) {
      console.error('Failed to delete place', err);
    }
  };

  const filtered = search
    ? places.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.state?.name.toLowerCase().includes(search.toLowerCase())
      )
    : places;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Destinations Catalog
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Manage tourist destinations, status transitions, and publication status.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by place name or state..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-stone-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 focus:outline-none w-full sm:w-auto"
          >
            <option value="">All Statuses</option>
            <option value="VERIFIED">Verified</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {/* Places Table */}
      <div className="card bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-stone-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Place Name</th>
                <th className="py-3 px-4">State & City</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Publication Status</th>
                <th className="py-3 px-4">Workflow Actions</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400">
                    Loading catalog records...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((place) => (
                  <tr key={place.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        <span>{place.name}</span>
                        {place.isUnesco && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                            UNESCO
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-400 font-mono">/{place.slug}</span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 dark:text-stone-300">
                      <span>{place.city ? `${place.city.name}, ` : ''}{place.state?.name}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {place.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          place.status === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : place.status === 'IN_REVIEW'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {place.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        {place.status !== 'VERIFIED' && (
                          <button
                            onClick={() => handleStatusChange(place.id, 'VERIFIED')}
                            className="px-2 py-1 rounded-md text-[10px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                          >
                            Publish Live
                          </button>
                        )}
                        {place.status === 'DRAFT' && (
                          <button
                            onClick={() => handleStatusChange(place.id, 'IN_REVIEW')}
                            className="px-2 py-1 rounded-md text-[10px] font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
                          >
                            Mark In Review
                          </button>
                        )}
                        {place.status === 'VERIFIED' && (
                          <button
                            onClick={() => handleStatusChange(place.id, 'DRAFT')}
                            className="px-2 py-1 rounded-md text-[10px] font-semibold bg-stone-600 hover:bg-stone-700 text-white transition-colors"
                          >
                            Unpublish
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/places/${place.slug}`}
                          target="_blank"
                          className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                          title="View on Public Site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(place.id, place.name)}
                          className="p-1 rounded text-stone-400 hover:text-rose-600 transition-colors"
                          title="Soft delete place"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400">
                    No destinations match your filter criteria.
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
