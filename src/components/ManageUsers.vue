<template>
  <v-container>
    <v-row>
      <!-- Manage Users Title and Total Count -->
      <v-col cols="12">
        <v-card class="mx-auto my-5 floating-card" elevation="2">
          <v-card-title class="d-flex justify-center align-center">
            <v-icon class="mr-2">fas fa-users</v-icon>
            <h2 class="title-text">Manage Users</h2>
          </v-card-title>
          <v-card-text class="text-center">
            <v-chip class="ma-2" color="primary" text-color="white">
              <v-icon left>fas fa-user</v-icon> Total users: {{ userCount }}
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Current Users -->
      <v-col cols="12">
        <v-card class="mx-auto my-5 floating-card" elevation="2">
          <v-card-title>
            <v-row>
              <v-col cols="6">
                <h3 class="title-text">Current Users</h3>
              </v-col>
              <v-col cols="6" class="d-flex justify-end">
                <v-text-field 
                  v-model="searchUserName" 
                  label="Search by Name" 
                  prepend-inner-icon="fas fa-search" 
                  @input="searchUserByName" 
                  outlined 
                  dense 
                  clearable>
                </v-text-field>
                <v-btn v-if="searchUserName" @click="clearSearch" color="primary" class="ml-2">
                  Show All
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-data-table :headers="userHeaders" :items="paginatedUsers" class="elevation-1" item-key="id" :items-per-page="5">
              <template v-slot:item.actions="{ item }">
                <v-btn small color="warning" @click="promptDeactivateUser(item)" v-if="item.active">Deactivate</v-btn>
                <v-btn small color="success" @click="promptActivateUser(item)" v-else>Activate</v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Admin Actions Log -->
      <v-col cols="12">
        <v-card class="mx-auto my-5 floating-card" elevation="2">
          <v-card-title>
            <h3 class="title-text">Admin Actions Log</h3>
          </v-card-title>
          <v-card-text>
            <v-data-table :headers="actionHeaders" :items="filteredAdminActions" class="elevation-1" item-key="id" :items-per-page="5">
              <template v-slot:item.timestamp="{ item }">
                {{ new Date(item.timestamp.seconds * 1000).toLocaleString() }}
              </template>
              <template v-slot:item.username="{ item }">
                {{ item.username }}
              </template>
              <template v-slot:item.comment="{ item }">
                {{ item.comment }}
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Snackbar for Notifications -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" top right>
        {{ snackbar.message }}
        <v-btn text @click="snackbar.show = false">Close</v-btn>
      </v-snackbar>
      
      <!-- Confirm Deactivation Dialog -->
      <v-dialog v-model="confirmDeactivateDialog" max-width="500px">
        <v-card>
          <v-card-title class="headline">Confirm Deactivation</v-card-title>
          <v-card-text>
            <v-textarea v-model="adminComment" label="Reason for deactivation" outlined dense></v-textarea>
            Are you sure you want to deactivate this user?
          </v-card-text>
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
          <v-card-text>
            <v-textarea v-model="adminComment" label="Reason for activation" outlined dense></v-textarea>
            Are you sure you want to activate this user?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="confirmActivateDialog = false">Cancel</v-btn>
            <v-btn @click="activateUser" color="success">Activate</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';

