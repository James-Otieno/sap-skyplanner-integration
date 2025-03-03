<template>
  <div class="bg-white rounded-lg shadow p-4">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-secondary">{{ title }}</h3>
      <div class="flex space-x-2">
        <Button @click="retryAll" variant="primary">Retry All</Button>
        <Button @click="viewDetails" variant="outline">View Details</Button>
      </div>
    </div>
    <div class="space-y-3">
      <div 
        v-for="(error, index) in errors" 
        :key="index"
        class="p-3 rounded border"
        :class="{'bg-red-50 border-red-200': error.type === 'error'}"
      >
        <h4 class="font-semibold text-danger">{{ error.title }}</h4>
        <p class="text-sm text-gray-700 mt-1">{{ error.message }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ error.timestamp }} - {{ error.status }}</p>
      </div>
      <div v-if="errors.length === 0" class="text-center py-6 text-gray-500">
        No errors found
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/common/Button.vue';

export default {
  name: 'ErrorList',
  components: {
    Button
  },
  props: {
    title: {
      type: String,
      default: 'Recent Errors'
    },
    errors: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    retryAll() {
      this.$emit('retry-all');
    },
    viewDetails() {
      this.$emit('view-details');
    }
  }
}
</script>