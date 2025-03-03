<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h3 class="text-lg font-semibold text-secondary mb-4">{{ title }}</h3>
    
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th v-for="header in headers" :key="header.key" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ header.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(warehouse, index) in warehouses" :key="index">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ warehouse.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ warehouse.lastSync }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ warehouse.itemCount.toLocaleString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <StatusBadge 
                :status="warehouse.status === 'Synced' ? 'success' : 'error'" 
                :text="warehouse.status" 
              />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <Button 
                :variant="warehouse.status === 'Synced' ? 'outline' : 'primary'"
                @click="syncWarehouse(warehouse.id)"
              >
                {{ warehouse.status === 'Synced' ? 'Sync Now' : 'Retry' }}
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import StatusBadge from '@/components/common/StatusBadge.vue';
import Button from '@/components/common/Button.vue';

export default {
  name: 'WarehouseTable',
  components: {
    StatusBadge,
    Button
  },
  props: {
    title: {
      type: String,
      default: 'Warehouse Sync Status'
    },
    warehouses: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      headers: [
        { key: 'name', label: 'Warehouse' },
        { key: 'lastSync', label: 'Last Sync' },
        { key: 'itemCount', label: 'Items' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' }
      ]
    }
  },
  methods: {
    syncWarehouse(id) {
      this.$emit('sync-warehouse', id);
    }
  }
}
</script>