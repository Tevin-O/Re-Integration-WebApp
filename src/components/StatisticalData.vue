<template>
    <v-container>
      <v-row>
        <!-- Title -->
        <v-col cols="12">
          <v-card class="mx-auto my-5 floating-card-title" elevation="2">
            <v-card-title class="d-flex justify-center align-center">
              <v-icon class="mr-2">fas fa-chart-bar</v-icon>
              <h2 class="title-text">Statistical Data</h2>
            </v-card-title>
          </v-card>
        </v-col>
  
        <!-- Pie Chart -->
        <v-col cols="12" md="6">
          <v-card class="mx-auto my-5 small-card" elevation="2">
            <v-card-text>
              <div v-if="chartOptions">
                <highcharts :options="chartOptions"></highcharts>
              </div>
              <div class="explanation">
                <p>This chart represents the number of children and users in the system. The data is fetched in real-time from the database.</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
  
        <!-- Bar Chart for Pending Connections and Complaints -->
        <v-col cols="12" md="6">
          <v-card class="mx-auto my-5 small-card" elevation="2">
            <v-card-text>
              <div v-if="pendingChartOptions">
                <highcharts :options="pendingChartOptions"></highcharts>
              </div>
              <div class="explanation">
                <p>This chart shows the number of pending connections and complaints received in the system. The data is updated in real-time.</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import Highcharts from 'highcharts';
  import HighchartsVue from 'highcharts-vue';
  import { getFirestore, collection, getDocs } from 'firebase/firestore';
  
  export default {
    name: 'StatisticalData',
    components: {
      HighchartsVue
    },
    setup() {
      const db = getFirestore();
      const userCount = ref(0);
      const childrenCount = ref(0);
      const pendingConnectionsCount = ref(0);
      const complaintsCount = ref(0);
      const chartOptions = ref(null);
      const pendingChartOptions = ref(null);
  
      const loadUsers = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'users'));
          userCount.value = querySnapshot.docs.length;
          setTimeout(updateChartOptions, 500); // Add a delay before updating chart options
        } catch (error) {
          console.error('Error loading users:', error);
        }
      };
  
      const loadChildren = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'children'));
          childrenCount.value = querySnapshot.docs.length;
          setTimeout(updateChartOptions, 500); // Add a delay before updating chart options
        } catch (error) {
          console.error('Error loading children:', error);
        }
      };
  
      const loadPendingConnections = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'connections'));
          pendingConnectionsCount.value = querySnapshot.docs.filter(doc => doc.data().status === 'pending').length;
          setTimeout(updatePendingChartOptions, 500); // Add a delay before updating chart options
        } catch (error) {
          console.error('Error loading pending connections:', error);
        }
      };
  
      const loadComplaints = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'complaints'));
          complaintsCount.value = querySnapshot.docs.length;
          setTimeout(updatePendingChartOptions, 500); // Add a delay before updating chart options
        } catch (error) {
          console.error('Error loading complaints:', error);
        }
      };
  
      const updateChartOptions = () => {
        chartOptions.value = {
          chart: {
            type: 'pie',
            height: 200
          },
          title: {
            text: 'User and Children Statistics'
          },
          series: [
            {
              name: 'Count',
              data: [
                { name: 'Users', y: userCount.value },
                { name: 'Children', y: childrenCount.value }
              ]
            }
          ]
        };
      };
  
      const updatePendingChartOptions = () => {
        pendingChartOptions.value = {
          chart: {
            type: 'bar',
            height: 200
          },
          title: {
            text: 'Pending Connections and Complaints'
          },
          xAxis: {
            categories: ['Pending Connections', 'Complaints']
          },
          series: [
            {
              name: 'Count',
              data: [pendingConnectionsCount.value, complaintsCount.value]
            }
          ]
        };
      };
  
      onMounted(() => {
        loadUsers();
        loadChildren();
        loadPendingConnections();
        loadComplaints();
      });
  
      return {
        chartOptions,
        pendingChartOptions
      };
    }
  };
  </script>
  
  <style scoped>
  .floating-card-title {
    background-color: #f0f0f0;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .small-card {
    background-color: #f5f5f5;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
    padding: 10px;
    height: 300px; /* Adjusted height */
  }
  .small-card:hover {
    transform: translateY(-5px);
  }
  .v-card-title {
    font-size: 20px;
    font-weight: bold;
  }
  .explanation {
    margin-top: 10px;
    font-size: 12px;
    color: #666;
    text-align: center;
  }
  .title-text {
    font-size: 20px;
    font-weight: bold;
  }
  </style>
  