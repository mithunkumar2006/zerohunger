import React from 'react';

export function RestaurantDashboard() {
  const monthlyData = [
    { month: 'Jan', donations: 12, meals: 240 },
    { month: 'Feb', donations: 19, meals: 380 },
    { month: 'Mar', donations: 24, meals: 480 },
    { month: 'Apr', donations: 31, meals: 620 },
    { month: 'May', donations: 38, meals: 760 },
    { month: 'Jun', donations: 42, meals: 840 },
    { month: 'Jul', donations: 49, meals: 980 },
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Restaurant Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white/60 backdrop-blur rounded-xl shadow-lg hover:scale-105 transition">
          <h3 className="text-gray-600 text-sm font-medium">Total Donations</h3>
          <p className="text-4xl font-bold mt-2">215</p>
          <p className="text-green-600 text-xs mt-1">↑ 12% this month</p>
        </div>
        
        <div className="p-6 bg-white/60 backdrop-blur rounded-xl shadow-lg hover:scale-105 transition">
          <h3 className="text-gray-600 text-sm font-medium">Meals Donated</h3>
          <p className="text-4xl font-bold mt-2">4,280</p>
          <p className="text-green-600 text-xs mt-1">↑ 8% this month</p>
        </div>
        
        <div className="p-6 bg-white/60 backdrop-blur rounded-xl shadow-lg hover:scale-105 transition">
          <h3 className="text-gray-600 text-sm font-medium">CO₂ Saved</h3>
          <p className="text-4xl font-bold mt-2">2.1 T</p>
          <p className="text-green-600 text-xs mt-1">Environmental impact</p>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Monthly Stats</h2>
        <div className="space-y-2">
          {monthlyData.map((m, i) => (
            <div key={i} className="flex justify-between p-3 bg-white/40 rounded">
              <span className="font-medium">{m.month}</span>
              <span>📦 {m.donations} donations</span>
              <span>🍽️ {m.meals} meals</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function NGODashboard() {
  const categoryData = [
    { name: 'Vegetables', value: 45 },
    { name: 'Cooked Food', value: 25 },
    { name: 'Fruits', value: 20 },
    { name: 'Other', value: 10 },
  ];
  const COLORS = ['#16A34A', '#22C55E', '#4ADE80', '#86EFAC'];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">NGO Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-white/60 backdrop-blur rounded-xl shadow-lg hover:scale-105 transition">
          <h3 className="text-gray-600 text-sm font-medium">Today's Requirement</h3>
          <p className="text-4xl font-bold mt-2">240 Meals</p>
          <p className="text-sm text-gray-600 mt-2">For 120 people</p>
        </div>
        
        <div className="p-6 bg-white/60 backdrop-blur rounded-xl shadow-lg hover:scale-105 transition">
          <h3 className="text-gray-600 text-sm font-medium">Available Donations</h3>
          <p className="text-4xl font-bold mt-2">156 Meals</p>
          <p className="text-red-600 text-sm mt-2">Need 84 more meals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/60 backdrop-blur rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Food Categories</h2>
          <div className="space-y-2">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-white/40 rounded">
                <span>{cat.name}</span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full" style={{width: cat.value + '%', backgroundColor: COLORS[i]}}></div>
                </div>
                <span className="font-bold">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
          <ul className="space-y-3">
            {[
              { donor: 'City Bistro', meals: 48, time: '2 hours' },
              { donor: 'Sunset Cafe', meals: 32, time: '4 hours' },
              { donor: 'Fresh Market', meals: 56, time: '1 hour' },
            ].map((req, i) => (
              <li key={i} className="flex justify-between items-center p-3 bg-white/40 rounded-lg">
                <div>
                  <div className="font-medium">{req.donor}</div>
                  <div className="text-xs text-gray-600">{req.meals} meals available</div>
                </div>
                <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">Accept</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function VolunteerDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Volunteer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white/60 backdrop-blur rounded-xl shadow-lg hover:scale-105 transition">
          <h3 className="text-gray-600 text-sm font-medium">Deliveries This Month</h3>
          <p className="text-4xl font-bold mt-2">24</p>
          <p className="text-green-600 text-xs mt-1">3 completed today</p>
        </div>
        
        <div className="p-6 bg-white/60 backdrop-blur rounded-xl shadow-lg hover:scale-105 transition">
          <h3 className="text-gray-600 text-sm font-medium">Reward Points</h3>
          <p className="text-4xl font-bold mt-2">480</p>
          <p className="text-blue-600 text-xs mt-1">Redeem for prizes</p>
        </div>
        
        <div className="p-6 bg-white/60 backdrop-blur rounded-xl shadow-lg hover:scale-105 transition">
          <h3 className="text-gray-600 text-sm font-medium">Current Rank</h3>
          <p className="text-4xl font-bold mt-2">#12</p>
          <p className="text-purple-600 text-xs mt-1">Leaderboard position</p>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Available Deliveries</h2>
        <ul className="space-y-3">
          {[
            { from: 'City Bistro', to: 'Hope Shelter', distance: '2.3 km', time: '8 min', points: 50 },
            { from: 'Sunset Cafe', to: 'Youth Center', distance: '1.8 km', time: '6 min', points: 40 },
            { from: 'Fresh Market', to: 'Community Kitchen', distance: '3.1 km', time: '12 min', points: 60 },
          ].map((delivery, i) => (
            <li key={i} className="flex justify-between items-center p-4 bg-white/40 rounded-lg">
              <div>
                <div className="font-medium">{delivery.from} → {delivery.to}</div>
                <div className="text-xs text-gray-600">{delivery.distance} • {delivery.time}</div>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Accept (+{delivery.points} pts)</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const monthlyData = [
    { month: 'Jan', donations: 120, meals: 2400 },
    { month: 'Feb', donations: 180, meals: 3600 },
    { month: 'Mar', donations: 220, meals: 4400 },
    { month: 'Apr', donations: 260, meals: 5200 },
    { month: 'May', donations: 310, meals: 6200 },
    { month: 'Jun', donations: 345, meals: 6900 },
    { month: 'Jul', donations: 390, meals: 7800 },
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-white/60 backdrop-blur rounded-xl shadow hover:scale-105 transition">
          <h3 className="text-gray-600 text-xs font-medium">Total Donations</h3>
          <p className="text-3xl font-bold mt-2">1,815</p>
        </div>
        <div className="p-4 bg-white/60 backdrop-blur rounded-xl shadow hover:scale-105 transition">
          <h3 className="text-gray-600 text-xs font-medium">Meals Saved</h3>
          <p className="text-3xl font-bold mt-2">36.3K</p>
        </div>
        <div className="p-4 bg-white/60 backdrop-blur rounded-xl shadow hover:scale-105 transition">
          <h3 className="text-gray-600 text-xs font-medium">Active Volunteers</h3>
          <p className="text-3xl font-bold mt-2">340</p>
        </div>
        <div className="p-4 bg-white/60 backdrop-blur rounded-xl shadow hover:scale-105 transition">
          <h3 className="text-gray-600 text-xs font-medium">NGOs</h3>
          <p className="text-3xl font-bold mt-2">45</p>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur rounded-xl p-6 shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Trends</h2>
        <div className="space-y-2">
          {monthlyData.map((m, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-white/40 rounded">
              <span className="font-medium">{m.month}</span>
              <div className="flex gap-2 flex-1 ml-4">
                <div className="h-6 bg-green-600 rounded" style={{width: m.donations / 10 + 'px'}}></div>
                <div className="h-6 bg-green-400 rounded" style={{width: m.meals / 100 + 'px'}}></div>
              </div>
              <span className="text-xs">{m.donations} | {m.meals}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/60 backdrop-blur rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Top Restaurants</h2>
          <ul className="space-y-2">
            {[
              { name: 'City Bistro', donations: 156 },
              { name: 'Sunset Cafe', donations: 142 },
              { name: 'Fresh Market', donations: 128 },
            ].map((r, i) => (
              <li key={i} className="flex justify-between p-2">
                <span>{r.name}</span>
                <span className="font-bold">{r.donations}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/60 backdrop-blur rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Top Volunteers</h2>
          <ul className="space-y-2">
            {[
              { name: 'Alex Johnson', points: 1240 },
              { name: 'Sarah Chen', points: 980 },
              { name: 'Mike Davis', points: 840 },
            ].map((v, i) => (
              <li key={i} className="flex justify-between p-2">
                <span>{v.name}</span>
                <span className="font-bold">{v.points} pts</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
