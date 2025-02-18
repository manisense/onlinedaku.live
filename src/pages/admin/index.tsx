import { NextPage } from 'next';
import AdminLayout from '@/admin/components/AdminLayout';

const AdminDashboard: NextPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dashboard widgets will go here */}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;