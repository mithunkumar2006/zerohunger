import React, { useState } from 'react';
import { FiUpload, FiMapPin } from 'react-icons/fi';

export function DonationForm() {
  const [formData, setFormData] = useState({
    foodName: '',
    category: 'Cooked Food',
    quantity: '',
    prepTime: '',
    expiryTime: '',
    storageType: 'Room Temperature',
    location: '',
    image: null,
  });

  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, image: file }));
  };

  const analyzeFood = async () => {
    setLoading(true);
    // Simulate AI analysis (Gemini/OpenAI integration would go here)
    setTimeout(() => {
      setAiAnalysis({
        freshness: 92,
        risk: 'Low',
        safeUntil: '2 hours',
        trustScore: 95,
      });
      setLoading(false);
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submit logic here
    console.log('Donation submitted:', formData);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Donate Food</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Food Name</label>
            <input
              type="text"
              name="foodName"
              value={formData.foodName}
              onChange={handleChange}
              placeholder="e.g., Vegetable Curry"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option>Cooked Food</option>
              <option>Raw Vegetables</option>
              <option>Fruits</option>
              <option>Baked Goods</option>
              <option>Dairy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <input
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="e.g., 24 portions"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Storage Type</label>
            <select
              name="storageType"
              value={formData.storageType}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option>Room Temperature</option>
              <option>Refrigerated</option>
              <option>Frozen</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Preparation Time</label>
            <input
              type="time"
              name="prepTime"
              value={formData.prepTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Expiry Time</label>
            <input
              type="time"
              name="expiryTime"
              value={formData.expiryTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <FiMapPin size={18} />
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter pickup location"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-green-500 transition">
          <label className="cursor-pointer flex flex-col items-center gap-2">
            <FiUpload size={32} className="text-gray-400" />
            <span className="text-sm text-gray-600">Upload food image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          {formData.image && <p className="text-sm text-green-600 mt-2">Image selected: {formData.image.name}</p>}
        </div>

        <button
          type="button"
          onClick={analyzeFood}
          disabled={loading || !formData.image}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Food with AI'}
        </button>

        {aiAnalysis && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-green-50 rounded-lg">
            <div>
              <p className="text-xs text-gray-600">Freshness</p>
              <p className="text-2xl font-bold text-green-600">{aiAnalysis.freshness}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Risk Level</p>
              <p className="text-2xl font-bold text-yellow-600">{aiAnalysis.risk}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Safe Until</p>
              <p className="text-2xl font-bold text-blue-600">{aiAnalysis.safeUntil}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Trust Score</p>
              <p className="text-2xl font-bold text-purple-600">{aiAnalysis.trustScore}%</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:scale-105 transition font-medium"
        >
          Submit Donation
        </button>
      </form>
    </div>
  );
}

export function AuthPage() {
  const [tab, setTab] = useState('login');
  const [role, setRole] = useState('restaurant');
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Auth logic
    console.log('Auth:', { tab, role, ...credentials });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Food Rescue Network</h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2 rounded-lg font-medium transition ${tab === 'login' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
          >
            Login
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-2 rounded-lg font-medium transition ${tab === 'signup' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
          >
            Signup
          </button>
        </div>

        {tab === 'signup' && (
          <div className="grid grid-cols-2 gap-2 mb-6">
            {[
              { value: 'restaurant', label: 'Restaurant' },
              { value: 'household', label: 'Household' },
              { value: 'ngo', label: 'NGO' },
              { value: 'volunteer', label: 'Volunteer' },
            ].map(r => (
              <button
                key={r.value}
                onClick={() => setRole(r.value)}
                className={`py-2 rounded-lg text-xs font-medium transition ${role === r.value ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:scale-105 transition font-medium"
          >
            {tab === 'login' ? 'Login' : `Signup as ${role}`}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {tab === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={() => setTab(tab === 'login' ? 'signup' : 'login')} className="text-green-600 hover:underline">
            {tab === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
