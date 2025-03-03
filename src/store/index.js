import { createStore } from 'vuex';
import syncModule from './modules/sync';
import errorsModule from './modules/errors';
import authModule from './modules/auth';
import configModule from './modules/config';
import auditModule from './modules/audit';

export default createStore({
  modules: {
    sync: syncModule,
    errors: errorsModule,
    auth: authModule,
    config: configModule,
    audit: auditModule
  },
  // Global state
  state: {
    appVersion: process.env.VUE_APP_VERSION || '1.0.0',
    isLoading: false
  },
  // Global mutations
  mutations: {
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    }
  },
  // Global actions
  actions: {
    setLoading({ commit }, isLoading) {
      commit('SET_LOADING', isLoading);
    }
  },
  // Global getters
  getters: {
    appVersion: state => state.appVersion,
    isLoading: state => state.isLoading
  }
});