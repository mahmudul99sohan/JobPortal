'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type User = {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: string;
  is_email_verified: boolean;
  created_at: string;
  phone_number: string;
  is_banned: boolean;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [emailVerifiedFilter, setEmailVerifiedFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [search, statusFilter, roleFilter, emailVerifiedFilter, users]);

  const fetchUsers = async () => {
  try {
    const token = localStorage.getItem('accessToken');

    const res = await fetch('http://localhost:3000/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error();
    const data = await res.json();
    setUsers(data);
  } catch {
    toast.error('Failed to fetch users');
  }
};


  const filterUsers = () => {
    let result = [...users];

    if (search) {
      const term = search.toLowerCase();
      result = result.filter(
        user =>
          `${user.first_name} ${user.last_name} ${user.username}`.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      );
    }

    if (statusFilter) {
      if (statusFilter === 'banned') {
        result = result.filter(user => user.is_banned);
      } else if (statusFilter === 'active') {
        result = result.filter(user => !user.is_banned);
      }
    }

    if (roleFilter) {
      result = result.filter(user => user.role === roleFilter);
    }

    if (emailVerifiedFilter) {
      result = result.filter(user =>
        emailVerifiedFilter === 'verified' ? user.is_email_verified : !user.is_email_verified
      );
    }

    setFilteredUsers(result);
  };

  const handleBan = async (id: string, newBanStatus: boolean) => {
    try {
      const res = await fetch(`http://localhost:3000/users/${id}/ban`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_banned: newBanStatus }),
      });

      if (!res.ok) throw new Error();
      toast.success(`User ${newBanStatus ? 'banned' : 'unbanned'} successfully`);
      fetchUsers();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">User Management</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, username or email"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 border rounded w-72 dark:bg-gray-800 dark:text-white"
        />

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </select>

        <select
          value={emailVerifiedFilter}
          onChange={e => setEmailVerifiedFilter(e.target.value)}
          className="px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="">Email Verified?</option>
          <option value="verified">Verified</option>
          <option value="not_verified">Not Verified</option>
        </select>

        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="employer">Employer</option>
          <option value="job_seeker">Job Seeker</option>
        </select>
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center">No users found.</p>
        )}

        {filteredUsers.map(user => (
          <div
            key={user.id}
            className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
              {user.first_name} {user.last_name} <span className="text-sm text-gray-500">({user.username})</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-1">{user.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone: {user.phone_number || 'N/A'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 capitalize">Role: {user.role}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Joined: {new Date(user.created_at).toLocaleDateString()}
            </p>
            <p className="text-sm mb-1">
              Email Verified:{' '}
              <span className={user.is_email_verified ? 'text-green-500' : 'text-red-500'}>
                {user.is_email_verified ? 'Yes' : 'No'}
              </span>
            </p>
            <p className={`text-sm font-semibold mb-4 ${user.is_banned ? 'text-red-600' : 'text-green-600'}`}>
              Status: {user.is_banned ? 'Banned' : 'Active'}
            </p>

            <button
              onClick={() => handleBan(user.id, !user.is_banned)}
              className={`w-full py-2 rounded text-white font-medium ${
                user.is_banned ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {user.is_banned ? 'Unban' : 'Ban'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
