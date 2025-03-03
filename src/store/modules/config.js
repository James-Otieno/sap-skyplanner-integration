import configService from '@/services/configService';

export default {
  namespaced: true,
  
  state: {
    config: {
      sync: {
        interval: 30,
        batchSize: 100,
        syncRawMaterials: true,
        syncFinishedGoods: true,
        syncPackagingMaterials: false
      },
      errorHandling: {
        maxRetries: 5,
        initialRetryDelay: 5,
        retryStrategy: 'exponential'
      },
      sap: {
        server: '',
        database: '',
        username: '',
        password: ''
      },
      skyplanner: {
        apiEndpoint: '',
        apiKey: '',
        timeout: 30
      },
      notifications: {
        errorRecipients: '',
        emailEnabled: true,
        systemEnabled: true,
        errorThreshold: 'error'
      }
    },
    originalConfig: null,
    loading: false,
    saving: false,
    error: null,
    saveSuccess: false
  },
  
  mutations: {
    SET_CONFIG(state, config) {
      state.config = config;
      state.originalConfig = JSON.parse(JSON.stringify(config));
    },
    UPDATE_CONFIG(state, partialConfig) {
      // Deep merge the partial config with the current config
      const mergeDeep = (target, source) => {
        for (const key in source) {
          if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!target[key]) Object.assign(target, { [key]: {} });
            mergeDeep(target[key], source[key]);
          } else {
            Object.assign(target, { [key]: source[key] });
          }
        }
      };
      
      mergeDeep(state.config, partialConfig);
    },
    RESET_CONFIG(state) {
      state.config = JSON.parse(JSON.stringify(state.originalConfig));
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_SAVING(state, saving) {
      state.saving = saving;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_SAVE_SUCCESS(state, success) {
      state.saveSuccess = success;
    }
  },
  
  actions: {
    async fetchConfig({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await configService.getConfig();
        
        commit('SET_CONFIG', response.data);
        
        return response.data;
      } catch (error) {
        console.error('Error fetching configuration:', error);
        commit('SET_ERROR', error.response?.data?.message || 'Failed to load configuration');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async saveConfig({ commit, state }) {
      try {
        commit('SET_SAVING', true);
        commit('SET_ERROR', null);
        commit('SET_SAVE_SUCCESS', false);
        
        const response = await configService.updateConfig(state.config);
        
        // Update the original config to match the saved state
        commit('SET_CONFIG', response.data || state.config);
        commit('SET_SAVE_SUCCESS', true);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          commit('SET_SAVE_SUCCESS', false);
        }, 3000);
        
        return response.data;
      } catch (error) {
        console.error('Error saving configuration:', error);
        commit('SET_ERROR', error.response?.data?.message || 'Failed to save configuration');
        throw error;
      } finally {
        commit('SET_SAVING', false);
      }
    },
    
    resetConfig({ commit }) {
      commit('RESET_CONFIG');
    },
    
    updateConfig({ commit }, partialConfig) {
      commit('UPDATE_CONFIG', partialConfig);
    }
  },
  
  getters: {
    hasChanges: state => {
      return JSON.stringify(state.config) !== JSON.stringify(state.originalConfig);
    },
    syncInterval: state => state.config.sync.interval,
    sapConnectionConfigured: state => {
      const { server, database, username, password } = state.config.sap;
      return server && database && username && password;
    },
    skyplannerConfigured: state => {
      const { apiEndpoint, apiKey } = state.config.skyplanner;
      return apiEndpoint && apiKey;
    }
  }
};