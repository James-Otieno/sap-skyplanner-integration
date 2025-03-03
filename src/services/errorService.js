//import api from './api';

export default {
  /**
   * Get all sync errors
   */
  getErrors() {
    // Mock data
    return Promise.resolve({
      data: {
        errors: [
          {
            id: 1,
            timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
            type: 'API Connection',
            message: 'Skyplanner API timeout (30s)',
            details: { request_id: 'req-123', endpoint: '/saldos', method: 'POST' },
            status: 'Retrying (2/5)'
          },
          {
            id: 2,
            timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
            type: 'Data Validation',
            message: 'ItemCode RM042 not found in product map',
            details: { item_code: 'RM042', warehouse: 'QC', quantity: 150 },
            status: 'Pending'
          }
        ],
        total: 2,
        totalPages: 1
      }
    });
  },
  
  /**
   * Retry a specific error
   */
  retryError(errorId) {
    // Mock data
    return Promise.resolve({
      data: {
        success: true,
        errorId,
        newStatus: 'Retrying (1/5)'
      }
    });
  },
  
  /**
   * Retry all pending errors
   */
  retryAllErrors() {
    // Mock data
    return Promise.resolve({
      data: {
        success: true,
        retryCount: 2
      }
    });
  },
  
  /**
   * Mark an error as resolved
   */
  resolveError(errorId) {
    // Mock data
    return Promise.resolve({
      data: {
        success: true,
        errorId
      }
    });
  },
  
  /**
   * Clear all resolved errors
   */
  clearResolvedErrors() {
    // Mock data
    return Promise.resolve({
      data: {
        success: true,
        clearedCount: 1
      }
    });
  }
};