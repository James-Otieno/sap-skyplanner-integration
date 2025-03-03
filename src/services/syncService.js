//import api from './api';

export default {
  /**
   * Get sync status overview
   */
  getSyncStatus() {
    // For development, return mock data instead of calling API
    return Promise.resolve({
      data: {
        status: 'Active',
        lastSyncTime: new Date().toLocaleTimeString(),
        itemsProcessed: 1899,
        averageDuration: 350,
        pendingUpdates: 0
      }
    });
    // When you have a real API:
    // return api.get('/sync/status');
  },
  
  /**
   * Get sync activity history
   */
  getSyncActivity() {
    // Mock data
    return Promise.resolve({
      data: [
        { timestamp: Date.now() - 60000, duration: 325, items: 150 },
        { timestamp: Date.now() - 120000, duration: 310, items: 145 },
        { timestamp: Date.now() - 180000, duration: 330, items: 155 },
        { timestamp: Date.now() - 240000, duration: 315, items: 147 }
      ]
    });
  },
  
  /**
   * Manually trigger sync for a specific warehouse
   */
  syncWarehouse(warehouseId) {
    // Mock response
    return Promise.resolve({
      data: {
        success: true,
        warehouseId,
        warehouseName: `Warehouse ${warehouseId}`,
        itemCount: 120 + Math.floor(Math.random() * 100),
        duration: 300 + Math.floor(Math.random() * 100)
      }
    });
  },
  
  /**
   * Get list of warehouses with sync status
   */
  getWarehouses() {
    // Mock data
    return Promise.resolve({
      data: [
        {
          id: 1,
          name: 'Main Warehouse',
          lastSync: new Date().toLocaleTimeString(),
          itemCount: 1245,
          status: 'Synced'
        },
        {
          id: 2,
          name: 'Raw Materials',
          lastSync: new Date().toLocaleTimeString(),
          itemCount: 534,
          status: 'Synced'
        },
        {
          id: 3,
          name: 'Quality Control',
          lastSync: new Date(Date.now() - 60 * 60000).toLocaleTimeString(),
          itemCount: 120,
          status: 'Error'
        },
        {
          id: 4,
          name: 'Packaging',
          lastSync: new Date(Date.now() - 30 * 60000).toLocaleTimeString(),
          itemCount: 320,
          status: 'Synced'
        }
      ]
    });
  },
  
  /**
   * Sync all warehouses
   */
  syncAllWarehouses() {
    // Mock data
    return Promise.resolve({
      data: {
        success: true,
        totalItems: 2219,
        duration: 1250
      }
    });
  },
  
  /**
   * Get sync history
   */
  getSyncHistory() {
    // Mock data
    return Promise.resolve({
      data: [
        {
          timestamp: new Date().toLocaleTimeString(),
          type: 'Scheduled',
          warehouse: 'Main Warehouse',
          items: 1245,
          duration: 325,
          status: 'Success'
        },
        {
          timestamp: new Date(Date.now() - 5 * 60000).toLocaleTimeString(),
          type: 'Scheduled',
          warehouse: 'Raw Materials',
          items: 534,
          duration: 290,
          status: 'Success'
        },
        {
          timestamp: new Date(Date.now() - 30 * 60000).toLocaleTimeString(),
          type: 'Scheduled',
          warehouse: 'Quality Control',
          items: 120,
          duration: 0,
          status: 'Failed'
        }
      ]
    });
  }
};