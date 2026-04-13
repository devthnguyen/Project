import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserProfile } from '../api/api';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (loading) return <div className="text-center py-10 text-neutral-400">Loading profile...</div>;
  if (!profile) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white">My Profile</h1>
      
      {/* Profile Header */}
      <div className="ub-card p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-primary-dark text-2xl font-black">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
            <p className="text-neutral-400">{profile.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-primary-light text-xs font-bold rounded text-neutral-300 uppercase">
              {profile.role} account
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Account Stats */}
        <div className="md:col-span-1 space-y-8">
          <div className="ub-card p-6">
            <h3 className="text-xl font-bold text-white mb-4 border-b border-neutral-700/80 pb-2">Account Stats</h3>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span className="text-neutral-400">Total Orders</span>
                <span className="text-white font-bold">{profile.orders?.length || 0}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-neutral-400">Saved Builds</span>
                <span className="text-white font-bold">{profile.savedBuilds?.length || 0}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-neutral-400">Member Since</span>
                <span className="text-white font-bold">{new Date(profile.createdAt).toLocaleDateString()}</span>
              </li>
            </ul>
          </div>

          <div className="ub-card p-6 flex flex-col justify-center items-center text-center">
            <h3 className="text-lg font-bold text-neutral-300 mb-2">Track Packages</h3>
            <p className="text-sm text-neutral-400 mb-4">View shipping status and receipt details.</p>
            <Link to="/orders" className="btn-accent w-full">View Order History</Link>
          </div>
        </div>

        {/* Saved Builds Section */}
        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold text-white mb-4">My Saved Builds</h3>
          {profile.savedBuilds && profile.savedBuilds.length > 0 ? (
            <div className="space-y-4">
              {profile.savedBuilds.map((build, index) => (
                <div key={build._id || index} className="ub-card p-5 border-l-4 border-l-accent">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg font-bold text-white">Custom Build #{index + 1}</h4>
                    <span className="text-xs text-neutral-500">{new Date(build.createdAt).toLocaleDateString()}</span>
                  </div>
                  <ul className="text-sm space-y-1 text-neutral-300">
                    <li><span className="font-bold text-neutral-500 w-12 inline-block">CPU:</span> {build.cpu}</li>
                    <li><span className="font-bold text-neutral-500 w-12 inline-block">GPU:</span> {build.gpu}</li>
                    <li><span className="font-bold text-neutral-500 w-12 inline-block">MOBO:</span> {build.motherboard}</li>
                    <li><span className="font-bold text-neutral-500 w-12 inline-block">RAM:</span> {build.ram}</li>
                    <li><span className="font-bold text-neutral-500 w-12 inline-block">PSU:</span> {build.psu}</li>
                    <li><span className="font-bold text-neutral-500 w-12 inline-block">SSD:</span> {build.ssd}</li>
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="ub-card p-8 text-center border border-dashed border-neutral-700 bg-primary-dark/50">
              <p className="text-neutral-400 mb-4">You don't have any saved builds yet.</p>
              <Link to="/build-pc" className="text-accent hover:underline font-bold">Go build a PC &rarr;</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;