<template>
    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-secondary">System Configuration</h2>
          <div class="flex space-x-2">
            <Button @click="saveConfiguration" variant="primary" :disabled="!hasChanges">Save Changes</Button>
            <Button @click="resetConfiguration" variant="outline" :disabled="!hasChanges">Reset</Button>
          </div>
        </div>
        
        <!-- Tabs for different configuration sections -->
        <div class="border-b border-gray-200 mb-6">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="py-4 px-1 border-b-2 font-medium text-sm"
              :class="activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>
        
        <!-- Sync Configuration Tab -->
        <div v-if="activeTab === 'sync'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-secondary mb-4">Synchronization Settings</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Sync Interval (seconds)</label>
                  <input type="number" v-model="config.sync.interval" min="5" max="300"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Batch Size (items per batch)</label>
                  <input type="number" v-model="config.sync.batchSize" min="10" max="1000"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Item Types to Sync</label>
                  <div class="mt-2 space-y-2">
                    <div class="flex items-center">
                      <input type="checkbox" v-model="config.sync.syncRawMaterials" id="raw-materials"
                        class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label for="raw-materials" class="ml-2 text-sm text-gray-700">Raw Materials</label>
                    </div>
                    <div class="flex items-center">
                      <input type="checkbox" v-model="config.sync.syncFinishedGoods" id="finished-goods"
                        class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label for="finished-goods" class="ml-2 text-sm text-gray-700">Finished Goods</label>
                    </div>
                    <div class="flex items-center">
                      <input type="checkbox" v-model="config.sync.syncPackagingMaterials" id="packaging-materials"
                        class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label for="packaging-materials" class="ml-2 text-sm text-gray-700">Packaging Materials</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-medium text-secondary mb-4">Error Handling</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Max Retry Attempts</label>
                  <input type="number" v-model="config.errorHandling.maxRetries" min="1" max="10"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Initial Retry Delay (seconds)</label>
                  <input type="number" v-model="config.errorHandling.initialRetryDelay" min="1" max="30"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Retry Strategy</label>
                  <select v-model="config.errorHandling.retryStrategy"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  >
                    <option value="exponential">Exponential Backoff</option>
                    <option value="linear">Linear Backoff</option>
                    <option value="fixed">Fixed Interval</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- API Configuration Tab -->
        <div v-if="activeTab === 'api'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-secondary mb-4">SAP B1 Connection</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Server Address</label>
                  <input type="text" v-model="config.sap.server"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Database Name</label>
                  <input type="text" v-model="config.sap.database"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input type="text" v-model="config.sap.username"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input type="password" v-model="config.sap.password"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-medium text-secondary mb-4">Skyplanner API</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">API Endpoint</label>
                  <input type="text" v-model="config.skyplanner.apiEndpoint"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                  <input type="password" v-model="config.skyplanner.apiKey"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">API Timeout (seconds)</label>
                  <input type="number" v-model="config.skyplanner.timeout" min="5" max="60"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Notification Tab -->
        <div v-if="activeTab === 'notifications'" class="space-y-6">
          <h3 class="text-lg font-medium text-secondary mb-4">Notification Settings</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Error Notification Recipients</label>
              <textarea v-model="config.notifications.errorRecipients" rows="3" placeholder="Enter email addresses separated by commas"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              ></textarea>
              <p class="mt-1 text-xs text-gray-500">Email addresses will receive notifications for critical errors</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Notification Methods</label>
              <div class="mt-2 space-y-2">
                <div class="flex items-center">
                  <input type="checkbox" v-model="config.notifications.emailEnabled" id="email-notifications"
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label for="email-notifications" class="ml-2 text-sm text-gray-700">Email Notifications</label>
                </div>
                <div class="flex items-center">
                  <input type="checkbox" v-model="config.notifications.systemEnabled" id="system-notifications"
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label for="system-notifications" class="ml-2 text-sm text-gray-700">System Notifications</label>
                </div>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Notification Threshold</label>
              <select v-model="config.notifications.errorThreshold"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              >
                <option value="critical">Critical Errors Only</option>
                <option value="error">All Errors</option>
                <option value="warning">Warnings and Errors</option>
                <option value="info">All Events (Informational)</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Success Message -->
        <div v-if="showSuccess" class="mt-6 p-4 rounded-md bg-green-100 text-green-700">
          Configuration saved successfully!
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Button from '@/components/common/Button.vue';
  
  export default {
    name: 'Configuration',
    components: {
      Button
    },
    data() {
      return {
        activeTab: 'sync',
        tabs: [
          { id: 'sync', name: 'Synchronization' },
          { id: 'api', name: 'API Configuration' },
          { id: 'notifications', name: 'Notifications' }
        ],
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
        },
        originalConfig: null,
        showSuccess: false
      };
    },
    computed: {
      hasChanges() {
        return JSON.stringify(this.config) !== JSON.stringify(this.originalConfig);
      }
    },
    methods: {
      saveConfiguration() {
        // In a real app, this would call an API to save the configuration
        console.log('Saving configuration:', this.config);
        
        // Show success message
        this.showSuccess = true;
        setTimeout(() => {
          this.showSuccess = false;
        }, 3000);
        
        // Update the original config to reflect the saved state
        this.originalConfig = JSON.parse(JSON.stringify(this.config));
      },
      resetConfiguration() {
        // Reset to the original configuration
        this.config = JSON.parse(JSON.stringify(this.originalConfig));
      }
    },
    mounted() {
      // Store the original configuration for comparison
      this.originalConfig = JSON.parse(JSON.stringify(this.config));
    }
  }
  </script>