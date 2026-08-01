import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * UniSwap Auth Service
 *
 * Uses a custom 'users' table in Supabase:
 *   - username   (text, unique)
 *   - password   (text)
 *   - full_name  (text)  ← store user's display name
 *
 * Operations:
 *   signUp()         → INSERT new user with full_name
 *   login()          → SELECT WHERE username + password, returns full_name
 *   forgotPassword() → SELECT to verify username exists
 *   updatePassword() → UPDATE password for username
 *   logout()         → clear local session
 *   getCurrentUser() → read session from localStorage
 *   saveSession()    → persist session to localStorage
 *   guestLogin()     → instant demo access without credentials
 */

// LocalStorage key for persisting the logged-in user session
const SESSION_USER_KEY = 'uniswap_auth_user';

// Local name map: { [username]: full_name } — fallback if DB column not yet added
const NAME_MAP_KEY = 'uniswap_name_map';

const saveNameLocally = (username, fullName) => {
  try {
    const map = JSON.parse(localStorage.getItem(NAME_MAP_KEY) || '{}');
    map[username] = fullName;
    localStorage.setItem(NAME_MAP_KEY, JSON.stringify(map));
  } catch {}
};

const getNameLocally = (username) => {
  try {
    const map = JSON.parse(localStorage.getItem(NAME_MAP_KEY) || '{}');
    return map[username] || null;
  } catch { return null; }
};

export const authService = {

  /**
   * Register a new user.
   * Supabase: INSERT INTO users (username, password)
   */
  async signUp(username, password, fullName = '') {
    // Always save full_name locally by username (works even without DB column)
    if (fullName.trim()) saveNameLocally(username, fullName.trim());

    if (!isSupabaseConfigured()) {
      const mockUser = {
        id: 'demo-' + Date.now(),
        username,
        full_name: fullName.trim() || username,
        created_at: new Date().toISOString()
      };
      localStorage.setItem(SESSION_USER_KEY, JSON.stringify(mockUser));
      return { data: mockUser, error: null };
    }

    try {
      // Try inserting with full_name (works if DB column exists)
      const insertPayload = { username, password };
      if (fullName.trim()) insertPayload.full_name = fullName.trim();

      const { data, error } = await supabase
        .from('users')
        .insert([insertPayload])
        .select();

      if (error) throw error;

      return {
        data: {
          id: data[0]?.id,
          username,
          full_name: data[0]?.full_name || fullName.trim() || username,
          created_at: data[0]?.created_at
        },
        error: null
      };
    } catch (err) {
      if (err.code === '23505') {
        return { data: null, error: 'Username already taken. Please choose a different one.' };
      }
      return { data: null, error: err.message || 'Failed to create account.' };
    }
  },

  /**
   * Log in with username and password.
   * Supabase: SELECT * FROM users WHERE username = ? AND password = ?
   */
  async login(username, password) {
    if (!isSupabaseConfigured()) {
      const demoUser = {
        id: 'demo-' + Date.now(),
        username,
        full_name: getNameLocally(username) || username,
        created_at: new Date().toISOString()
      };
      localStorage.setItem(SESSION_USER_KEY, JSON.stringify(demoUser));
      return { data: demoUser, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password);

      if (error) throw error;

      if (!data || data.length === 0) {
        return { data: null, error: 'Invalid username or password.' };
      }

      const user = data[0];
      // full_name from DB column (if exists) → local name map → fallback to username
      const fullName = user.full_name || getNameLocally(username) || username;

      return {
        data: {
          id: user.id,
          username: user.username,
          full_name: fullName,
          created_at: user.created_at
        },
        error: null
      };
    } catch (err) {
      return { data: null, error: err.message || 'Login failed. Please try again.' };
    }
  },

  /**
   * Step 1 of password reset: verify the username exists.
   * Supabase: SELECT username FROM users WHERE username = ?
   */
  async forgotPassword(username) {
    if (!isSupabaseConfigured()) {
      return { data: { exists: true }, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('username', username);

      if (error) throw error;

      if (!data || data.length === 0) {
        return { data: null, error: 'Username not found.' };
      }

      return { data: { exists: true }, error: null };
    } catch (err) {
      return { data: null, error: err.message || 'Error verifying username.' };
    }
  },

  /**
   * Step 2 of password reset: update password for a given username.
   * Supabase: UPDATE users SET password = ? WHERE username = ?
   */
  async updatePassword(username, newPassword) {
    if (!isSupabaseConfigured()) {
      return { data: { updated: true }, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .update({ password: newPassword })
        .eq('username', username);

      if (error) throw error;

      return { data: { updated: true }, error: null };
    } catch (err) {
      return { data: null, error: err.message || 'Failed to update password.' };
    }
  },

  /**
   * Log out — clears local session.
   */
  async logout() {
    localStorage.removeItem(SESSION_USER_KEY);
    return { error: null };
  },

  /**
   * Get current logged-in user from localStorage session.
   */
  async getCurrentUser() {
    const stored = localStorage.getItem(SESSION_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  /**
   * Save authenticated user to localStorage session.
   */
  saveSession(user) {
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
  },

  /**
   * Guest login — instant campus browse access without credentials.
   */
  async guestLogin() {
    const guestUser = {
      id: 'guest-' + Math.floor(1000 + Math.random() * 9000),
      username: 'Guest Explorer',
      full_name: 'Guest Explorer',
      created_at: new Date().toISOString(),
      role: 'guest'
    };
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(guestUser));
    return { data: guestUser, error: null };
  }
};
