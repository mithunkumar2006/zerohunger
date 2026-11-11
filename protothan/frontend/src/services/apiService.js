import api from './api';

export const authService = {
  login: async (role, email, password) => {
    const { data } = await api.post(`/auth/login/${role}`, { email, password });
    return data; // returns { message, token, user }
  },

  register: async (role, userData) => {
    const { data } = await api.post(`/auth/register/${role}`, userData);
    return data; // returns { message, token, user }
  },

  logout: async () => {
    const { data } = await api.post('/auth/logout');
    return data;
  },

  getProfile: async () => {
    const { data } = await api.get('/auth/profile');
    return data;
  },

  updateProfile: async (profileData) => {
    const { data } = await api.put('/auth/profile', profileData);
    return data;
  }
};

export const donationService = {
  create: async (donationData) => {
    const { data } = await api.post('/donations', donationData);
    return data;
  },

  getAll: async () => {
    const { data } = await api.get('/donations');
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/donations/${id}`);
    return data;
  },

  update: async (id, updateData) => {
    const { data } = await api.put(`/donations/${id}`, updateData);
    return data;
  },

  getNgoSuggestions: async (id) => {
    const { data } = await api.get(`/donations/${id}/suggestions`);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/donations/${id}`);
    return data;
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data.url;
  },

  matchNGOs: async (matchingCriteria) => {
    const { data } = await api.post('/donations/match', matchingCriteria);
    return data;
  },

  assignVolunteer: async (id, payload) => {
    const { data } = await api.post(`/donations/${id}/assign-volunteer`, payload);
    return data;
  },

  triggerAi: async (id) => {
    const { data } = await api.post(`/donations/${id}/trigger-ai`);
    return data;
  }
};

export const deliveryService = {
  getAll: async () => {
    const { data } = await api.get('/deliveries');
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/deliveries/${id}`);
    return data;
  },

  assign: async (id, volunteerId) => {
    const { data } = await api.post(`/deliveries/${id}/assign`, { volunteerId });
    return data;
  },

  updateStatus: async (id, status) => {
    const { data } = await api.patch(`/deliveries/${id}/status`, { status });
    return data;
  },

  updateTelemetry: async (id, payload) => {
    const { data } = await api.patch(`/deliveries/${id}/telemetry`, payload);
    return data;
  }
};

export const userService = {
  getAll: async (role) => {
    const params = role ? { role } : {};
    const { data } = await api.get('/users', { params });
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  update: async (id, userData) => {
    const { data } = await api.put(`/users/${id}`, userData);
    return data;
  },

  suspend: async (id, isSuspended) => {
    const { data } = await api.patch(`/users/${id}/suspend`, { isSuspended });
    return data;
  },

  approve: async (id) => {
    const { data } = await api.patch(`/users/${id}/approve`);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },

  getPendingApprovals: async () => {
    const { data } = await api.get('/users/pending-approvals');
    return data;
  }
};

export const analyticsService = {
  getOverview: async () => {
    const { data } = await api.get('/analytics');
    return data;
  },

  getRestaurants: async () => {
    const { data } = await api.get('/analytics/restaurants');
    return data;
  },

  getNGOs: async () => {
    const { data } = await api.get('/analytics/ngos');
    return data;
  },

  getVolunteers: async () => {
    const { data } = await api.get('/analytics/volunteers');
    return data;
  }
};
