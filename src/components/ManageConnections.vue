<template>
  <v-container>
    <h2>Manage Connections</h2>
    <v-row v-if="connections.length > 0">
      <v-col v-for="connection in connections" :key="connection.id" cols="12" md="4">
        <v-card class="mx-auto my-3" elevation="2" style="background-color: #f0f0f0; border-radius: 10px;">
          <v-card-text>
            <h3>User Details</h3>
            <p><strong>Name:</strong> {{ connection.userName }}</p>
            <p><strong>Age:</strong> {{ connection.userAge }}</p>
            <p><strong>Phone Number:</strong> {{ connection.userPhoneNumber }}</p>
            <p><strong>Description:</strong> {{ connection.description }}</p>
            <p><strong>Document:</strong> <a :href="connection.docs_Url" target="_blank">View Document</a></p>
          </v-card-text>
          <v-card-text>
            <h3>Child Details</h3>
            <v-img :src="connection.child.photoUrl" height="200px" contain></v-img>
            <p><strong>Name:</strong> {{ connection.child.name }}</p>
            <p><strong>Age:</strong> {{ connection.child.age }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="success" @click="confirmConnection(connection)">Confirm</v-btn>
            <v-btn color="error" @click="rejectConnection(connection)">Reject</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <h2>Admin Actions</h2>
    <v-data-table
      :headers="actionHeaders"
      :items="actions"
      class="elevation-1"
    ></v-data-table>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, query, getDocs, updateDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';

export default {
  name: 'ManageConnections',
  setup() {
    const connections = ref([]);
    const actions = ref([]);
    const snackbar = ref({
      show: false,
      message: '',
      color: ''
    });
    const db = getFirestore();

    const actionHeaders = [
      { text: 'User Name', value: 'userName' },
      { text: 'Phone Number', value: 'userPhoneNumber' },
      { text: 'Action', value: 'adminAction' },
      { text: 'Timestamp', value: 'adminActionTimestamp' },
    ];

    const fetchConnections = async () => {
      try {
        const q = query(collection(db, 'connections'));
        const querySnapshot = await getDocs(q);

        connections.value = await Promise.all(querySnapshot.docs.map(async (connectionDoc) => {
          const connectionData = connectionDoc.data();
          const childId = connectionData.childId;
          if (!childId) {
            throw new Error(`Missing childId for connection ${connectionDoc.id}`);
          }
          console.log(`Fetching child document for childId: ${childId}`);
          const childDocRef = doc(db, `children/${childId}`);
          const childDoc = await getDoc(childDocRef);
          return {
            id: connectionDoc.id,
            ...connectionData,
            child: childDoc.exists() ? childDoc.data() : {}
          };
        }));

        // Populate actions based on connections
        actions.value = connections.value.map(conn => ({
          userName: conn.userName,
          userPhoneNumber: conn.userPhoneNumber,
          adminAction: conn.adminAction || 'Pending',
          adminActionTimestamp: conn.adminActionTimestamp ? conn.adminActionTimestamp.toDate().toLocaleString() : 'N/A'
        }));
      } catch (error) {
        if (error.code === 'permission-denied') {
          showSnackbar('Permission denied. Please check your Firestore rules.', 'error');
        } else {
          showSnackbar(`Error: ${error.message}`, 'error');
        }
      }
    };

    const confirmConnection = async (connection) => {
      try {
        await updateDoc(doc(db, 'connections', connection.id), {
          status: 'confirmed',
          adminAction: 'Confirmed',
          adminActionTimestamp: serverTimestamp()
        });
        await updateDoc(doc(db, 'children', connection.childId), {
          connectionStatus: 'confirmed'
        });
        showSnackbar('Connection confirmed successfully', 'success');
        fetchConnections();
      } catch (error) {
        showSnackbar(`Error: ${error.message}`, 'error');
      }
    };

    const rejectConnection = async (connection) => {
      try {
        await updateDoc(doc(db, 'connections', connection.id), {
          status: 'rejected',
          adminAction: 'Rejected',
          adminActionTimestamp: serverTimestamp()
        });
        await updateDoc(doc(db, 'children', connection.childId), {
          connectionStatus: 'rejected'
        });
        showSnackbar('Connection rejected successfully', 'success');
        fetchConnections();
      } catch (error) {
        showSnackbar(`Error: ${error.message}`, 'error');
      }
    };

    const showSnackbar = (message, color) => {
      snackbar.value.message = message;
      snackbar.value.color = color;
      snackbar.value.show = true;
    };

    onMounted(() => {
      fetchConnections();
    });

    return {
      connections,
      actions,
      snackbar,
      actionHeaders,
      confirmConnection,
      rejectConnection
    };
  }
};
</script>

<style scoped>
.v-img {
  border-radius: 10px;
  object-fit: cover;
}
.v-avatar img {
  border-radius: 10px;
}
.v-card {
  border-radius: 10px;
}
</style>
