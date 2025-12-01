import React from 'react';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';

export default function AdminLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full mt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
