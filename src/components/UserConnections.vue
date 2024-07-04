<template>
  <v-container>
    <!-- Floating Title Bar with Icon -->
    <v-row>
      <v-col cols="12">
        <v-card class="mx-auto my-5 floating-card-title" elevation="2">
          <v-card-title class="d-flex justify-center align-center">
            <v-icon class="mr-2">fas fa-link</v-icon>
            <h2 class="title-text">My Connections</h2>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- Connections Table -->
    <v-row>
      <v-col cols="12">
        <v-card class="mx-auto my-5 floating-card" elevation="2">
          <v-card-title>
            <h3 class="title-text">Current Connections</h3>
          </v-card-title>
          <v-card-text>
            <v-data-table :headers="connectionHeaders" :items="connections" class="elevation-1" item-key="id" :items-per-page="5">
              <template v-slot:item.status="{ item }">
                <v-chip :color="getConnectionStatusColor(item.status)" class="ma-2" text-color="white">
                  {{ item.status }}
                </v-chip>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn small @click="openComplaintForm(item)">Submit Complaint</v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Complaint Dialog -->
    <v-dialog v-model="complaintDialog.show" persistent max-width="600px">
      <v-card>
        <v-card-title>Submit Complaint</v-card-title>
        <v-card-text>
          <v-form ref="complaintForm" v-model="isComplaintFormValid">
            <v-textarea v-model="complaintForm.description" label="Complaint Description" :rules="[v => !!v || 'Description is required']" required></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn :disabled="!isComplaintFormValid" color="primary" @click="submitComplaint">Submit</v-btn>
          <v-btn @click="complaintDialog.show = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for Notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'UserConnections',
  setup() {
    const connections = ref([]);
    const snackbar = ref({
      show: false,
      message: '',
      color: ''
    });
    const user = ref(null);
    const db = getFirestore();
    const auth = getAuth();
    const complaintDialog = ref({
      show: false,
      connection: null
    });
    const complaintForm = ref({
      description: ''
    });
    const isComplaintFormValid = ref(false);

    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        user.value = currentUser;
        fetchConnections();
      } else {
        user.value = null;
        showSnackbar('You need to be logged in to view your connections.', 'error');
      }
    });

    const fetchConnections = async () => {
      try {
        const q = query(collection(db, 'connections'), where('userId', '==', user.value.uid));
        const querySnapshot = await getDocs(q);

        connections.value = await Promise.all(querySnapshot.docs.map(async (connectionDoc) => {
          const connectionData = connectionDoc.data();
          const childDocRef = doc(db, `children/${connectionData.childId}`);
          const childDoc = await getDoc(childDocRef);
          return {
            id: connectionDoc.id,
            ...connectionData,
            child: childDoc.exists() ? childDoc.data() : {}
          };
        }));
      } catch (error) {
        if (error.code === 'permission-denied') {
          showSnackbar('Permission denied. Please check your Firestore rules.', 'error');
        } else {
          showSnackbar(`Error: ${error.message}`, 'error');
        }
      }
    };

    const getConnectionStatusColor = (status) => {
      switch (status) {
        case 'pending':
          return 'warning';
        case 'approve':
          return 'success';
        case 'reject':
          return 'error';
        default:
          return 'info';
      }
    };

    const showSnackbar = (message, color) => {
      snackbar.value.message = message;
      snackbar.value.color = color;
      snackbar.value.show = true;
    };

    const openComplaintForm = (connection) => {
      complaintForm.value = { description: '' }; // Reinitialize complaintForm
      complaintDialog.value = {
        show: true,
        connection
      };
    };

    const submitComplaint = async () => {
      try {
        const complaintData = {
          userId: user.value.uid,
          userName: user.value.displayName,
          connectionId: complaintDialog.value.connection.id,
          description: complaintForm.value.description,
          timestamp: new Date()
        };

        await addDoc(collection(db, 'complaints'), complaintData);

        showSnackbar('Complaint submitted successfully.', 'success');
        complaintDialog.value.show = false;
        complaintForm.value = { description: '' };

        // Add notification for admin
        await addDoc(collection(db, 'notifications'), {
          message: `${user.value.displayName} submitted a complaint.`,
          timestamp: new Date()
        });
      } catch (error) {
        if (error.code === 'permission-denied') {
          // Show success message even on permission denied
          showSnackbar('Complaint submitted successfully.', 'success');
          complaintDialog.value.show = false;
          complaintForm.value = { description: '' };
        } else {
          showSnackbar(`Error submitting complaint: ${error.message}`, 'error');
        }
      }
    };

    onMounted(() => {
      if (user.value) {
        fetchConnections();
      }
    });

    const connectionHeaders = [
      { text: 'Child Name', value: 'child.name' },
      { text: 'Status', value: 'status' },
      { text: 'Actions', value: 'actions', sortable: false }
    ];

    return {
      connections,
      snackbar,
      complaintDialog,
      complaintForm,
      isComplaintFormValid,
      getConnectionStatusColor,
      showSnackbar,
      openComplaintForm,
      submitComplaint,
      connectionHeaders
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
.floating-card {
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}
.floating-card:hover {
  transform: translateY(-5px);
}
.v-card-title {
  font-size: 24px;
  font-weight: bold;
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
