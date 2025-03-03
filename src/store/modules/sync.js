import syncService from '@/services/syncService';

export default {
  namespaced: true,
  
  state: {
    syncStatus: {
      status: 'inactive',
      lastSyncTime: null,
      itemsProcessed: 0,
      averageDuration: 0
    },
    pendingUpdates: 0,
    syncActivity: [],
    warehouses: [],
    syncHistory: []
  },
  
  mutations: {
    SET_SYNC_STATUS(state, status) {
      state.syncStatus = status;
    },
    SET_PENDING_UPDATES(state, count) {
      state.pendingUpdates = count;
    },
    SET_SYNC_ACTIVITY(state, activity) {
      state.syncActivity = activity;
    },
    SET_WAREHOUSES(state, warehouses) {
      state.warehouses = warehouses;
    },
    SET_SYNC_HISTORY(state, history) {
      state.syncHistory = history;
    },
    UPDATE_WAREHOUSE_STATUS(state, { id, status, lastSync }) {
      const warehouse = state.warehouses.find(w => w.id === id);
      if (warehouse) {
        warehouse.status = status;
        if (lastSync) warehouse.lastSync = lastSync;
      }
    },
    ADD_SYNC_HISTORY_ENTRY(state, entry) {
      state.syncHistory.unshift(entry);
    },
    INCREMENT_ITEMS_PROCESSED(state, count) {
      state.syncStatus.itemsProcessed += count;
    }
  },
  
  actions: {
    async fetchSyncStatus({ commit }) {
      try {
        const response = await syncService.getSyncStatus();
        commit('SET_SYNC_STATUS', response.data);
        commit('SET_PENDING_UPDATES', response.data.pendingUpdates || 0);
        return response.data;
      } catch (error) {
        console.error('Error fetching sync status:', error);
        throw error;
      }
    },
    
    async fetchSyncActivity({ commit }) {
      try {
        const response = await syncService.getSyncActivity();
        commit('SET_SYNC_ACTIVITY', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching sync activity:', error);
        throw error;
      }
    },
    
    async fetchWarehouses({ commit }) {
      try {
        const response = await syncService.getWarehouses();
        commit('SET_WAREHOUSES', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching warehouses:', error);
        throw error;
      }
    },
    
    async fetchSyncHistory({ commit }) {
      try {
        const response = await syncService.getSyncHistory();
        commit('SET_SYNC_HISTORY', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching sync history:', error);
        throw error;
      }
    },
    
    async syncWarehouse({ commit }, warehouseId) {
      try {
        // Update UI immediately to show syncing state
        commit('UPDATE_WAREHOUSE_STATUS', {
          id: warehouseId,
          status: 'Syncing...'
        });
        
        // Call API to perform sync
        const response = await syncService.syncWarehouse(warehouseId);
        
        // Update with results
        const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
        
        commit('UPDATE_WAREHOUSE_STATUS', {
          id: warehouseId,
          status: 'Synced',
          lastSync: currentTime
        });
        
        // Add history entry if the response includes details
        if (response.data.itemCount) {
          commit('INCREMENT_ITEMS_PROCESSED', response.data.itemCount);
          
          commit('ADD_SYNC_HISTORY_ENTRY', {
            timestamp: currentTime,
            type: 'Manual',
            warehouse: response.data.warehouseName,
            items: response.data.itemCount,
            duration: response.data.duration,
            status: 'Success'
          });
        }
        
        return response.data;
      } catch (error) {
        console.error(`Error syncing warehouse ${warehouseId}:`, error);
        
        // Update UI to show error state
        commit('UPDATE_WAREHOUSE_STATUS', {
          id: warehouseId,
          status: 'Error'
        });
        
        // Add error entry to history
        const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
        commit('ADD_SYNC_HISTORY_ENTRY', {
          timestamp: currentTime,
          type: 'Manual',
          warehouse: error.response?.data?.warehouseName || 'Unknown',
          items: 0,
          duration: 0,
          status: 'Failed'
        });
        
        throw error;
      }
    },
    
    async syncAllWarehouses({ commit, state }) {
      try {
        // Update UI immediately for all warehouses
        state.warehouses.forEach(warehouse => {
          commit('UPDATE_WAREHOUSE_STATUS', {
            id: warehouse.id,
            status: 'Syncing...'
          });
        });
        
        // Call API to sync all warehouses
        const response = await syncService.syncAllWarehouses();
        
        // Update with results
        const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
        
        // Update individual warehouses
        state.warehouses.forEach(warehouse => {
          commit('UPDATE_WAREHOUSE_STATUS', {
            id: warehouse.id,
            status: 'Synced',
            lastSync: currentTime
          });
        });
        
        // Add history entry
        if (response.data.totalItems) {
          commit('INCREMENT_ITEMS_PROCESSED', response.data.totalItems);
          
          commit('ADD_SYNC_HISTORY_ENTRY', {
            timestamp: currentTime,
            type: 'Manual',
            warehouse: 'All Warehouses',
            items: response.data.totalItems,
            duration: response.data.duration,
            status: 'Success'
          });
        }
        
        return response.data;
      } catch (error) {
        console.error('Error syncing all warehouses:', error);
        
        // Set failed warehouses to error state
        if (error.response?.data?.failedWarehouses) {
          error.response.data.failedWarehouses.forEach(id => {
            commit('UPDATE_WAREHOUSE_STATUS', {
              id,
              status: 'Error'
            });
          });
          
          // Set successful warehouses to synced state
          if (error.response.data.successWarehouses) {
            error.response.data.successWarehouses.forEach(id => {
              commit('UPDATE_WAREHOUSE_STATUS', {
                id,
                status: 'Synced',
                lastSync: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})
              });
            });
          }
        } else {
          // If we don't have detailed error info, set all to error
          state.warehouses.forEach(warehouse => {
            commit('UPDATE_WAREHOUSE_STATUS', {
              id: warehouse.id,
              status: 'Error'
            });
          });
        }
        
        // Add error entry to history
        const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
        commit('ADD_SYNC_HISTORY_ENTRY', {
          timestamp: currentTime,
          type: 'Manual',
          warehouse: 'All Warehouses',
          items: error.response?.data?.partialItemCount || 0,
          duration: error.response?.data?.duration || 0,
          status: 'Failed'
        });
        
        throw error;
      }
    }
  },
  
  getters: {
    isActive: state => state.syncStatus.status === 'active',
    formattedLastSync: state => {
      if (!state.syncStatus.lastSyncTime) return 'Never';
      
      // Format the timestamp based on how long ago it was
      const lastSync = new Date(state.syncStatus.lastSyncTime);
      const now = new Date();
      const diffInMinutes = Math.floor((now - lastSync) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
      
      return lastSync.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    },
    syncedWarehouses: state => state.warehouses.filter(w => w.status === 'Synced'),
    errorWarehouses: state => state.warehouses.filter(w => w.status === 'Error'),
    pendingWarehouses: state => state.warehouses.filter(w => w.status === 'Pending' || w.status === 'Syncing...')
  }
};