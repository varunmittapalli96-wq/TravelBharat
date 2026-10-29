'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Compass, Shield, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { getPublicApiUrl } from '../../../lib/api';

const API_URL = getPublicApiUrl();

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@travelbharat.in');
  const [password, setPassword] = useState('Admin@TravelBharat2024!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error?.message || 'Invalid email or password');
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-stone-100 dark:bg-stone-950">
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to TravelBharat</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-saffron-500 to-amber-500 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-saffron-500/20">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-stone-900 dark:text-stone-100">
            Editorial Admin
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Access TravelBharat editorial desk & moderation
          </p>
        </div>

        <div className="card p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl rounded-3xl">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10 text-sm py-2.5"
                  placeholder="admin@travelbharat.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 text-sm py-2.5"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-sm py-3 font-semibold"
              >
                {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 text-center">
            <p className="text-[11px] text-stone-400">
              Demo credentials: <strong className="text-stone-600 dark:text-stone-300">admin@travelbharat.in</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
