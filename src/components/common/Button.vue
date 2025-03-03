<template>
  <button 
    class="px-4 py-2 rounded text-sm font-medium transition-colors duration-200"
    :class="buttonClass"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'secondary', 'outline', 'danger'].includes(value)
    }
  },
  computed: {
    buttonClass() {
      const classes = {
        primary: 'bg-primary text-white hover:bg-blue-600',
        secondary: 'bg-secondary text-white hover:bg-gray-700',
        outline: 'bg-white border border-primary text-primary hover:bg-blue-50',
        danger: 'bg-danger text-white hover:bg-red-600'
      };
      return classes[this.variant];
    }
  }
}
</script>