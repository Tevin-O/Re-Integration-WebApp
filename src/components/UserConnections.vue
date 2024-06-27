<template>
  <v-container>
    <h2>My Connections</h2>
    <v-row v-if="connections.length > 0">
      <v-col v-for="connection in connections" :key="connection.id" cols="12" md="4">
        <v-card class="mx-auto my-3" elevation="2" style="background-color: #f0f0f0; border-radius: 10px;">
          <v-img :src="connection.child.photoUrl" height="200px" contain></v-img>
          <v-card-text class="text-center">
            <h3>{{ connection.child.name }}</h3>
            <p><strong>Age:</strong> {{ connection.child.age }}</p>
            <p><strong>Connection Status:</strong></p>
            <v-btn :color="getConnectionStatusColor(connection.status)" class="ma-2">
              {{ connection.status }}
            </v-btn>
            <p><strong>Parents Status:</strong> {{ connection.child.parents }}</p>
            <p><strong>Address:</strong> {{ connection.child.address }}</p>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" @click="copyEmail">
                  <i class="fas fa-envelope"></i>
                </v-btn>
              </template>
              <span>Write to us after 7 days without feedback</span>
            </v-tooltip>
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
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
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
        case 'confirmed':
          return 'success';
        case 'rejected':
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

    const copyEmail = () => {
      const email = 'tevin.omondi@strathmore.edu';
      navigator.clipboard.writeText(email).then(() => {
        showSnackbar('Email copied to clipboard.', 'success');
      }).catch(err => {
        showSnackbar('Failed to copy email.', 'error');
      });
    };

    onMounted(() => {
      if (user.value) {
        fetchConnections();
      }
    });

    return {
      connections,
      snackbar,
      getConnectionStatusColor,
      copyEmail
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
