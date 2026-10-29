'use client';

import { useState } from 'react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { getPublicApiUrl } from '../../lib/api';

const API_URL = getPublicApiUrl();

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error?.message || 'Failed to submit message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12 md:py-20">
        <div className="container-main max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-saffron-50 dark:bg-saffron-950/40 text-saffron-700 dark:text-saffron-400 border border-saffron-200 dark:border-saffron-800 mb-3">
              <Mail className="w-3.5 h-3.5" />
              <span>Get in Touch</span>
            </div>
            <h1 className="section-title">Editorial Contact & Feedback</h1>
            <p className="section-subtitle mx-auto">
              Found an update or correction for a monument? Want to propose an emerging tourist place? Let our editorial team know.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Info Col */}
            <div className="space-y-6">
              <div className="card p-6 bg-white dark:bg-stone-900 border border-[color:var(--color-border)]">
                <h3 className="font-heading font-bold text-lg text-[color:var(--color-text-primary)] mb-2">
                  Editorial Desk
                </h3>
                <p className="text-xs text-[color:var(--color-text-secondary)] leading-relaxed mb-4">
                  TravelBharat is curated by tourism enthusiasts, historians, and verified contributors across India.
                </p>
                <div className="text-xs space-y-2 text-stone-600 dark:text-stone-300">
                  <p>📧 contact@travelbharat.in</p>
                  <p>📍 New Delhi, India</p>
                </div>
              </div>

              <div className="card p-6 bg-gradient-to-tr from-teal-500/10 via-saffron-500/10 to-transparent border border-[color:var(--color-border)]">
                <h4 className="font-heading font-bold text-base text-[color:var(--color-text-primary)] mb-1">
                  Data Accuracy Guarantee
                </h4>
                <p className="text-xs text-[color:var(--color-text-secondary)] leading-relaxed">
                  Corrections submitted with valid government tourism links are typically verified and updated within 48 hours.
                </p>
              </div>
            </div>

            {/* Form Col */}
            <div className="md:col-span-2">
              <div className="card p-8 bg-white dark:bg-stone-900 border border-[color:var(--color-border)] shadow-md rounded-3xl">
                {status === 'success' ? (
                  <div className="py-12 text-center space-y-4">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                    <h3 className="font-heading text-2xl font-bold text-stone-900 dark:text-stone-100">
                      Message Received!
                    </h3>
                    <p className="text-sm text-stone-500 max-w-md mx-auto">
                      Thank you for contributing to TravelBharat. Our editorial desk has logged your submission and will review it promptly.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      type="button"
                      className="btn-secondary text-xs mt-4"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {status === 'error' && (
                      <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[color:var(--color-text-secondary)] mb-1.5">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Rahul Sharma"
                          className="input-field text-sm py-2.5"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[color:var(--color-text-secondary)] mb-1.5">
                          Your Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. rahul@example.com"
                          className="input-field text-sm py-2.5"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[color:var(--color-text-secondary)] mb-1.5">
                        Subject / Topic *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Entry fee update for Konark Sun Temple"
                        className="input-field text-sm py-2.5"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[color:var(--color-text-secondary)] mb-1.5">
                        Message & Reference Details *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Please describe the correction or query in detail, including any official sources or links..."
                        className="input-field text-sm py-2.5"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="btn-primary w-full text-sm py-3 gap-2"
                    >
                      {status === 'submitting' ? (
                        <span>Submitting...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Message to Editorial Desk</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
