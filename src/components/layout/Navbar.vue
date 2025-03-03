<template>
  <header class="bg-white shadow h-16 flex items-center justify-between px-6">
    <h1 class="text-xl font-bold text-secondary">{{ pageTitle }}</h1>
    <div class="flex items-center">
      <span class="text-gray-500 mr-2">Admin User</span>
      <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
        <i class="fas fa-user text-gray-500"></i>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Navbar',
  computed: {
    pageTitle() {
      const pathMap = {
        '/': 'Dashboard',
        '/inventory': 'Inventory Synchronization',
        '/errors': 'Error Management',
        '/audit': 'Audit Trail',
        '/config': 'System Configuration'
      };
      return pathMap[this.$route.path] || 'Dashboard';
    }
  }
}
</script>