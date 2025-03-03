
<template>
    <div class="space-y-6">
      <!-- Sync Status Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard 
          title="Sync Status" 
          :value="syncStatus.status" 
          :description="syncStatus.lastSyncTime ? `Last sync: ${syncStatus.lastSyncTime}` : 'Not synced yet'" 
          :type="syncStatus.status === 'Active' ? 'success' : 'warning'" 
        />
        <StatusCard 
          title="Items Processed" 
          :value="syncStatus.itemsProcessed.toLocaleString()" 
          description="Today's total" 
          type="info"
        />
        <StatusCard 
          title="Sync Duration" 
          :value="`${syncStatus.averageDuration} ms`" 
          description="Average sync time" 
          type="default"
        />
      </div>
      
      <!-- Warehouses -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-secondary">Warehouses</h2>
          <div class="flex space-x-2">
            <Button @click="syncAllWarehouses" variant="primary">Sync All Warehouses</Button>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="warehouse in warehouses" :key="warehouse.id" 
            class="border rounded-lg p-4 hover:shadow transition-shadow duration-200"
            :class="{'border-green-300 bg-green-50': warehouse.status === 'Synced', 
                     'border-red-300 bg-red-50': warehouse.status === 'Error',
                     'border-blue-300 bg-blue-50': warehouse.status === 'Syncing...',
                     'border-gray-300': warehouse.status !== 'Synced' && warehouse.status !== 'Error' && warehouse.status !== 'Syncing...'}">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-medium text-secondary">{{ warehouse.name }}</h3>
                <p class="text-sm text-gray-500">{{ warehouse.itemCount.toLocaleString() }} items</p>
              </div>
              <StatusBadge 
                :status="getStatusType(warehouse.status)" 
                :text="warehouse.status" 
              />
            </div>
            
            <div class="mt-4 flex items-center justify-between">
              <span class="text-xs text-gray-500">Last sync: {{ warehouse.lastSync }}</span>
              <Button 
                @click="syncWarehouse(warehouse.id)"
                :variant="warehouse.status === 'Synced' ? 'outline' : 'primary'"
                :disabled="warehouse.status === 'Syncing...'"
              >
                {{ warehouse.status === 'Synced' ? 'Sync Now' : 'Retry' }}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sync History -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold text-secondary mb-6">Sync History</h2>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(history, index) in syncHistory" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ history.timestamp }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ history.type }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ history.warehouse }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ history.items.toLocaleString() }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ history.duration }} ms</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge
                    :status="history.status === 'Success' ? 'success' : 'error'"
                    :text="history.status"
                  />
                </td>
              </tr>
              <tr v-if="syncHistory.length === 0">
                <td colspan="6" class="px-6 py-10 text-center text-sm text-gray-500">
                  No sync history available.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import StatusCard from '@/components/dashboard/StatusCard.vue';
  import StatusBadge from '@/components/common/StatusBadge.vue';
  import Button from '@/components/common/Button.vue';
  
  export default {
    name: 'InventorySync',
    components: {
      StatusCard,
      StatusBadge,
      Button
    },
    data() {
      return {
        syncStatus: {
          status: 'Active',
          lastSyncTime: '14:02:15',
          itemsProcessed: 1899,
          averageDuration: 350
        },
        warehouses: [
          {
            id: 1,
            name: 'Main Warehouse',
            lastSync: '14:02:15',
            itemCount: 1245,
            status: 'Synced'
          },
          {
            id: 2,
            name: 'Raw Materials',
            lastSync: '14:01:52',
            itemCount: 534,
            status: 'Synced'
          },
          {
            id: 3,
            name: 'Quality Control',
            lastSync: '13:45:30',
            itemCount: 120,
            status: 'Error'
          },
          {
            id: 4,
            name: 'Packaging',
            lastSync: '13:30:45',
            itemCount: 320,
            status: 'Synced'
          },
          {
            id: 5,
            name: 'Returns',
            lastSync: '13:15:22',
            itemCount: 87,
            status: 'Synced'
          },
          {
            id: 6,
            name: 'Quarantine',
            lastSync: '13:10:18',
            itemCount: 45,
            status: 'Synced'
          }
        ],
        syncHistory: [
          {
            timestamp: '14:02:15',
            type: 'Scheduled',
            warehouse: 'Main Warehouse',
            items: 1245,
            duration: 325,
            status: 'Success'
          },
          {
            timestamp: '14:01:52',
            type: 'Scheduled',
            warehouse: 'Raw Materials',
            items: 534,
            duration: 290,
            status: 'Success'
          },
          {
            timestamp: '13:45:30',
            type: 'Scheduled',
            warehouse: 'Quality Control',
            items: 120,
            duration: 0,
            status: 'Failed'
          },
          {
            timestamp: '13:45:12',
            type: 'Manual',
            warehouse: 'All Warehouses',
            items: 2351,
            duration: 1250,
            status: 'Success'
          },
          {
            timestamp: '13:30:45',
            type: 'Scheduled',
            warehouse: 'Packaging',
            items: 320,
            duration: 275,
            status: 'Success'
          }
        ]
      };
    },
    methods: {
      getStatusType(status) {
        if (status === 'Synced') return 'success';
        if (status === 'Error') return 'error';
        if (status === 'Syncing...') return 'info';
        return 'warning';
      },
      syncWarehouse(id) {
        const warehouse = this.warehouses.find(w => w.id === id);
        if (!warehouse) return;
        
        // Update status to syncing
        warehouse.status = 'Syncing...';
        
        // Simulate sync process
        setTimeout(() => {
          warehouse.status = 'Synced';
          warehouse.lastSync = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
          
          // Add to sync history
          this.syncHistory.unshift({
            timestamp: warehouse.lastSync,
            type: 'Manual',
            warehouse: warehouse.name,
            items: warehouse.itemCount,
            duration: Math.floor(Math.random() * 200) + 200, // Random duration between 200-400ms
            status: 'Success'
          });
          
          // Update sync status
          this.syncStatus.lastSyncTime = warehouse.lastSync;
          this.syncStatus.itemsProcessed += warehouse.itemCount;
        }, 2000);
      },
      syncAllWarehouses() {
        // Update all warehouses to syncing
        this.warehouses.forEach(warehouse => {
          warehouse.status = 'Syncing...';
        });
        
        // Simulate sync process for all warehouses
        setTimeout(() => {
          let totalItems = 0;
          
          this.warehouses.forEach(warehouse => {
            warehouse.status = 'Synced';
            warehouse.lastSync = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
            totalItems += warehouse.itemCount;
          });
          
          // Add to sync history
          this.syncHistory.unshift({
            timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}),
            type: 'Manual',
            warehouse: 'All Warehouses',
            items: totalItems,
            duration: Math.floor(Math.random() * 500) + 1000, // Random duration between 1000-1500ms
            status: 'Success'
          });
          
          // Update sync status
          this.syncStatus.lastSyncTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
          this.syncStatus.itemsProcessed += totalItems;
        }, 3000);
      }
    }
  }
  </script>