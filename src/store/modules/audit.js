export default {
    namespaced: true,
    
    state: {
      auditLogs: [],
      filters: {
        eventType: '',
        dateRange: 'week',
        userId: '',
        startDate: null,
        endDate: null
      },
      pagination: {
        currentPage: 1,
        perPage: 10,
        total: 0,
        totalPages: 0
      },
      loading: false
    },
    
    mutations: {
      SET_AUDIT_LOGS(state, logs) {
        state.auditLogs = logs;
      },
      SET_FILTERS(state, filters) {
        state.filters = { ...state.filters, ...filters };
      },
      SET_PAGINATION(state, pagination) {
        state.pagination = { ...state.pagination, ...pagination };
      },
      SET_LOADING(state, loading) {
        state.loading = loading;
      }
    },
    
    actions: {
      fetchAuditLogs({ commit }) {
        commit('SET_LOADING', true);
        
        // Mock data - replace with API call in production
        const mockLogs = [
          {
            id: 1,
            timestamp: '2025-03-03 14:02:15',
            eventType: 'Sync',
            description: 'Inventory sync completed successfully',
            userName: 'System',
            details: { 
              items_processed: 1245,
              duration_ms: 3245,
              warehouses: ['Main', 'Raw Materials']
            }
          },
          {
            id: 2,
            timestamp: '2025-03-03 13:45:30',
            eventType: 'Error',
            description: 'API Connection error during sync',
            userName: 'System',
            details: { 
              error_code: 'API-001',
              message: 'Skyplanner API timeout (30s)',
              attempt: 1
            }
          },
          {
            id: 3,
            timestamp: '2025-03-03 13:30:12',
            eventType: 'Config',
            description: 'Sync interval configuration updated',
            userName: 'Admin User',
            beforeState: { sync_interval: 60 },
            afterState: { sync_interval: 30 }
          }
        ];
        
        setTimeout(() => {
          commit('SET_AUDIT_LOGS', mockLogs);
          commit('SET_PAGINATION', {
            total: mockLogs.length,
            totalPages: 1
          });
          commit('SET_LOADING', false);
        }, 500);
      },
      
      exportAuditLog() {
        // Mock function - replace with actual export in production
        console.log('Exporting audit log (mock)');
        return Promise.resolve({ success: true });
      }
    }
  };