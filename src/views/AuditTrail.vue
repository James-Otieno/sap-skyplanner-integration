
<template>
    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-secondary">Audit Trail</h2>
          <div class="flex space-x-2">
            <Button @click="exportAuditLog" variant="outline">Export Log</Button>
          </div>
        </div>
        
        <!-- Filters -->
        <div class="flex flex-wrap gap-4 mb-6">
          <div class="w-64">
            <label class="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
            <select v-model="filters.eventType" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
              <option value="">All Events</option>
              <option value="sync">Synchronization</option>
              <option value="config">Configuration</option>
              <option value="user">User Actions</option>
              <option value="error">Errors</option>
            </select>
          </div>
          
          <div class="w-64">
            <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select v-model="filters.dateRange" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          <div class="w-64">
            <label class="block text-sm font-medium text-gray-700 mb-1">User</label>
            <select v-model="filters.userId" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
              <option value="">All Users</option>
              <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
            </select>
          </div>
          
          <div v-if="filters.dateRange === 'custom'" class="flex gap-2">
            <div class="w-32">
              <label class="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input type="date" v-model="filters.startDate" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
            </div>
            <div class="w-32">
              <label class="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input type="date" v-model="filters.endDate" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
            </div>
          </div>
        </div>
        
        <!-- Audit Log Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Type</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="log in filteredLogs" :key="log.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ log.timestamp }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                        :class="getEventTypeClass(log.eventType)">
                    {{ log.eventType }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ log.description }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ log.userName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button @click="showLogDetails(log)" class="text-primary hover:text-blue-700">
                    View Details
                  </button>
                </td>
              </tr>
              <tr v-if="filteredLogs.length === 0">
                <td colspan="5" class="px-6 py-10 text-center text-sm text-gray-500">
                  No audit events found matching the selected filters.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="flex items-center justify-between mt-4">
          <div class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ pagination.from }}</span> to 
            <span class="font-medium">{{ pagination.to }}</span> of 
            <span class="font-medium">{{ pagination.total }}</span> events
          </div>
          <div class="flex space-x-1">
            <button @click="previousPage" :disabled="pagination.currentPage === 1"
              class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md"
              :class="pagination.currentPage === 1 ? 'text-gray-400 bg-gray-100' : 'text-gray-700 bg-white hover:bg-gray-50'">
              Previous
            </button>
            <button @click="nextPage" :disabled="pagination.currentPage === pagination.totalPages"
              class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md"
              :class="pagination.currentPage === pagination.totalPages ? 'text-gray-400 bg-gray-100' : 'text-gray-700 bg-white hover:bg-gray-50'">
              Next
            </button>
          </div>
        </div>
      </div>
      
      <!-- Log Detail Modal -->
      <div v-if="selectedLog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
          <div class="p-4 border-b bg-gray-50">
            <h3 class="text-lg font-medium text-secondary">Event Details</h3>
          </div>
          <div class="p-6">
            <dl class="space-y-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">Event Type</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ selectedLog.eventType }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Description</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ selectedLog.description }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Timestamp</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ selectedLog.timestamp }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">User</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ selectedLog.userName }}</dd>
              </div>
              <div v-if="selectedLog.beforeState && selectedLog.afterState">
                <dt class="text-sm font-medium text-gray-500">Changes</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <div class="bg-gray-50 p-4 rounded overflow-auto max-h-64">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <h4 class="text-xs font-medium text-gray-500 mb-2">Before</h4>
                        <pre class="text-xs">{{ JSON.stringify(selectedLog.beforeState, null, 2) }}</pre>
                      </div>
                      <div>
                        <h4 class="text-xs font-medium text-gray-500 mb-2">After</h4>
                        <pre class="text-xs">{{ JSON.stringify(selectedLog.afterState, null, 2) }}</pre>
                      </div>
                    </div>
                  </div>
                </dd>
              </div>
              <div v-else>
                <dt class="text-sm font-medium text-gray-500">Details</dt>
                <dd class="mt-1 text-sm text-gray-900 bg-gray-50 p-4 rounded overflow-auto max-h-64">
                  <pre>{{ JSON.stringify(selectedLog.details || {}, null, 2) }}</pre>
                </dd>
              </div>
            </dl>
          </div>
          <div class="p-4 border-t bg-gray-50 flex justify-end">
            <Button variant="outline" @click="selectedLog = null">Close</Button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Button from '@/components/common/Button.vue';
  
  export default {
    name: 'AuditTrail',
    components: {
      Button
    },
    data() {
      return {
        filters: {
          eventType: '',
          dateRange: 'week',
          userId: '',
          startDate: null,
          endDate: null
        },
        logs: [
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
          },
          {
            id: 4,
            timestamp: '2025-03-03 13:15:45',
            eventType: 'User',
            description: 'User logged in',
            userName: 'Admin User',
            details: { 
              ip_address: '192.168.1.100',
              session_id: 'sess-123456'
            }
          },
          {
            id: 5,
            timestamp: '2025-03-03 12:52:30',
            eventType: 'Sync',
            description: 'Manual sync triggered for Quality Control warehouse',
            userName: 'Admin User',
            details: { 
              warehouse: 'Quality Control',
              items_processed: 120,
              duration_ms: 1850
            }
          }
        ],
        users: [
          { id: 1, name: 'Admin User' },
          { id: 2, name: 'System' }
        ],
        pagination: {
          currentPage: 1,
          perPage: 10,
          total: 5,
          from: 1,
          to: 5,
          totalPages: 1
        },
        selectedLog: null
      };
    },
    computed: {
      filteredLogs() {
        // In a real app, this would filter based on the filters object
        // For this demo, we'll just return all logs
        return this.logs;
      }
    },
    methods: {
      getEventTypeClass(type) {
        const classes = {
          'Sync': 'bg-blue-100 text-blue-800',
          'Error': 'bg-red-100 text-red-800',
          'Config': 'bg-purple-100 text-purple-800',
          'User': 'bg-green-100 text-green-800'
        };
        return classes[type] || 'bg-gray-100 text-gray-800';
      },
      showLogDetails(log) {
        this.selectedLog = log;
      },
      exportAuditLog() {
        // In a real app, this would generate and download a CSV or PDF file
        console.log('Exporting audit log');
        alert('Audit log export started. The file will be downloaded when ready.');
      },
      previousPage() {
        if (this.pagination.currentPage > 1) {
          this.pagination.currentPage--;
          this.updatePagination();
        }
      },
      nextPage() {
        if (this.pagination.currentPage < this.pagination.totalPages) {
          this.pagination.currentPage++;
          this.updatePagination();
        }
      },
      updatePagination() {
        // In a real app, this would update the pagination based on the API response
        const total = this.logs.length;
        const { currentPage, perPage } = this.pagination;
        const from = (currentPage - 1) * perPage + 1;
        const to = Math.min(currentPage * perPage, total);
        const totalPages = Math.ceil(total / perPage);
        
        this.pagination = {
          ...this.pagination,
          total,
          from: total > 0 ? from : 0,
          to,
          totalPages
        };
      }
    },
    mounted() {
      this.updatePagination();
    }
  }
  </script>