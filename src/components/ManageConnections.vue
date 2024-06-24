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
            <v-btn color="success" @click="confirmConnection(connection.id)">Confirm</v-btn>
            <v-btn color="error" @click="rejectConnection(connection.id)">Reject</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, query, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';

export default {
  name: 'ManageConnections',
  setup() {
    const connections = ref([]);
    const snackbar = ref({
      show: false,
      message: '',
      color: ''
    });
    const db = getFirestore();

    const fetchConnections = async () => {
      try {
        const q = query(collection(db, 'connections'));
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

    const confirmConnection = async (id) => {
      try {
        await updateDoc(doc(db, 'connections', id), {
          status: 'confirmed'
        });
        showSnackbar('Connection confirmed successfully', 'success');
        fetchConnections();
      } catch (error) {
        showSnackbar(`Error: ${error.message}`, 'error');
      }
    };

    const rejectConnection = async (id) => {
      try {
        await updateDoc(doc(db, 'connections', id), {
          status: 'rejected'
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
      snackbar,
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
