'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setMessage('');
    setError('');

    // Custom validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email must be a valid email address');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send reset email');

      setMessage(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow space-y-6">
        <h2 className="text-2xl font-bold text-center text-black dark:text-white">
          Forgot Password
        </h2>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-black dark:text-white">
            Enter your email
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 rounded-md border border-blue-400 dark:border-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {message && (
          <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-base transition"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
