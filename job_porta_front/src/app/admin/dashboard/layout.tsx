'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  Briefcase,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  ChevronRight,
  UserPlus,
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { PlusCircle } from 'lucide-react';



export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    }

    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  const breadcrumbs = [
    { label: 'Home', href: '/admin/dashboard' },
    ...(pathname === '/admin/dashboard/add-user'
      ? [{ label: 'Add New User', href: pathname }]
      : [{ label: 'Dashboard', href: pathname }]),
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 h-full bg-white dark:bg-gray-800 border-r z-20
          ${sidebarOpen ? 'w-64' : 'w-16'}
          md:static fixed top-0 left-0`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-gray-700">
          <h1 className={`text-xl font-bold text-blue-600 dark:text-blue-400 truncate ${sidebarOpen ? '' : 'hidden'}`}>
            Jobs Finder
          </h1>
          <button
            className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex flex-col flex-1 mt-4 space-y-1 px-2 overflow-auto">
          <SidebarLink icon={Home} label="Dashboard" sidebarOpen={sidebarOpen} href="/admin/dashboard" active={pathname === '/admin/dashboard'} />
          <SidebarLink icon={Briefcase} label="Manage Jobs" sidebarOpen={sidebarOpen} href="/admin/dashboard/jobs" active={pathname === '/admin/dashboard/jobs'} />
          <SidebarLink
            icon={Users}
            label="Manage Users"
            sidebarOpen={sidebarOpen}
            href="/admin/dashboard/users"
            active={pathname === '/admin/dashboard/users'}
            />

          <SidebarLink icon={UserPlus} label="Add New User" sidebarOpen={sidebarOpen} href="/admin/dashboard/add-user" active={pathname === '/admin/dashboard/add-user'} />
          <SidebarLink
                icon={PlusCircle}
                label="Add Job"
                sidebarOpen={sidebarOpen}
                href="/admin/dashboard/add-job"
                active={pathname === '/admin/dashboard/add-job'}
            />

          <SidebarLink icon={Settings} label="Settings" sidebarOpen={sidebarOpen} href="/admin/dashboard/settings" active={pathname === '/admin/dashboard/settings'} />
        </nav>

        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-md px-3 py-2 font-semibold transition"
          >
            <LogOut size={18} className="mr-2" />
            <span className={`${sidebarOpen ? 'inline' : 'hidden'}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col transition-all duration-300 ml-0">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 fixed w-full md:static z-10">
          <div className="flex items-center gap-6">
            <button
              className="md:hidden p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white select-none">
              Admin Panel
            </h2>
            <Breadcrumbs items={breadcrumbs} />
          </div>

          <div className="flex items-center gap-4 relative">
            <button className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-600 rounded-full w-4 h-4 flex items-center justify-center text-xs text-white">
                3
              </span>
            </button>
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-md px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <UserAvatar />
                <span className="text-gray-900 dark:text-white select-none">Admin</span>
                <ChevronDown size={16} />
              </button>
              {userMenuOpen && (
                <UserDropdownMenu onLogout={handleLogout} closeMenu={() => setUserMenuOpen(false)} />
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 mt-16 overflow-auto bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
        <Toaster position="top-center" />


      </div>
    </div>
  );
}

function SidebarLink({ icon: Icon, label, active, sidebarOpen, href }: {
  icon: React.FC<{ size?: number }>;
  label: string;
  active?: boolean;
  sidebarOpen: boolean;
  href: string;
}) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer text-gray-700 dark:text-gray-300
          hover:bg-blue-100 dark:hover:bg-blue-700 transition ${
            active ? 'bg-blue-200 dark:bg-blue-600 font-semibold text-blue-700 dark:text-blue-200' : ''
          }`}
      >
        <Icon size={20} />
        <span className={`${sidebarOpen ? 'inline' : 'hidden'}`}>{label}</span>
      </div>
    </Link>
  );
}

function Breadcrumbs({ items }: { items: { label: string; href: string }[] }) {
  return (
    <nav className="hidden md:flex items-center gap-1 text-gray-600 dark:text-gray-400 select-none">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1">
          <Link href={item.href} className="hover:underline hover:text-gray-900 dark:hover:text-white">
            {item.label}
          </Link>
          {i < items.length - 1 && <ChevronRight size={14} />}
        </span>
      ))}
    </nav>
  );
}

function UserAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold uppercase select-none">
      A
    </div>
  );
}

function UserDropdownMenu({
  onLogout,
  closeMenu,
}: {
  onLogout: () => void;
  closeMenu: () => void;
}) {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
      <Link href="#" onClick={closeMenu} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
        Profile
      </Link>
      <Link href="#" onClick={closeMenu} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
        Settings
      </Link>
      <button
        onClick={() => {
          onLogout();
          closeMenu();
        }}
        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900"
      >
        Logout
      </button>
    </div>
  );
}
