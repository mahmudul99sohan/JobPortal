'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordStrengthLevel, setPasswordStrengthLevel] = useState(0);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&()#^]/.test(password)) score++;
    return score;
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    setPasswordStrengthLevel(getPasswordStrength(value));
  };

  const validate = () => {
    const errors = { newPassword: '', confirmPassword: '' };
    let valid = true;

    if (!newPassword) {
      errors.newPassword = 'New Password is required';
      valid = false;
    } else if (newPassword.length < 8) {
      errors.newPassword = 'Must be at least 8 characters';
      valid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&()#^])/.test(newPassword)) {
      errors.newPassword =
        'Must contain uppercase, lowercase, number, and special character';
      valid = false;
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
      valid = false;
    } else if (confirmPassword !== newPassword) {
      errors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setFieldErrors(errors);
    return valid;
  };

  const handleReset = async () => {
    setFieldErrors({ newPassword: '', confirmPassword: '' });
    setServerError('');
    setSuccessMessage('');

    if (!token) {
      setServerError('Reset token is missing.');
      return;
    }

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');

      setSuccessMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2500);
    } catch (err: any) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Reset Password
          </h1>
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <label className="block text-black dark:text-white font-medium text-sm">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              className="w-full px-4 py-2 pr-10 rounded-md border border-blue-400 dark:border-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
              value={newPassword}
              onChange={(e) => handleNewPasswordChange(e.target.value)}
              placeholder="Enter new password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((v) => !v)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              aria-label="Toggle new password visibility"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {fieldErrors.newPassword && (
            <p className="text-sm text-red-500">{fieldErrors.newPassword}</p>
          )}
          <div className="w-full h-2 rounded bg-gray-200 dark:bg-gray-700 mt-1">
            <div
              className={`h-2 rounded transition-all duration-300 ${
                passwordStrengthLevel <= 2
                  ? 'bg-red-500 w-1/4'
                  : passwordStrengthLevel === 3
                  ? 'bg-yellow-500 w-2/4'
                  : passwordStrengthLevel === 4
                  ? 'bg-blue-500 w-3/4'
                  : 'bg-green-500 w-full'
              }`}
            ></div>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="block text-black dark:text-white font-medium text-sm">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="w-full px-4 py-2 pr-10 rounded-md border border-blue-400 dark:border-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <p className="text-sm text-red-500">
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>

        {/* Server error / Success */}
        {serverError && <p className="text-sm text-red-500">{serverError}</p>}
        {successMessage && (
          <p className="text-sm text-green-600">{successMessage}</p>
        )}

        {/* Submit Button */}
        <button
          onClick={handleReset}
          className="btn w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-md py-2 text-base transition"
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </div>
  );
}
