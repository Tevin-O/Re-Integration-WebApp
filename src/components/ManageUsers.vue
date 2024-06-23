<template>
  <v-container>
    <v-row>
      <!-- Manage Users Title and Total Count -->
      <v-col cols="12">
        <v-card class="mx-auto my-5" elevation="2">
          <v-card-title class="d-flex justify-center">
            <h2>Manage Users</h2>
          </v-card-title>
          <v-card-text class="text-center">
            <p>Total users: {{ userCount }}</p>
            <p>Total children: {{ childrenCount }}</p>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- User and Children Statistics -->
      <v-col cols="12">
        <v-card class="mx-auto my-5" elevation="2">
          <v-card-title>User and Children Statistics</v-card-title>
          <v-card-text>
            <div v-if="chartOptions">
              <highcharts :options="chartOptions"></highcharts>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Current Users -->
      <v-col cols="12">
        <v-card class="mx-auto my-5 floating-card" elevation="2">
          <v-card-title>Current Users</v-card-title>
          <v-card-text>
            <v-simple-table class="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in currentUsers" :key="user.id">
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Search and Display User Information -->
      <v-col cols="12">
        <v-card class="mx-auto my-5 floating-card" elevation="2">
          <v-card-title>Search User by ID</v-card-title>
          <v-card-text>
            <v-text-field v-model="searchUserId" label="Enter User ID" outlined dense></v-text-field>
            <v-btn @click="searchUserById" color="primary" class="mt-4" block>Search</v-btn>
            <div v-if="searchedUser">
              <v-simple-table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ searchedUser.name }}</td>
                    <td>{{ searchedUser.email }}</td>
                    <td>{{ searchedUser.address }}</td>
                    <td>{{ searchedUser.phone }}</td>
                  </tr>
                </tbody>
              </v-simple-table>

              <!-- Additional Functionalities for Searched User -->
              <v-divider class="my-4"></v-divider>
              <!-- Reset Password -->
              <v-btn @click="resetPassword" color="primary" class="mt-4" block>Reset Password</v-btn>
              <!-- Deactivate User -->
              <v-btn v-if="searchedUser.active" @click="confirmDeactivateUser" color="warning" class="mt-4" block>Deactivate User</v-btn>
              <!-- Activate User -->
              <v-btn v-if="!searchedUser.active" @click="confirmActivateUser(searchedUser.id)" color="success" class="mt-4" block>Activate User</v-btn>
              <!-- Send Notification -->
              <v-btn @click="showNotificationPrompt" color="info" class="mt-4" block>Send Notification</v-btn>
              <!-- Notification Message Prompt -->
              <v-dialog v-model="notificationPrompt" max-width="500px">
                <v-card>
                  <v-card-title class="headline">Send Notification</v-card-title>
                  <v-card-text>
                    <v-textarea v-model="notificationMessage" label="Message" outlined dense></v-textarea>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="notificationPrompt = false">Cancel</v-btn>
                    <v-btn @click="sendNotification" color="info">Send</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Deactivated Users Table -->
      <v-col cols="12">
        <v-card class="mx-auto my-5 floating-card" elevation="2">
          <v-card-title>Deactivated Users</v-card-title>
          <v-card-text>
            <v-simple-table class="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in deactivatedUsers" :key="user.id">
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <v-btn small @click="confirmActivateUser(user.id)">Activate</v-btn>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Donations by Users -->
      <v-col cols="12">
        <v-card class="mx-auto my-5 floating-card" elevation="2">
          <v-card-title>Donations by Users</v-card-title>
          <v-card-text>
            <v-simple-table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Donation Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="donation in donations" :key="donation.id">
                  <td>{{ donation.user }}</td>
                  <td>{{ donation.amount }}</td>
                  <td>{{ donation.date }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- Snackbar for Notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" top right>
      {{ snackbar.message }}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
    <!-- Confirm Deactivation Dialog -->
    <v-dialog v-model="confirmDeactivateDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirm Deactivation</v-card-title>
        <v-card-text>Are you sure you want to deactivate this user?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="confirmDeactivateDialog = false">Cancel</v-btn>
          <v-btn @click="deactivateUser" color="warning">Deactivate</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Confirm Activation Dialog -->
    <v-dialog v-model="confirmActivateDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirm Activation</v-card-title>
        <v-card-text>Are you sure you want to activate this user?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="confirmActivateDialog = false">Cancel</v-btn>
          <v-btn @click="activateUser(confirmActivateDialogUserId)" color="success">Activate</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue';

export default {
  name: 'ManageUsers',
  components: {
    HighchartsVue
  },
  setup() {
    const db = getFirestore();
    const auth = getAuth();
    const users = ref([]);
    const children = ref([]);
    const userCount = ref(0);
    const childrenCount = ref(0);
    const donations = ref([]);
    const snackbar = ref({
      show: false,
      message: '',
      color: ''
    });

    const searchUserId = ref('');
    const searchedUser = ref(null);

    const notificationPrompt = ref(false);
    const notificationMessage = ref('');

    const confirmDeactivateDialog = ref(false);
    const confirmActivateDialog = ref(false);
    const confirmActivateDialogUserId = ref('');

    const loadUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        users.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        userCount.value = users.value.length;
        setTimeout(updateChartOptions, 500); // Add a delay before updating chart options
      } catch (error) {
        snackbar.value = { show: true, message: 'Error loading users: ' + error.message, color: 'error' };
      }
    };

    const loadChildren = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'children'));
        children.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        childrenCount.value = children.value.length;
        setTimeout(updateChartOptions, 500); // Add a delay before updating chart options
      } catch (error) {
        snackbar.value = { show: true, message: 'Error loading children: ' + error.message, color: 'error' };
      }
    };

    const loadDonations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'donations'));
        donations.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        snackbar.value = { show: true, message: 'Error loading donations: ' + error.message, color: 'error' };
      }
    };

    const searchUserById = async () => {
      const userDoc = await getDoc(doc(db, 'users', searchUserId.value));
      if (userDoc.exists()) {
        searchedUser.value = { id: userDoc.id, ...userDoc.data() };
      } else {
        snackbar.value = { show: true, message: 'User not found', color: 'error' };
      }
    };

    const resetPassword = async () => {
      try {
        await sendPasswordResetEmail(auth, searchedUser.value.email);
        snackbar.value = { show: true, message: 'Password reset email sent', color: 'success' };
      } catch (error) {
        snackbar.value = { show: true, message: 'Error resetting password: ' + error.message, color: 'error' };
      }
    };

    const confirmDeactivateUser = () => {
      confirmDeactivateDialog.value = true;
    };

    const deactivateUser = async () => {
      try {
        await updateDoc(doc(db, 'users', searchedUser.value.id), { active: false });
        snackbar.value = { show: true, message: 'User deactivated successfully', color: 'warning' };
        confirmDeactivateDialog.value = false;
        loadUsers();
      } catch (error) {
        snackbar.value = { show: true, message: 'Error deactivating user: ' + error.message, color: 'error' };
      }
    };

    const confirmActivateUser = (userId) => {
      confirmActivateDialogUserId.value = userId;
      confirmActivateDialog.value = true;
    };

    const activateUser = async (userId) => {
      try {
        await updateDoc(doc(db, 'users', userId), { active: true });
        snackbar.value = { show: true, message: 'User activated successfully', color: 'success' };
        confirmActivateDialog.value = false;
        loadUsers();
      } catch (error) {
        snackbar.value = { show: true, message: 'Error activating user: ' + error.message, color: 'error' };
      }
    };

    const sendNotification = async () => {
      try {
        await updateDoc(doc(db, 'users', searchUserId.value), { notification: notificationMessage.value });
        snackbar.value = { show: true, message: 'Notification sent successfully', color: 'info' };
        notificationPrompt.value = false;
      } catch (error) {
        snackbar.value = { show: true, message: 'Error sending notification: ' + error.message, color: 'error' };
      }
    };

    const showNotificationPrompt = () => {
      notificationPrompt.value = true;
    };

    const currentUsers = computed(() => {
      return users.value.filter(user => user.active).map(user => ({ id: user.id, name: user.name, email: user.email }));
    });

    const deactivatedUsers = computed(() => {
      return users.value.filter(user => !user.active).map(user => ({ id: user.id, name: user.name, email: user.email }));
    });

    const chartOptions = ref(null);

    const updateChartOptions = () => {
      chartOptions.value = {
        chart: {
          type: 'line'
        },
        title: {
          text: 'User and Children Statistics'
        },
        series: [
          {
            name: 'Users',
            data: [userCount.value]
          },
          {
            name: 'Children',
            data: [childrenCount.value]
          }
        ]
      };
    };

    onMounted(() => {
      loadUsers();
      loadChildren();
      loadDonations();
    });

    return {
      userCount,
      childrenCount,
      users,
      children,
      donations,
      currentUsers,
      deactivatedUsers,
      chartOptions,
      searchUserId,
      searchedUser,
      notificationPrompt,
      notificationMessage,
      confirmDeactivateDialog,
      confirmActivateDialog,
      confirmActivateDialogUserId,
      searchUserById,
      resetPassword,
      deactivateUser,
      confirmDeactivateUser,
      activateUser,
      confirmActivateUser,
      sendNotification,
      showNotificationPrompt,
      snackbar
    };
  }
};
</script>

<style scoped>
.v-card {
  margin: 20px;
  padding: 20px;
}

.floating-card {
  background-color: #f5f5f5;
}

.v-text-field,
.v-select,
.v-file-input {
  margin-bottom: 10px;
}

.v-btn {
  margin-top: 10px;
}

.v-avatar img {
  border-radius: 50%;
}

.user-table th,
.user-table td {
  padding: 16px 24px;
  text-align: left;
  vertical-align: middle;
}

.user-table th {
  background-color: #f5f5f5;
}

.user-table tbody tr:nth-child(odd) {
  background-color: #f9f9f9;
}
</style>
