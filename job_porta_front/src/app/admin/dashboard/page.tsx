'use client';

import { Briefcase, Users, UserPlus, Settings } from 'lucide-react';

export default function DashboardHomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome to the Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Jobs" value="128" icon={<Briefcase size={28} />} />
        <DashboardCard title="Total Users" value="452" icon={<Users size={28} />} />
        <DashboardCard title="New Signups" value="24" icon={<UserPlus size={28} />} />
        <DashboardCard title="Settings" value="Updated" icon={<Settings size={28} />} />
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{title}</h2>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
      <div className="text-blue-600 dark:text-blue-400">{icon}</div>
    </div>
  );
}
