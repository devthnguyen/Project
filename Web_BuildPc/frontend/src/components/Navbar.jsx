import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return isActive
      ? "px-4 py-1.5 rounded text-sm font-medium transition duration-150 whitespace-nowrap bg-primary text-accent"
      : "px-4 py-1.5 rounded text-sm font-medium transition duration-150 whitespace-nowrap text-neutral-300 hover:bg-primary-light hover:text-white";
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary-dark border-b border-neutral-800 shadow-xl sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-accent rounded-sm rotate-45 flex items-center justify-center shadow-md">
              <span className="text-xs font-black text-primary-dark -rotate-45">U</span>
            </div>
            <Link to="/" className="text-xl font-black tracking-tight text-white flex gap-1">
              <span>User</span><span className="text-accent">Bench</span><span className="text-neutral-500 text-base font-medium mt-1">Store</span>
            </Link>
          </div>

          {/* Main Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 overflow-x-auto">
            <Link to="/cpu" className={getLinkClass('/cpu')}>CPU</Link>
            <Link to="/gpu" className={getLinkClass('/gpu')}>GPU</Link>
            <Link to="/motherboard" className={getLinkClass('/motherboard')}>MOBOS</Link>
            <Link to="/ram" className={getLinkClass('/ram')}>RAM</Link>
            <Link to="/psu" className={getLinkClass('/psu')}>PSU</Link>
            <Link to="/ssd" className={getLinkClass('/ssd')}>SSD</Link>
            <Link to="/build-pc" className={getLinkClass('/build-pc')}>BUILD PC</Link>
          </div>

          {/* User Auth & Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-sm font-bold text-rose-500 hover:text-rose-400 mr-2">Admin</Link>
                )}
                <Link to="/orders" className="text-sm text-neutral-300 hover:text-white transition hidden sm:block">Orders</Link>
                <Link to="/profile" className="text-sm text-accent hover:text-white transition font-bold">{user.name}</Link>
                <button onClick={handleLogout} className="btn-accent hidden sm:block bg-neutral-700 hover:bg-neutral-600 text-white">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-neutral-300 hover:text-white transition hidden sm:block">Sign In</Link>
                <Link to="/register" className="btn-accent hidden sm:block">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;