<template>
  <div class="space-y-6">
    <!-- Status Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatusCard 
        title="Inventory Sync Status" 
        value="Active" 
        description="Last synced: 2 minutes ago" 
        type="success" 
        icon="✓"
      />
      <StatusCard 
        title="Pending Updates" 
        :value="pendingUpdates" 
        description="All items synced" 
        type="info"
      />
      <StatusCard 
        title="Error Count" 
        :value="errors.length" 
        description="Requires attention" 
        type="error"
      />
    </div>
    
    <!-- Charts and Errors -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-2">
        <SyncActivityChart />
      </div>
      <div>
        <ErrorList 
          :errors="errors" 
          @retry-all="retryAllErrors" 
          @view-details="viewErrorDetails"
        />
      </div>
    </div>
    
    <!-- Warehouse Table -->
    <div>
      <WarehouseTable 
        :warehouses="warehouses" 
        @sync-warehouse="syncWarehouse"
      />
    </div>
  </div>
</template>

<script>
import StatusCard from '@/components/dashboard/StatusCard.vue';
import SyncActivityChart from '@/components/dashboard/SyncActivityChart.vue';
import ErrorList from '@/components/dashboard/ErrorList.vue';
import WarehouseTable from '@/components/dashboard/WarehouseTable.vue';

export default {
  name: 'Dashboard',
  components: {
    StatusCard,
    SyncActivityChart,
    ErrorList,
    WarehouseTable
  },
  data() {
    return {
      pendingUpdates: 0,
      errors: [
        {
          title: 'API Connection Failed',
          message: 'Skyplanner API timeout (30s)',
          timestamp: '13:42:15',
          status: 'Retry 2/5',
          type: 'error'
        },
        {
          title: 'Data Validation Error',
          message: 'ItemCode RM042 not found in map',
          timestamp: '13:05:22',
          status: 'Manual resolution needed',
          type: 'error'
        }
      ],
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
          status: 'Error (2)'
        }
      ]
    }
  },
  methods: {
    retryAllErrors() {
      // Logic to retry all errors
      console.log('Retrying all errors');
    },
    viewErrorDetails() {
      // Logic to view error details
      this.$router.push('/errors');
    },
    syncWarehouse(id) {
      // Logic to sync a specific warehouse
      console.log(`Syncing warehouse ${id}`);
      
      // Simulate a successful sync
      const warehouse = this.warehouses.find(w => w.id === id);
      if (warehouse) {
        warehouse.status = 'Syncing...';
        
        setTimeout(() => {
          warehouse.status = 'Synced';
          warehouse.lastSync = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
        }, 2000);
      }
    }
  }
}
</script>