<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h3 class="text-lg font-semibold text-secondary mb-2">{{ title }}</h3>
    <div class="flex items-center justify-between">
      <div>
        <p :class="valueClass">{{ value }}</p>
        <p class="text-sm text-gray-500">{{ description }}</p>
      </div>
      <div :class="`w-16 h-16 rounded-full flex items-center justify-center ${iconBgClass}`">
        <span v-if="showIcon" :class="`text-xl ${iconClass}`">{{ displayIcon }}</span>
        <span v-else class="text-xl font-bold" :class="iconClass">{{ value }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatusCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'default',
      validator: value => ['success', 'error', 'warning', 'info', 'default'].includes(value)
    },
    icon: {
      type: String,
      default: ''
    }
  },
  computed: {
    valueClass() {
      const classes = {
        success: 'text-success',
        error: 'text-danger',
        warning: 'text-warning',
        info: 'text-info',
        default: 'text-secondary'
      };
      return `text-base font-medium ${classes[this.type]}`;
    },
    iconBgClass() {
      const classes = {
        success: 'bg-green-100',
        error: 'bg-red-100',
        warning: 'bg-yellow-100',
        info: 'bg-blue-100',
        default: 'bg-gray-100'
      };
      return classes[this.type];
    },
    iconClass() {
      const classes = {
        success: 'text-success',
        error: 'text-danger',
        warning: 'text-warning',
        info: 'text-info',
        default: 'text-gray-500'
      };
      return classes[this.type];
    },
    showIcon() {
      return this.icon !== '';
    },
    displayIcon() {
      return this.icon;
    }
  }
}
</script>