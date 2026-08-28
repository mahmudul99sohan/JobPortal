// app/page.tsx
'use client';


import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { UserPlus, LogIn, Users, Briefcase, Building2, DollarSign, Shield } from 'lucide-react';

export default function HomePage() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const descriptions: Record<string, string> = {
    community:
      '👥 Community is where job seekers and professionals connect to share tips, experiences, and advice. Participate in discussions, grow your network, and stay motivated in your job search journey.',
    jobs:
      '💼 Jobs section lets you browse thousands of listings across industries. Filter by location, experience, salary, and more. Apply easily and track your application status.',
    companies:
      '🏢 Companies directory includes reviews, ratings, and interview experiences from employees. Learn about company culture, salaries, benefits, and opportunities before you apply.',
    salaries:
      '💰 Salaries insight tool provides up-to-date compensation trends across job titles and industries. Compare average pay by role, experience, and location to make informed career decisions.',
    employers:
      '🛡️ For Employers is your hiring solution: post job openings, manage applicants, and boost your company’s visibility. Access detailed hiring analytics and find top talent efficiently.'
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white shadow-xl px-10 py-6 flex flex-col lg:flex-row justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-8 relative">
          <h1 className="text-4xl font-extrabold text-blue-700 tracking-tighter">JobFinder</h1>
          <nav className="hidden md:flex space-x-6 text-md font-semibold relative">
            {[
              { id: 'community', label: 'Community', icon: <Users className="w-4 h-4" /> },
              { id: 'jobs', label: 'Jobs', icon: <Briefcase className="w-4 h-4" /> },
              { id: 'companies', label: 'Companies', icon: <Building2 className="w-4 h-4" /> },
              { id: 'salaries', label: 'Salaries', icon: <DollarSign className="w-4 h-4" /> },
              { id: 'employers', label: 'For Employers', icon: <Shield className="w-4 h-4" /> }
            ].map(({ id, label, icon }) => (
              <div
                key={id}
                onMouseEnter={() => setHoveredItem(id)}
                onMouseLeave={() => setHoveredItem(null)}
                className="relative cursor-pointer"
              >
                <div className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors duration-300">
                  {icon} {label}
                </div>
                {hoveredItem === id && (
                  <div className="absolute left-0 top-full mt-2 w-72 bg-white text-sm p-4 rounded shadow-lg border z-50">
                    {descriptions[id]}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
        <div className="flex space-x-4 mt-4 lg:mt-0">
          <Link href="/signup" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 text-sm font-medium">
            <UserPlus className="w-4 h-4" /> Sign Up
          </Link>
          <Link href="/login" className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 text-sm font-medium">
            <LogIn className="w-4 h-4" /> Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-100 to-blue-200 py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero.jpg')] bg-cover bg-center opacity-50"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <h2 className="text-6xl font-black text-gray-900 mb-6 drop-shadow-md">Find Your Dream Job</h2>
          <p className="text-xl text-gray-700 mb-10">Search thousands of job listings from top companies around the world.</p>
          <Link
            href="/jobs"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-blue-700 transition duration-300 shadow-lg"
          >
            Start Exploring
          </Link>
        </div>
      </section>

      {/* Featured Jobs */}
    <section className="py-20 px-8 lg:px-28 bg-white">
    <h3 className="text-4xl font-bold mb-16 text-center text-blue-700">Featured Jobs</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {[
        {
            id: 1,
            title: "Frontend Developer",
            company: "Innovative Tech",
            location: "Dhaka",
            image: "/images/job1.jpg",
            link: "/jobs/1"
        },
        {
            id: 2,
            title: "Backend Engineer",
            company: "NextGen Solutions",
            location: "Chittagong",
            image: "/images/job2.jpg",
            link: "/jobs/2"
        },
        {
            id: 3,
            title: "UI/UX Designer",
            company: "Creative Minds",
            location: "Sylhet",
            image: "/images/job3.jpg",
            link: "/jobs/3"
        }
        ].map((job) => (
        <div key={job.id} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 p-6 border border-gray-100">
            <div className="w-full h-[200px] rounded-2xl overflow-hidden mb-5">
            <Image
                src={job.image}
                alt={job.title}
                width={500}
                height={300}
                className="object-cover w-full h-full"
            />
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-2">{job.title}</h4>
            <p className="text-base text-gray-500 mb-4">{job.company} · {job.location}</p>
            <Link
            href={job.link}
            className="inline-block text-white bg-blue-600 px-6 py-2 rounded-full hover:bg-blue-700 text-sm font-semibold transition duration-300"
            >
            View Details
            </Link>
        </div>
        ))}
    </div>
    </section>


      {/* Footer */}
      <footer className="bg-gray-100 text-center px-6 py-12 mt-28 border-t border-gray-200 text-sm text-gray-600">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-gray-800 mb-2">JobFinder</h4>
            <p>Helping you connect with top companies and land your dream job. Built with modern tools and love.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-2">Quick Links</h4>
            <ul className="space-y-1">
              <li><Link href="/jobs" className="hover:underline">Find Jobs</Link></li>
              <li><Link href="/post-job" className="hover:underline">Post a Job</Link></li>
              <li><Link href="/companies" className="hover:underline">Companies</Link></li>
              <li><Link href="/login" className="hover:underline">Login</Link></li>
              <li><Link href="/signup" className="hover:underline">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-2">Contact</h4>
            <p>Email: support@jobfinder.com</p>
            <p>Phone: +880-1234-567890</p>
            <p>Dhaka, Bangladesh</p>
          </div>
        </div>
        <p className="mt-10">© 2025 JobFinder. All rights reserved.</p>
      </footer>
    </main>
  );
}
