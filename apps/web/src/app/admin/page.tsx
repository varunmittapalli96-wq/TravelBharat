'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Landmark,
  Building,
  MapPin,
  Award,
  CheckCircle,
  FileEdit,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { getPublicApiUrl } from '../../lib/api';

const API_URL = getPublicApiUrl();

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch(`${API_URL}/admin/dashboard`, {
          credentials: 'include',
        });
        if (res.ok) {
          const json = await res.json();
          setStats(json.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-6 h-32 skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl">
      {/* Title */}
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          Editorial Overview
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          TravelBharat editorial workflow, publication queue, and audit logs.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">States & UTs</span>
            <MapPin className="w-5 h-5 text-saffron-500" />
          </div>
          <p className="font-heading text-3xl font-bold text-stone-900 dark:text-stone-100">{stats?.totalStates || 36}</p>
          <p className="text-xs text-stone-400 mt-1">100% Pan-India coverage</p>
        </div>

        <div className="card p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Documented Cities</span>
            <Building className="w-5 h-5 text-teal-500" />
          </div>
          <p className="font-heading text-3xl font-bold text-stone-900 dark:text-stone-100">{stats?.totalCities || 81}</p>
          <p className="text-xs text-stone-400 mt-1">Spanning all 36 regions</p>
        </div>

        <div className="card p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Destinations</span>
            <Landmark className="w-5 h-5 text-amber-500" />
          </div>
          <p className="font-heading text-3xl font-bold text-stone-900 dark:text-stone-100">{stats?.totalPlaces || 0}</p>
          <p className="text-xs text-stone-400 mt-1">Curated tourist records</p>
        </div>

        <div className="card p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">UNESCO Sites</span>
            <Award className="w-5 h-5 text-blue-500" />
          </div>
          <p className="font-heading text-3xl font-bold text-stone-900 dark:text-stone-100">{stats?.unescoPlaces || 0}</p>
          <p className="text-xs text-stone-400 mt-1">World Heritage catalog</p>
        </div>
      </div>

      {/* Moderation Workflow Queue */}
      <div className="card p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading text-xl font-bold text-stone-900 dark:text-stone-100">
              Publication Workflow Status
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">Distribution of destinations across publishing stages</p>
          </div>
          <Link
            href="/admin/places"
            className="text-xs font-semibold text-saffron-600 dark:text-saffron-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Manage Places</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 uppercase">Verified Live</p>
                <p className="font-heading text-2xl font-bold text-emerald-700 dark:text-emerald-400">{stats?.verifiedPlaces || 0}</p>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold">
              Active
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 uppercase">In Review</p>
                <p className="font-heading text-2xl font-bold text-amber-700 dark:text-amber-400">{stats?.inReviewPlaces || 0}</p>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 font-bold">
              Pending
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileEdit className="w-5 h-5 text-stone-600 dark:text-stone-400" />
              <div>
                <p className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase">Drafts</p>
                <p className="font-heading text-2xl font-bold text-stone-800 dark:text-stone-200">{stats?.draftPlaces || 0}</p>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold">
              Unpublished
            </span>
          </div>
        </div>
      </div>

      {/* Recent Editorial Activity */}
      <div className="card p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl font-bold text-stone-900 dark:text-stone-100">
            Recent Audit Activity
          </h2>
          <Link
            href="/admin/audit"
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Full Audit Log</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recentEdits && stats.recentEdits.length > 0 ? (
          <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
            {stats.recentEdits.map((item: any) => (
              <div key={item.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                    {item.action}
                  </span>
                  <span className="text-stone-900 dark:text-stone-100 font-medium">
                    {item.entity} (ID: {item.entityId?.substring(0, 8)}...)
                  </span>
                </div>
                <div className="flex items-center gap-4 text-stone-400">
                  <span>{item.user?.email || 'admin@travelbharat.in'}</span>
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-400 py-4">No recent edits recorded yet.</p>
        )}
      </div>
    </div>
  );
}
