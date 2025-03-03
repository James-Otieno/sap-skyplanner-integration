
<template>
  <div class="bg-secondary w-60 flex flex-col text-white">
    <!-- Logo area -->
    <div class="p-4 bg-secondary-dark">
      <div class="bg-opacity-30 bg-gray-800 p-3 rounded">
        <h1 class="text-lg font-bold">LAB & ALLIED</h1>
        <p class="text-xs text-gray-400">Integration Panel</p>
      </div>
    </div>

    <!-- Navigation menu -->
    <nav class="flex-1 p-2">
      <router-link 
        v-for="item in navItems" 
        :key="item.path" 
        :to="item.path"
        class="flex items-center p-2 my-2 rounded transition-colors duration-200"
        :class="[$route.path === item.path ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700']"
      >
        <div class="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
          <i :class="item.icon"></i>
        </div>
        {{ item.name }}
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      navItems: [
        { name: 'Dashboard', path: '/', icon: 'fas fa-tachometer-alt' },
        { name: 'Inventory Sync', path: '/inventory', icon: 'fas fa-sync' },
        { name: 'Error Management', path: '/errors', icon: 'fas fa-exclamation-triangle' },
        { name: 'Audit Trail', path: '/audit', icon: 'fas fa-history' },
        { name: 'Configuration', path: '/config', icon: 'fas fa-cog' }
      ]
    }
  }
}
</script>
