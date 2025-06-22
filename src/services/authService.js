const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const AUTH_TOKEN_KEY = 'auth_token';

export const signIn = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    return data.user;
  } catch (error) {
    console.error('Sign in error:', error);

    // For demo purposes only - remove in production
    if (email === 'demo@example.com' && password === 'password123') {
      const fakeToken = 'fake-jwt-token-' + Math.random().toString(36).substring(2);
      localStorage.setItem(AUTH_TOKEN_KEY, fakeToken);
      return {
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        avatarUrl: '/assets/avatars/default.png'
      };
    }

    throw error;
  }
};

export const signUp = async (name, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json();
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    return data.user;
  } catch (error) {
    console.error('Sign up error:', error);

    // Demo fallback
    const fakeToken = 'fake-jwt-token-' + Math.random().toString(36).substring(2);
    localStorage.setItem(AUTH_TOKEN_KEY, fakeToken);
    return {
      id: Math.random().toString(36).substring(2),
      name,
      email,
      avatarUrl: '/assets/avatars/default.png'
    };
  }
};

export const signOut = async () => {
  try {
    await fetch(`${API_BASE_URL}/auth/signout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
      },
    });
  } catch (error) {
    console.error('Sign out error:', error);
  } finally {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

export const checkAuthStatus = async () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Authentication check failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Auth check error:', error);

    // For demo - return fake user if token exists
    if (token && token.startsWith('fake-jwt-token-')) {
      return {
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        avatarUrl: '/assets/avatars/default.png'
      };
    }

    localStorage.removeItem(AUTH_TOKEN_KEY);
    return null;
  }
};
