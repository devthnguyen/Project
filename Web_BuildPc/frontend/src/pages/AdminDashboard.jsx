import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-2 text-neutral-400">Manage store orders, users, and hardware components.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Manage Orders */}
        <div className="ub-card p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Orders</h2>
          <p className="text-sm text-neutral-400 mb-6">View all customer orders and update shipping statuses.</p>
          <Link to="/admin/orders" className="btn-accent w-full mt-auto">Manage Orders</Link>
        </div>

        {/* Manage Users */}
        <div className="ub-card p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Users</h2>
          <p className="text-sm text-neutral-400 mb-6">View registered accounts and remove policy violators.</p>
          <Link to="/admin/users" className="btn-accent w-full mt-auto bg-emerald-600 hover:bg-emerald-500">Manage Users</Link>
        </div>

        {/* Manage Components (Placeholder for full CRUD expansion) */}
        <div className="ub-card p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Hardware DB</h2>
          <p className="text-sm text-neutral-400 mb-6">Add, edit, or remove CPUs, GPUs, and other components via API.</p>
          <Link to="/admin/components" className="btn-accent w-full mt-auto bg-purple-600 hover:bg-purple-500">Manage Database</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;