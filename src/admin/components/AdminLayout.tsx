import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white">
        <nav className="p-4">
          <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
          {/* Navigation items will go here */}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;