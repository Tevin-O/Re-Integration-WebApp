<template>
  <v-container>
    <v-row>
      <!-- Manage Connections Title and Pending Count -->
      <v-col cols="12">
        <v-card class="mx-auto my-5 floating-card" elevation="2">
          <v-card-title class="d-flex justify-center align-center">
            <v-icon class="mr-2">fas fa-network-wired</v-icon>
            <h2 class="title-text">Manage Connections</h2>
          </v-card-title>
          <v-card-text class="text-center">
            <v-chip class="ma-2" color="primary" text-color="white">
              <v-icon left>fas fa-user-clock</v-icon> Pending connections: {{ pendingConnectionsCount }}
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Navigation Links -->
      <v-col cols="12" class="d-flex justify-center">
        <v-btn @click="fetchPendingConnections" color="primary" class="ma-2">
          <v-icon left>fas fa-eye</v-icon> Show Pending Connections
        </v-btn>
      </v-col>

      <!-- Pending Connections List -->
      <v-col cols="12">
        <v-card class="mx-auto my-5 floating-card" elevation="2">
          <v-card-title>
            <h3 class="title-text">Pending Connections</h3>
          </v-card-title>
          <v-card-text>
            <v-data-table :headers="connectionHeaders" :items="pendingConnections" class="elevation-1" item-key="id" :items-per-page="5">
              <template v-slot:item.actions="{ item }">
                <v-btn small @click="approveOrReject(item, 'approve')">Approve</v-btn>
                <v-btn small color="error" @click="approveOrReject(item, 'reject')">Reject</v-btn>
              </template>
              <template v-slot:item.user="{ item }">
                {{ item.userName }}
              </template>
              <template v-slot:item.phone="{ item }">
                {{ item.userPhoneNumber }}
              </template>
              <template v-slot:item.docs_Url="{ item }">
                <a :href="item.docs_Url" target="_blank">View Document</a>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Admin Logs -->
      <v-col cols="12">
        <v-card class="mx-auto my-5 floating-card" elevation="2">
          <v-card-title>
            <h3 class="title-text">Admin Logs</h3>
          </v-card-title>
          <v-card-text>
            <v-data-table :headers="logHeaders" :items="filteredAdminLogs" class="elevation-1" item-key="id" :items-per-page="5">
              <template v-slot:header>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Admin Comment</th>
                  <th>Timestamp</th>
                </tr>
              </template>
              <template v-slot:item.user="{ item }">
                {{ item.userName }}
              </template>
              <template v-slot:item.action="{ item }">
                <v-btn :color="item.action === 'approve' ? 'success' : 'error'" small>
                  {{ item.action.charAt(0).toUpperCase() + item.action.slice(1) }}
                </v-btn>
              </template>
              <template v-slot:item.timestamp="{ item }">
                {{ formatTimestamp(item.timestamp) }}
              </template>
              <template v-slot:item.comment="{ item }">
                {{ item.adminComment }}
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Comment Dialog for Approval/Rejection -->
    <v-dialog v-model="commentDialog.show" max-width="500px">
      <v-card>
        <v-card-title class="headline">{{ commentDialog.action === 'approve' ? 'Approve Connection' : 'Reject Connection' }}</v-card-title>
        <v-card-text>
          <v-textarea v-model="adminComment" label="Comment" outlined dense></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="commentDialog.show = false">Cancel</v-btn>
          <v-btn @click="handleApproval" color="primary">{{ commentDialog.action === 'approve' ? 'Approve' : 'Reject' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for Notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" top right>
      {{ snackbar.message }}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { getFirestore, collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'ManageConnections',
  setup() {
    const db = getFirestore();
    const auth = getAuth();
    const pendingConnections = ref([]);
    const pendingConnectionsCount = ref(0);
    const adminLogs = ref([]);
    const snackbar = ref({
      show: false,
      message: '',
      color: ''
    });
    const adminComment = ref('');
    const commentDialog = ref({
      show: false,
      action: '',
      connection: null
    });

    const user = ref(null);

    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        user.value = currentUser;
      } else {
        console.log("No user is signed in");
      }
    });

    const loadPendingConnections = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'connections'));
        pendingConnections.value = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(connection => connection.status === 'pending');
        pendingConnectionsCount.value = pendingConnections.value.length;
      } catch (error) {
        console.error('Error loading connections:', error);
        snackbar.value = {
          show: true,
          message: 'Error loading connections.',
          color: 'error'
        };
      }
    };

    const fetchPendingConnections = () => {
      loadPendingConnections();
    };

    const approveOrReject = (connection, action) => {
      if (action === 'approve' || action === 'reject') {
        commentDialog.value = {
          show: true,
          action,
          connection
        };
      } else {
        console.error('Invalid action');
      }
    };

    const handleApproval = async () => {
      const { connection, action } = commentDialog.value;
      const connectionRef = doc(db, 'connections', connection.id);
      
      try {
        await updateDoc(connectionRef, {
          status: action,
          adminComment: adminComment.value,
          adminAction: action,
          timestamp: new Date()
        });

        snackbar.value = {
          show: true,
          message: `Connection ${action}ed successfully`,
          color: 'success'
        };

        commentDialog.value.show = false;
        adminComment.value = '';
        loadPendingConnections();
        loadAdminLogs();
      } catch (error) {
        console.error('Error handling approval:', error);
        snackbar.value = {
          show: true,
          message: 'An error occurred while processing the request.',
          color: 'error'
        };
      }
    };

    const loadAdminLogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'connections'));
        adminLogs.value = querySnapshot.docs
          .map(doc => ({
            connectionId: doc.id,
            userName: doc.data().userName,
            action: doc.data().adminAction,
            adminComment: doc.data().adminComment,
            timestamp: doc.data().timestamp
          }))
          .filter(log => log.action); // Only include logs that have an action (approved/rejected)
      } catch (error) {
        console.error('Error loading admin logs:', error);
        snackbar.value = {
          show: true,
          message: 'Error loading admin logs.',
          color: 'error'
        };
      }
    };

    const formatTimestamp = (timestamp) => {
      const date = timestamp.toDate();
      return date.toLocaleString();
    };

    const connectionHeaders = [
      { text: 'Name', value: 'user' },
      { text: 'Phone Number', value: 'phone' },
      { text: 'Requested Date', value: 'requestedDate' },
      { text: 'Document Link', value: 'docs_Url', sortable: false },
      { text: 'Actions', value: 'actions', sortable: false }
    ];

    const logHeaders = [
      { text: 'User', value: 'userName' },
      { text: 'Action', value: 'action' },
      { text: 'Admin Comment', value: 'adminComment' },
      { text: 'Timestamp', value: 'timestamp' }
    ];

    const filteredAdminLogs = computed(() => {
      const recentActions = {};
      adminLogs.value.forEach(log => {
        if (!recentActions[log.connectionId] || log.timestamp.seconds > recentActions[log.connectionId].timestamp.seconds) {
          recentActions[log.connectionId] = log;
        }
      });
      return Object.values(recentActions);
    });

    onMounted(() => {
      loadPendingConnections();
      loadAdminLogs();
    });

    return {
      pendingConnections,
      pendingConnectionsCount,
      fetchPendingConnections,
      approveOrReject,
      handleApproval,
      adminComment,
      commentDialog,
      connectionHeaders,
      adminLogs,
      logHeaders,
      snackbar,
      filteredAdminLogs,
      formatTimestamp
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
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.floating-card:hover {
  transform: translateY(-5px);
}

.v-text-field,
.v-textarea {
  margin-bottom: 10px;
}

.v-btn {
  margin-top: 10px;
}

.v-avatar img {
  border-radius: 50%;
}

.v-data-table th,
.v-data-table td {
  padding: 8px;
  text-align: left;
  vertical-align: middle;
}

.v-data-table th {
  background-color: #f5f5f5;
}

.v-data-table tbody tr:nth-child(odd) {
  background-color: #f9f9f9;
}

.title-text {
  font-size: 24px;
  font-weight: bold;
}

.v-chip {
  font-size: 16px;
  font-weight: bold;
}
</style>