export default {
  name: 'ManageUsers',
  setup() {
    const db = getFirestore();
    const users = ref([]);
    const userCount = ref(0);
    const adminActions = ref([]);
    const snackbar = ref({
      show: false,
      message: '',
      color: ''
    });

    const searchUserName = ref('');
    const selectedUser = ref(null);
    const adminComment = ref('');

    const confirmDeactivateDialog = ref(false);
    const confirmActivateDialog = ref(false);

    const loadUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        users.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        userCount.value = users.value.length;
      } catch (error) {
        snackbar.value = { show: true, message: 'Error loading users: ' + error.message, color: 'error' };
      }
    };

    const loadAdminActions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'adminActions'));
        adminActions.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        snackbar.value = { show: true, message: 'Error loading admin actions: ' + error.message, color: 'error' };
      }
    };

    const searchUserByName = async () => {
      try {
        if (searchUserName.value.trim() === '') {
          loadUsers(); // If search is empty, load all users
        } else {
          const querySnapshot = await getDocs(collection(db, 'users'));
          users.value = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(user => user.name.toLowerCase().includes(searchUserName.value.toLowerCase()));
        }
      } catch (error) {
        snackbar.value = { show: true, message: 'Error searching users: ' + error.message, color: 'error' };
      }
    };

    const clearSearch = () => {
      searchUserName.value = '';
      loadUsers();
    };

    const promptDeactivateUser = (user) => {
      selectedUser.value = user;
      confirmDeactivateDialog.value = true;
    };

    const promptActivateUser = (user) => {
      selectedUser.value = user;
      confirmActivateDialog.value = true;
    };

    const deactivateUser = async () => {
      try {
        const userDoc = doc(db, 'users', selectedUser.value.id);
        await updateDoc(userDoc, { active: false });
        await addAdminAction('deactivate');
        snackbar.value = { show: true, message: 'User deactivated successfully', color: 'warning' };
        confirmDeactivateDialog.value = false;
        loadUsers();
      } catch (error) {
        snackbar.value = { show: true, message: 'Error deactivating user: ' + error.message, color: 'error' };
      }
    };

    const activateUser = async () => {
      try {
        const userDoc = doc(db, 'users', selectedUser.value.id);
        await updateDoc(userDoc, { active: true });
        await addAdminAction('activate');
        snackbar.value = { show: true, message: 'User activated successfully', color: 'success' };
        confirmActivateDialog.value = false;
        loadUsers();
      } catch (error) {
        snackbar.value = { show: true, message: 'Error activating user: ' + error.message, color: 'error' };
      }
    };

    const addAdminAction = async (action) => {
      try {
        await addDoc(collection(db, 'adminActions'), {
          userId: selectedUser.value.id,
          username: selectedUser.value.name, // Add the username field
          action: action,
          comment: adminComment.value,
          timestamp: new Date()
        });
        loadAdminActions();
      } catch (error) {
        snackbar.value = { show: true, message: 'Error logging admin action: ' + error.message, color: 'error' };
      }
    };

    const userHeaders = [
      { text: 'Name', value: 'name' },
      { text: 'Email', value: 'email' },
      { text: 'Actions', value: 'actions', sortable: false }
    ];

    const actionHeaders = [
      { text: 'Username', value: 'username' }, // Add the username field
      { text: 'Action', value: 'action' },
      { text: 'Reason', value: 'comment' }, // Title for reason
      { text: 'Timestamp', value: 'timestamp' }
    ];

    const filteredUsers = computed(() => {
      return users.value.filter(user => 
        user.name.toLowerCase().includes(searchUserName.value.toLowerCase()));
    });

    const paginatedUsers = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage.value;
      const endIndex = startIndex + itemsPerPage.value;
      return filteredUsers.value.slice(startIndex, endIndex);
    });

    const filteredAdminActions = computed(() => {
      const recentActions = {};
      if (Array.isArray(adminActions.value)) {
        adminActions.value.forEach(action => {
          if (!recentActions[action.userId] || action.timestamp.seconds > recentActions[action.userId].timestamp.seconds) {
            recentActions[action.userId] = action;
          }
        });
      }
      return Object.values(recentActions);
    });

    const currentPage = ref(1);
    const itemsPerPage = ref(5);

    onMounted(() => {
      loadUsers();
      loadAdminActions();
    });

    return {
      userCount,
      users,
      adminActions,
      filteredAdminActions,
      searchUserName,
      selectedUser,
      adminComment,
      confirmDeactivateDialog,
      confirmActivateDialog,
      userHeaders,
      actionHeaders,
      filteredUsers,
      paginatedUsers,
      currentPage,
      itemsPerPage,
      promptDeactivateUser,
      promptActivateUser,
      deactivateUser,
      activateUser,
      clearSearch,
      snackbar,
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
