import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { adminGetUsers, adminDeleteUser } from '../api/api';
import { useNavigate } from 'react-router-dom';

const AdminUsersPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchUsers = async () => {
      try {
        const data = await adminGetUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [user, navigate]);

  const handleDeleteUser = async (id, role) => {
    if (role === 'admin') {
      return alert("Cannot delete an admin user.");
    }
    
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await adminDeleteUser(id);
        setUsers(users.filter(u => u._id !== id));
      } catch (error) {
        console.error("Failed to delete user", error);
        alert(error.response?.data?.message || "Failed to delete user.");
      }
    }
  };

  if (loading) return <div className="text-center py-10 text-neutral-400">Loading user database...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Users</h1>
          <p className="mt-1 text-neutral-400">View registered accounts and remove policy violators.</p>
        </div>
        <button onClick={() => navigate('/admin')} className="text-sm text-accent hover:text-white">&larr; Back to Dashboard</button>
      </div>

      <div className="overflow-x-auto ub-card shadow-xl">
        <table className="min-w-full divide-y divide-neutral-800 table-fixed">
          <thead className="bg-primary-dark">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-neutral-400 uppercase tracking-tight w-1/4">Name</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-neutral-400 uppercase tracking-tight w-1/3">Email</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-neutral-400 uppercase tracking-tight">Role</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-neutral-400 uppercase tracking-tight pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-primary-dark divide-y divide-neutral-800/60">
            {users.map((account) => (
              <tr key={account._id} className="hover:bg-primary-light/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                  {account.name}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-400">
                  {account.email}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 text-xs font-bold uppercase rounded ${account.role === 'admin' ? 'bg-rose-500/20 text-rose-400' : 'bg-primary-light text-neutral-300'}`}>
                    {account.role}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right pr-6">
                  <button 
                    onClick={() => handleDeleteUser(account._id, account.role)}
                    disabled={account.role === 'admin'}
                    className="text-rose-500 hover:text-rose-400 font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-neutral-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;