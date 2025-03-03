import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/css/main.scss';
//import './assets/css/main.scss' 

const app = createApp(App);

app.use(router);
app.use(store);

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err);
  console.error('Error info:', info);
  
  // In a production app, you could send errors to a monitoring service
  // Example: sendErrorToMonitoringService(err, info);
};

app.mount('#app');