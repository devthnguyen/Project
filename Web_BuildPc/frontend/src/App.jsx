import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import CPUPage from './pages/CPUPage';
import GPUPage from './pages/GPUPage';
import MotherboardPage from './pages/MotherboardPage';
import RamPage from './pages/RamPage';
import PsuPage from './pages/PsuPage';
import SsdPage from './pages/SsdPage'; // <-- FIXED: Imported the SSD List Page!

import ComponentDetail from './pages/ComponentDetail';
import ComparePage from './pages/ComparePage';
import BuildPCPage from './pages/BuildPCPage';

import ComponentDetailsPage from './pages/ComponentDetailsPage';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';

import AdminDashboard from './pages/AdminDashboard';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminComponentsPage from './pages/AdminComponentsPage';

import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-primary flex flex-col">
          <Navbar />
          <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 md:px-6 py-8">
            <Routes>
              {/* List Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/cpu" element={<CPUPage />} />
              <Route path="/gpu" element={<GPUPage />} />
              <Route path="/motherboard" element={<MotherboardPage />} />
              <Route path="/ram" element={<RamPage />} />
              <Route path="/psu" element={<PsuPage />} />
              <Route path="/ssd" element={<SsdPage />} /> {/* <-- FIXED: Added the SSD Route! */}

              {/* Detail Pages */}
              <Route path="/component/:type/:id" element={<ComponentDetailsPage />} />

              <Route path="/compare" element={<ComparePage />} />
              <Route path="/build-pc" element={<BuildPCPage />} />
              
              {/* Auth & User Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersPage />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/components" element={<AdminComponentsPage />} />
            </Routes>
          </main>
          <footer className="bg-primary-dark border-t border-neutral-800/80 text-neutral-600 py-6 mt-10 text-center text-xs">
            <p className="max-w-[1400px] mx-auto px-4">
              &copy; {new Date().getFullYear()} UserBenchClone E-Commerce. For demonstration purposes only.
            </p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
    
  );
}

export default App;