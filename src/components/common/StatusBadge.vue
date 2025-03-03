<template>
  <span class="px-3 py-1 rounded-full text-sm" :class="badgeClass">
    {{ text }}
  </span>
</template>

<script>
export default {
  name: 'StatusBadge',
  props: {
    status: {
      type: String,
      required: true,
      validator: value => ['success', 'error', 'warning', 'info'].includes(value)
    },
    text: {
      type: String,
      required: true
    }
  },
  computed: {
    badgeClass() {
      const classes = {
        success: 'bg-green-100 text-success',
        error: 'bg-red-100 text-danger',
        warning: 'bg-yellow-100 text-warning',
        info: 'bg-blue-100 text-info'
      };
      return classes[this.status];
    }
  }
}
</script>