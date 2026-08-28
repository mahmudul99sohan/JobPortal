// src/app/login/page.tsx

'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showOtp, setShowOtp] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    identifier: '',
    password: '',
    otp: '',
  });

  const validateFields = () => {
    const errors = { identifier: '', password: '', otp: '' };
    let valid = true;

    if (!identifier.trim()) {
      errors.identifier = 'Email or Username is required';
      valid = false;
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
      valid = false;
    }

    if (showOtp && !otp.trim()) {
      errors.otp = 'OTP is required';
      valid = false;
    }

    setFieldErrors(errors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateFields()) return;

    try {
      setError('');
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, ...(showOtp && { otp }) }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message?.includes('verify')) {
          setShowOtp(true);
        }
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('accessToken', data.accessToken);
      alert('Login successful!');
      router.push('admin/dashboard'); // client-side navigation to dashboard
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black dark:text-white">Login</h1>
        </div>

        {/* Email or Username */}
        <div className="space-y-2">
          <label className="block text-black dark:text-white font-medium text-sm">
            Email or Username
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-md border border-blue-400 dark:border-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          {fieldErrors.identifier && (
            <p className="text-sm text-red-500">{fieldErrors.identifier}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="block text-black dark:text-white font-medium text-sm">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full px-4 py-2 pr-10 rounded-md border border-blue-400 dark:border-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-sm text-red-500">{fieldErrors.password}</p>
          )}
          <div className="text-right mt-1">
            <button
              type="button"
              onClick={() => router.push('/forgot-password')}
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Forgot password?
            </button>
          </div>
        </div>

        {/* OTP */}
        {showOtp && (
          <div className="space-y-2">
            <label className="block text-black dark:text-white font-medium text-sm">
              OTP
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md border border-blue-400 dark:border-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {fieldErrors.otp && (
              <p className="text-sm text-red-500">{fieldErrors.otp}</p>
            )}
          </div>
        )}

        {/* Server error */}
        {error && <div className="alert alert-error text-sm mt-2">{error}</div>}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="btn w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-md py-2 text-base transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
