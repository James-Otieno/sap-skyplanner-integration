import errorService from '@/services/errorService';

export default {
  namespaced: true,
  
  state: {
    errors: [],
    loading: false,
    filters: {
      type: '',
      status: '',
      dateRange: 'today'
    },
    pagination: {
      currentPage: 1,
      perPage: 10,
      total: 0,
      totalPages: 0
    }
  },
  
  mutations: {
    SET_ERRORS(state, errors) {
      state.errors = errors;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters };
    },
    SET_PAGINATION(state, pagination) {
      state.pagination = { ...state.pagination, ...pagination };
    },
    UPDATE_ERROR_STATUS(state, { id, status }) {
      const error = state.errors.find(e => e.id === id);
      if (error) {
        error.status = status;
      }
    },
    REMOVE_ERROR(state, id) {
      state.errors = state.errors.filter(e => e.id !== id);
      // Update pagination
      state.pagination.total--;
      state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.perPage);
    }
  },
  
  actions: {
    async fetchErrors({ commit, state }) {
      try {
        commit('SET_LOADING', true);
        
        const params = {
          ...state.filters,
          page: state.pagination.currentPage,
          perPage: state.pagination.perPage
        };
        
        const response = await errorService.getErrors(params);
        
        commit('SET_ERRORS', response.data.errors);
        commit('SET_PAGINATION', {
          total: response.data.total,
          totalPages: response.data.totalPages
        });
        
        return response.data;
      } catch (error) {
        console.error('Error fetching errors:', error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async retryError({ commit }, errorId) {
      try {
        commit('UPDATE_ERROR_STATUS', {
          id: errorId,
          status: 'Retrying...'
        });
        
        const response = await errorService.retryError(errorId);
        
        if (response.data.success) {
          commit('UPDATE_ERROR_STATUS', {
            id: errorId,
            status: response.data.newStatus || 'Retrying'
          });
        } else {
          commit('UPDATE_ERROR_STATUS', {
            id: errorId,
            status: 'Retry Failed'
          });
        }
        
        return response.data;
      } catch (error) {
        console.error(`Error retrying error ${errorId}:`, error);
        
        commit('UPDATE_ERROR_STATUS', {
          id: errorId,
          status: 'Retry Failed'
        });
        
        throw error;
      }
    },
    
    async retryAllErrors({ commit, dispatch, state }) {
      try {
        // Update all errors to retrying status
        state.errors.forEach(error => {
          if (error.status !== 'Resolved') {
            commit('UPDATE_ERROR_STATUS', {
              id: error.id,
              status: 'Retrying...'
            });
          }
        });
        
        const response = await errorService.retryAllErrors();
        
        // Refresh the error list to get updated statuses
        await dispatch('fetchErrors');
        
        return response.data;
      } catch (error) {
        console.error('Error retrying all errors:', error);
        
        // Set all to retry failed
        state.errors.forEach(err => {
          if (err.status === 'Retrying...') {
            commit('UPDATE_ERROR_STATUS', {
              id: err.id,
              status: 'Retry Failed'
            });
          }
        });
        
        throw error;
      }
    },
    
    async resolveError({ commit }, errorId) {
      try {
        commit('UPDATE_ERROR_STATUS', {
          id: errorId,
          status: 'Resolving...'
        });
        
        const response = await errorService.resolveError(errorId);
        
        if (response.data.success) {
          commit('UPDATE_ERROR_STATUS', {
            id: errorId,
            status: 'Resolved'
          });
        } else {
          commit('UPDATE_ERROR_STATUS', {
            id: errorId,
            status: 'Resolution Failed'
          });
        }
        
        return response.data;
      } catch (error) {
        console.error(`Error resolving error ${errorId}:`, error);
        
        commit('UPDATE_ERROR_STATUS', {
          id: errorId,
          status: 'Resolution Failed'
        });
        
        throw error;
      }
    },
    
    async clearResolvedErrors({/* commit, */ dispatch }) {
      try {
        const response = await errorService.clearResolvedErrors();
        
        // Refresh the error list
        await dispatch('fetchErrors');
        
        return response.data;
      } catch (error) {
        console.error('Error clearing resolved errors:', error);
        throw error;
      }
    },
    
    setFilters({ commit, dispatch }, filters) {
      commit('SET_FILTERS', filters);
      // Reset to first page when filters change
      commit('SET_PAGINATION', { currentPage: 1 });
      // Fetch errors with new filters
      return dispatch('fetchErrors');
    },
    
    goToPage({ commit, dispatch }, page) {
      commit('SET_PAGINATION', { currentPage: page });
      return dispatch('fetchErrors');
    }
  },
  
  getters: {
    hasErrors: state => state.errors.length > 0,
    activeErrors: state => state.errors.filter(err => err.status !== 'Resolved'),
    resolvedErrors: state => state.errors.filter(err => err.status === 'Resolved'),
    errorCount: state => state.errors.length,
    activeErrorCount: (state, getters) => getters.activeErrors.length
  }
};