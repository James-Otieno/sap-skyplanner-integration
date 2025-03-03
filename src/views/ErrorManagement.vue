
<template>
    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-secondary">Error Management</h2>
          <div class="flex space-x-2">
            <Button @click="retryAllErrors" variant="primary">Retry All Errors</Button>
            <Button @click="clearResolvedErrors" variant="outline">Clear Resolved</Button>
          </div>
        </div>
        
        <!-- Filters -->
        <div class="flex flex-wrap gap-4 mb-6">
          <div class="w-64">
            <label class="block text-sm font-medium text-gray-700 mb-1">Error Type</label>
            <select v-model="filters.type" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
              <option value="">All Types</option>
              <option value="connection">Connection Errors</option>
              <option value="validation">Data Validation</option>
              <option value="api">API Errors</option>
              <option value="system">System Errors</option>
            </select>
          </div>
          
          <div class="w-64">
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select v-model="filters.status" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="retrying">Retrying</option>
              <option value="resolved">Resolved</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          
          <div class="w-64">
            <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select v-model="filters.dateRange" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
            </select>
          </div>
        </div>
        
        <!-- Error Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error Type</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="error in filteredErrors" :key="error.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ error.timestamp }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                        :class="getErrorTypeClass(error.type)">
                    {{ error.type }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  <div>{{ error.message }}</div>
                  <div v-if="error.details" class="text-xs text-gray-500 mt-1">{{ error.details }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge :status="getStatusType(error.status)" :text="error.status" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button @click="retryError(error.id)" v-if="error.status !== 'Resolved'"
                      class="text-primary hover:text-blue-700">
                      Retry
                    </button>
                    <button @click="showErrorDetails(error)" 
                      class="text-secondary hover:text-gray-700">
                      Details
                    </button>
                    <button @click="resolveError(error.id)" v-if="error.status !== 'Resolved'"
                      class="text-success hover:text-green-700">
                      Resolve
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredErrors.length === 0">
                <td colspan="5" class="px-6 py-10 text-center text-sm text-gray-500">
                  No errors found matching the selected filters.
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
            <span class="font-medium">{{ pagination.total }}</span> errors
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
      
      <!-- Error Detail Modal -->
      <div v-if="selectedError" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
          <div class="p-4 border-b bg-gray-50">
            <h3 class="text-lg font-medium text-secondary">Error Details</h3>
          </div>
          <div class="p-6">
            <dl class="space-y-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">Error Type</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ selectedError.type }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Message</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ selectedError.message }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Timestamp</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ selectedError.timestamp }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Status</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ selectedError.status }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Details</dt>
                <dd class="mt-1 text-sm text-gray-900 bg-gray-50 p-4 rounded overflow-auto max-h-64">
                  <pre>{{ JSON.stringify(selectedError.details || {}, null, 2) }}</pre>
                </dd>
              </div>
            </dl>
          </div>
          <div class="p-4 border-t bg-gray-50 flex justify-end space-x-2">
            <Button variant="outline" @click="selectedError = null">Close</Button>
            <Button 
              v-if="selectedError.status !== 'Resolved'"
              variant="primary" 
              @click="retryError(selectedError.id)">
              Retry
            </Button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Button from '@/components/common/Button.vue';
  import StatusBadge from '@/components/common/StatusBadge.vue';
  
  export default {
    name: 'ErrorManagement',
    components: {
      Button,
      StatusBadge
    },
    data() {
      return {
        errors: [
          {
            id: 1,
            timestamp: '2025-03-03 13:42:15',
            type: 'API Connection',
            message: 'Skyplanner API timeout (30s)',
            details: { request_id: 'req-123', endpoint: '/saldos', method: 'POST' },
            status: 'Retrying (2/5)'
          },
          {
            id: 2,
            timestamp: '2025-03-03 13:05:22',
            type: 'Data Validation',
            message: 'ItemCode RM042 not found in product map',
            details: { item_code: 'RM042', warehouse: 'QC', quantity: 150 },
            status: 'Pending'
          },
          {
            id: 3,
            timestamp: '2025-03-03 12:30:45',
            type: 'System Error',
            message: 'Unable to connect to SAP B1 database',
            details: { error_code: 'DB-001', connection_id: 'sap-conn-01' },
            status: 'Resolved'
          },
          {
            id: 4,
            timestamp: '2025-03-03 11:15:03',
            type: 'API Error',
            message: 'Skyplanner API returned 400 Bad Request',
            details: { response: { status: 400, message: 'Invalid data format' } },
            status: 'Failed'
          }
        ],
        filters: {
          type: '',
          status: '',
          dateRange: 'today'
        },
        pagination: {
          currentPage: 1,
          perPage: 10,
          total: 4,
          from: 1,
          to: 4,
          totalPages: 1
        },
        selectedError: null
      };
    },
    computed: {
      filteredErrors() {
        // In a real app, this would filter based on the filters object
        // For this demo, we'll just return all errors
        return this.errors;
      }
    },
    methods: {
      getErrorTypeClass(type) {
        const classes = {
          'API Connection': 'bg-blue-100 text-blue-800',
          'Data Validation': 'bg-yellow-100 text-yellow-800',
          'System Error': 'bg-red-100 text-red-800',
          'API Error': 'bg-purple-100 text-purple-800'
        };
        return classes[type] || 'bg-gray-100 text-gray-800';
      },
      getStatusType(status) {
        if (status.includes('Resolved')) return 'success';
        if (status.includes('Retrying')) return 'info';
        if (status.includes('Failed')) return 'error';
        return 'warning';
      },
      retryError(id) {
        // In a real app, this would call an API to retry the error
        console.log(`Retrying error ${id}`);
        const error = this.errors.find(e => e.id === id);
        if (error) {
          error.status = 'Retrying (1/5)';
        }
      },
      resolveError(id) {
        // In a real app, this would call an API to mark the error as resolved
        console.log(`Resolving error ${id}`);
        const error = this.errors.find(e => e.id === id);
        if (error) {
          error.status = 'Resolved';
        }
      },
      showErrorDetails(error) {
        this.selectedError = error;
      },
      retryAllErrors() {
        // In a real app, this would call an API to retry all pending errors
        console.log('Retrying all errors');
        this.errors.forEach(error => {
          if (error.status !== 'Resolved') {
            error.status = 'Retrying (1/5)';
          }
        });
      },
      clearResolvedErrors() {
        // In a real app, this would call an API to clear resolved errors
        console.log('Clearing resolved errors');
        this.errors = this.errors.filter(error => error.status !== 'Resolved');
        this.updatePagination();
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
        const total = this.errors.length;
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