'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AddUserPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to add user');
      }

      toast.success('User added successfully!');
      setFormData({ first_name: '', last_name: '', email: '', password: '', role: '' });
      setErrors({});
    } catch (err: any) {
      setSuccess('');
      alert(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Add New User</h1>
      {success && <p className="text-green-600 font-medium mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
          <input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
          />
          {errors.first_name && <p className="text-red-600 text-sm mt-1">{errors.first_name}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
          <input
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
          />
          {errors.last_name && <p className="text-red-600 text-sm mt-1">{errors.last_name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
          />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded-md bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="employer">Employer</option>
            <option value="job_seeker">Job seeker</option>
            
          </select>
          {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Add User
        </button>
      </form>
    </div>
  );
}
