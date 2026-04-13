import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { adminGetOrders, adminUpdateOrderStatus } from '../api/api';
import { useNavigate } from 'react-router-dom';

const AdminOrdersPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await adminGetOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch admin orders", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user, navigate]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await adminUpdateOrderStatus(orderId, newStatus);
      // Update local state
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="text-center py-10 text-neutral-400">Loading all orders...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Orders</h1>
          <p className="mt-1 text-neutral-400">Update fulfillment status for customer orders.</p>
        </div>
        <button onClick={() => navigate('/admin')} className="text-sm text-accent hover:text-white">&larr; Back to Dashboard</button>
      </div>

      <div className="overflow-x-auto ub-card shadow-xl">
        <table className="min-w-full divide-y divide-neutral-800 table-fixed">
          <thead className="bg-primary-dark">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-neutral-400 uppercase tracking-tight">Order ID / Date</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-neutral-400 uppercase tracking-tight">Customer</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-neutral-400 uppercase tracking-tight">Total</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-neutral-400 uppercase tracking-tight">Status Update</th>
            </tr>
          </thead>
          <tbody className="bg-primary-dark divide-y divide-neutral-800/60">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-primary-light/30 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <div className="font-mono text-neutral-300">{order._id}</div>
                  <div className="text-xs text-neutral-500 mt-1">{new Date(order.createdAt).toLocaleString()}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <div className="text-white font-bold">{order.user?.name || 'Deleted User'}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-white font-mono font-bold text-right">
                  ${order.totalPrice}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    disabled={updatingId === order._id}
                    className={`bg-primary text-sm rounded border focus:outline-none p-1.5 ${
                      order.status === 'pending' ? 'text-amber-400 border-amber-400/50' :
                      order.status === 'confirmed' ? 'text-blue-400 border-blue-400/50' :
                      order.status === 'shipped' ? 'text-emerald-400 border-emerald-400/50' :
                      'text-rose-400 border-rose-400/50'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-neutral-500">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;