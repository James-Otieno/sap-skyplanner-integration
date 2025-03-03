//import api from './api';

export default {
  /**
   * Get application configuration
   */
  getConfig() {
    // For development, return mock data instead of calling API
    return Promise.resolve({
      data: {
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
          server: 'sap-server.example.com',
          database: 'SAPBusinessOne',
          username: 'integration_user',
          password: '********'
        },
        skyplanner: {
          apiEndpoint: 'https://integration.skyplanner.app/api',
          apiKey: '********',
          timeout: 30
        },
        notifications: {
          errorRecipients: 'admin@example.com, support@example.com',
          emailEnabled: true,
          systemEnabled: true,
          errorThreshold: 'error'
        }
      }
    });
    // When you have a real API:
    // return api.get('/config');
  },
  
  /**
   * Update application configuration
   */
  updateConfig(config) {
    // For development, return mock data instead of calling API
    return Promise.resolve({
      data: config
    });
    // When you have a real API:
    // return api.post('/config', config);
  }
};