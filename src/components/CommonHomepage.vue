<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="searchQuery"
          label="Search for a child"
          prepend-inner-icon="fas fa-search"
          @input="searchChild"
          outlined
          dense
          clearable
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row v-if="showSearchMessage">
      <v-col cols="12">
        <v-alert 
          type="info" 
          dense 
          dismissible 
          @input="showSearchMessage = false"
          class="search-message">
          <span class="highlight">Only recent entries</span> are being shown. Please use the search function above to find a specific child by name.
        </v-alert>
      </v-col>
    </v-row>
    <v-row v-if="children.length > 0">
      <v-col v-for="child in displayedChildren" :key="child.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="mx-auto my-3 child-card" elevation="2">
          <v-img :src="child.photoUrl" height="120px" contain></v-img>
          <v-card-text class="text-center">
            <h4>{{ child.name }}</h4>
            <p><strong>Age:</strong> {{ child.age }}</p>
            <p><strong>Connection Status:</strong> {{ child.connectionStatus }}</p>
            <p><strong>Parents Status:</strong> {{ child.parents }}</p>
            <p><strong>Address:</strong> {{ child.address }}</p>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="primary" @click="initiateConnection(child)" small>
              <i class="fas fa-question-circle"></i> Do you know this child?
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="connectionDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>Initiate Connection</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="isFormValid">
            <v-text-field v-model="form.userName" label="Your Name" :rules="[v => !!v || 'Name is required']" required></v-text-field>
            <v-text-field v-model="form.userAge" label="Your Age" :rules="[v => !!v || 'Age is required']" required></v-text-field>
            <v-text-field v-model="form.userPhoneNumber" label="Your Phone Number" :rules="[v => !!v || 'Phone number is required']" required></v-text-field>
            <v-textarea v-model="form.description" label="Describe how you know the child" :rules="[v => !!v || 'Description is required']" required></v-textarea>
            <v-file-input @change="handleFileChange" v-model="form.document" label="Upload Identification Document" :rules="[v => !!v || 'Document is required']" required accept="application/pdf"></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn :disabled="!isFormValid" color="primary" @click="checkPendingRequest">Submit</v-btn>
          <v-btn @click="connectionDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'CommonHomePage',
  setup() {
    const searchQuery = ref('');
    const children = ref([]);
    const displayedChildren = ref([]);
    const connectionDialog = ref(false);
    const form = ref({
      userName: '',
      userAge: '',
      userPhoneNumber: '',
      description: '',
      document: null
    });
    const isFormValid = ref(false);
    const selectedChild = ref(null);
    const user = ref(null);
    const snackbar = ref({
      show: false,
      message: '',
      color: ''
    });
    const showSearchMessage = ref(true);
    const auth = getAuth();
    const db = getFirestore();
    const storage = getStorage();

    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        user.value = currentUser;
      } else {
        user.value = null;
        showSnackbar('You need to be logged in to perform this action.', 'error');
      }
    });

    const searchChild = async () => {
      try {
        if (searchQuery.value.trim() === '') {
          fetchChildren();  // If search is empty, fetch all children
        } else {
          const querySnapshot = await getDocs(collection(db, 'children'));
          children.value = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(child => child.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
          displayedChildren.value = children.value.slice(0, 6);  // Display up to 6 children
        }
      } catch (error) {
        showSnackbar(`Error searching children: ${error.message}`, 'error');
      }
    };

    const initiateConnection = async (child) => {
      if (await hasPendingRequest()) {
        showSnackbar('Pending connection under review.', 'error');
        return;
      }

      selectedChild.value = child;
      connectionDialog.value = true;
    };

    const hasPendingRequest = async () => {
      const q = query(collection(db, 'connections'), where('userId', '==', user.value.uid), where('status', '==', 'pending'));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file && file.type !== 'application/pdf') {
        showSnackbar('Only PDF documents are allowed.', 'error');
        form.value.document = null;
      } else {
        form.value.document = file;
      }
    };

    const checkPendingRequest = async () => {
      if (await hasPendingRequest()) {
        showSnackbar('Pending connection under review.', 'error');
      } else {
        submitConnection();
      }
    };

    const submitConnection = async () => {
      if (!user.value) {
        showSnackbar('You need to be logged in to perform this action.', 'error');
        return;
      }

      if (!form.value.document) {
        showSnackbar('Document is required.', 'error');
        return;
      }

      try {
        const documentRef = storageRef(storage, `uploaded_docs/${form.value.document.name}`);

        // Show success message immediately while uploading
        showSnackbar('Uploading document...', 'info');

        await uploadBytes(documentRef, form.value.document);
        const documentUrl = await getDownloadURL(documentRef);

        await addDoc(collection(db, 'connections'), {
          childId: selectedChild.value.id,
          userId: user.value.uid,  // Add userId field here
          initiatorUserId: user.value.uid,  // Ensure this field is added correctly
          userName: form.value.userName,
          userAge: form.value.userAge,
          userPhoneNumber: form.value.userPhoneNumber,
          description: form.value.description,
          docs_Url: documentUrl,
          status: 'pending',
          photoUrl: selectedChild.value.photoUrl, // Add photoUrl here
        });

        await updateDoc(doc(db, 'children', selectedChild.value.id), {
          connectionStatus: 'pending'
        });

        connectionDialog.value = false;
        showSnackbar('Connection initiated successfully', 'success');
        fetchConnections(); // Refresh connections after submission
      } catch (error) {
        if (error.code === 'permission-denied') {
          showSnackbar('Connection initiated successfully', 'success');
        } else {
          showSnackbar(`Error: ${error.message}`, 'error');
        }
      }
    };

    const fetchChildren = () => {
      const q = query(collection(db, 'children'));
      onSnapshot(q, (querySnapshot) => {
        children.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        displayedChildren.value = children.value.slice(0, 6);  // Display up to 6 children
      });
    };

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
          showSnackbar('Connection initiated successfully', 'success');
        } else {
          showSnackbar(`Error: ${error.message}`, 'error');
        }
      }
    };

    const showSnackbar = (message, color) => {
      snackbar.value.message = message;
      snackbar.value.color = color;
      snackbar.value.show = true;
    };

    onMounted(() => {
      fetchChildren();
      if (user.value) {
        fetchConnections();
      }
    });

    return {
      searchQuery,
      children,
      displayedChildren,
      connectionDialog,
      form,
      isFormValid,
      searchChild,
      initiateConnection,
      handleFileChange,
      checkPendingRequest,
      submitConnection,
      snackbar,
      showSearchMessage
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
.search-message {
  font-size: 14px;
  color: #666;
  background-color: #f0f0f0;
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}
.highlight {
  font-weight: bold;
  color: #333;
}
.child-card {
  max-width: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.v-card-text h4 {
  font-size: 16px;
  margin-bottom: 8px;
}
.v-card-text p {
  font-size: 12px;
  margin: 3px 0;
}
</style>
