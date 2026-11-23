// Secure API service
// NOTE: Login validation is strictly delegated to the backend API with bcrypt.compare.
// No '==' password matching in frontend. Tokens are stored securely and sent in Authorization header.

const API_BASE = '/api';

function getAuthHeader(tokenOverride) {
  const token = tokenOverride || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Authenticate user via backend bcrypt hash verification
  login: async (identifier, password, role) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password, role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  // Register user (backend hashes password with bcrypt)
  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  // Get current user profile
  getMe: async (token) => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeader(token)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch user');
    return data.user;
  },

  // Student broadcasts help request (Zomato-style request)
  broadcastDoubt: async (doubtData, token) => {
    const res = await fetch(`${API_BASE}/requests/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(token)
      },
      body: JSON.stringify(doubtData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to broadcast doubt');
    return data.request;
  },

  // Get active help request for current user
  getActiveRequest: async (token) => {
    const res = await fetch(`${API_BASE}/requests/active`, {
      headers: getAuthHeader(token)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to get active request');
    return data.request;
  },

  // Peer tutor accepts help request
  acceptRequest: async (requestId, token) => {
    const res = await fetch(`${API_BASE}/requests/${requestId}/accept`, {
      method: 'POST',
      headers: getAuthHeader(token)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to accept request');
    return data.request;
  },

  // Peer tutor declines help request
  declineRequest: async (requestId, token) => {
    const res = await fetch(`${API_BASE}/requests/${requestId}/decline`, {
      method: 'POST',
      headers: getAuthHeader(token)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to decline request');
    return data.request;
  },

  // Send chat message
  sendMessage: async (requestId, messageData, token) => {
    const res = await fetch(`${API_BASE}/requests/${requestId}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(token)
      },
      body: JSON.stringify(messageData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to send message');
    return data.message;
  },

  // Mark session complete
  completeSession: async (requestId, token) => {
    const res = await fetch(`${API_BASE}/requests/${requestId}/complete`, {
      method: 'POST',
      headers: getAuthHeader(token)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to complete session');
    return data.request;
  },

  // Student rates session (Happy student, happy peer -> peer ranking increases)
  submitRating: async (requestId, ratingData, token) => {
    const res = await fetch(`${API_BASE}/requests/${requestId}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(token)
      },
      body: JSON.stringify(ratingData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit rating');
    return data;
  },

  // Get tutor leaderboard
  getLeaderboard: async () => {
    const res = await fetch(`${API_BASE}/leaderboard`);
    const data = await res.json();
    return data.leaderboard;
  }
};
