import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserOrders } from '../api/api';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'confirmed': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'shipped': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'cancelled': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-neutral-400 bg-neutral-800 border-neutral-700';
    }
  };

  if (loading) return <div className="text-center py-10 text-neutral-400">Loading orders...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white">Order History</h1>
      
      {orders.length === 0 ? (
        <div className="ub-card p-10 text-center">
          <p className="text-neutral-400 mb-4">You haven't placed any orders yet.</p>
          <Link to="/build-pc" className="btn-accent inline-block">Build a PC</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="ub-card p-6 border border-neutral-700/80">
              <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 pb-4 border-b border-neutral-800">
                <div>
                  <p className="text-sm text-neutral-400">Order ID: <span className="font-mono text-neutral-300">{order._id}</span></p>
                  <p className="text-sm text-neutral-400">Placed on: <span className="text-white">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-4">
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-2xl font-black text-white">${order.totalPrice}</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-neutral-300 mb-2 uppercase tracking-wide">Items</h4>
                  <ul className="space-y-2">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-sm">
                        <span className="text-neutral-400 truncate pr-4">{item.name}</span>
                        <span className="text-white font-mono">${item.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-300 mb-2 uppercase tracking-wide">Shipping Address</h4>
                  <p className="text-sm text-neutral-400 whitespace-pre-line bg-primary-dark p-3 rounded border border-neutral-800">
                    {order.address}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;