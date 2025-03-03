<template>
    <div class="page-container">
      <!-- Optional page header with title and actions -->
      <div v-if="title || $slots.actions" class="page-header">
        <h1 v-if="title" class="page-title">{{ title }}</h1>
        <div v-if="$slots.actions" class="page-actions">
          <slot name="actions"></slot>
        </div>
      </div>
      
      <!-- Main content area -->
      <div class="page-content" :class="{ 'no-padding': noPadding }">
        <slot></slot>
      </div>
      
      <!-- Optional footer -->
      <div v-if="$slots.footer" class="page-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PageContainer',
    props: {
      title: {
        type: String,
        default: ''
      },
      noPadding: {
        type: Boolean,
        default: false
      }
    }
  }
  </script>
  
  <style scoped>
  .page-container {
    @apply h-full flex flex-col;
  }
  
  .page-header {
    @apply flex justify-between items-center mb-6;
  }
  
  .page-title {
    @apply text-xl font-bold text-secondary;
  }
  
  .page-actions {
    @apply flex items-center space-x-2;
  }
  
  .page-content {
    @apply flex-1;
  }
  
  .page-content.no-padding {
    @apply p-0;
  }
  
  .page-footer {
    @apply mt-6 pt-4 border-t border-gray-200;
  }
  </style>