import api from '@/services/api';

export default {
  namespaced: true,
  
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  },
  
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
      // Also store in localStorage for persistence
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },
  
  actions: {
    async login({ commit }, credentials) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await api.post('/auth/login', credentials);
        
        const { token, user } = response.data;
        
        commit('SET_TOKEN', token);
        commit('SET_USER', user);
        
        return user;
      } catch (error) {
        console.error('Login error:', error);
        commit('SET_ERROR', error.response?.data?.message || 'Login failed');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async logout({ commit }) {
      try {
        await api.post('/auth/logout');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Clear user data regardless of API response
        commit('SET_TOKEN', null);
        commit('SET_USER', null);
      }
    },
    
    async fetchUserProfile({ commit, state }) {
      // Only fetch if we have a token
      if (!state.token) return null;
      
      try {
        commit('SET_LOADING', true);
        
        const response = await api.get('/auth/profile');
        
        commit('SET_USER', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        
        // If unauthorized, clear the token
        if (error.response && error.response.status === 401) {
          commit('SET_TOKEN', null);
          commit('SET_USER', null);
        }
        
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },
  
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    isAdmin: state => state.user && state.user.role === 'admin'
  }
};