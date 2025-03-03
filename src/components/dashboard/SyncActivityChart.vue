<template>
  <div class="bg-white rounded-lg shadow p-4">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-secondary">{{ title }}</h3>
      <div class="flex items-center">
        <div class="w-3 h-3 bg-primary rounded mr-1"></div>
        <span class="text-xs text-gray-500">Sync Performance (ms)</span>
      </div>
    </div>
    <div class="h-64">
      <LineChart :chart-data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script>
import { Line as LineChart } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default {
  name: 'SyncActivityChart',
  components: {
    LineChart
  },
  props: {
    title: {
      type: String,
      default: 'Real-time Sync Activity'
    }
  },
  data() {
    return {
      chartData: {
        labels: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00'],
        datasets: [
          {
            label: 'Sync Duration (ms)',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            borderColor: '#3498db',
            data: [620, 580, 550, 500, 450, 470, 450, 480, 420, 430, 410],
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#3498db'
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Duration (ms)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Time'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    };
  }
}
</script>