import React from 'react';

const AdminDashboard = () => (
  <div className="pt-20 max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">Admin Dashboard</h1>
    <div className="grid md:grid-cols-3 gap-8 mb-8">
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        <p className="text-gray-600">Manage all registered users.</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Photographers</h2>
        <p className="text-gray-600">View and verify photographers.</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Bookings</h2>
        <p className="text-gray-600">Monitor all bookings and activity.</p>
      </div>
    </div>
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
      <p className="text-purple-700 font-semibold">Add more admin features here as needed!</p>
    </div>
  </div>
);

export default AdminDashboard; 