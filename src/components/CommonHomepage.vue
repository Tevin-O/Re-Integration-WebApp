<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="searchQuery"
          label="Search for a child"
          prepend-inner-icon="fas fa-search"
          @input="searchChild"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row v-if="children.length > 0">
      <v-col v-for="child in children" :key="child.id" cols="12" md="4">
        <v-card class="mx-auto my-3" elevation="2" style="background-color: #f0f0f0; border-radius: 10px;">
          <v-img :src="child.photoUrl" height="200px" contain></v-img>
          <v-card-text class="text-center">
            <h3>{{ child.name }}</h3>
            <p><strong>Age:</strong> {{ child.age }}</p>
            <p><strong>Connection Status:</strong> {{ child.connectionStatus }}</p>
            <p><strong>Parents Status:</strong> {{ child.parents }}</p>
            <p><strong>Address:</strong> {{ child.address }}</p>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="primary" @click="initiateConnection(child)">
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
            <v-file-input @change="handleFileChange" v-model="form.document" label="Upload Identification Document" :rules="[v => !!v || 'Document is required']" required></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn :disabled="!isFormValid" color="primary" @click="submitConnection">Submit</v-btn>
          <v-btn @click="connectionDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    const file = ref(null);
    const user = ref(null);
    const auth = getAuth();
    const db = getFirestore();
    const storage = getStorage();

    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        user.value = currentUser;
      } else {
        user.value = null;
        alert('You need to be logged in to perform this action.');
      }
    });

    const searchChild = async () => {
      if (searchQuery.value.trim() === '') {
        fetchChildren();  // If search is empty, fetch all children
      } else {
        const q = query(collection(db, 'children'), where('name', '==', searchQuery.value.trim()));
        const querySnapshot = await getDocs(q);
        children.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    };

    const initiateConnection = (child) => {
      selectedChild.value = child;
      connectionDialog.value = true;
    };

    const handleFileChange = (e) => {
      form.value.document = e.target.files[0];
    };

    const submitConnection = async () => {
      if (!user.value) {
        alert('You need to be logged in to perform this action.');
        return;
      }

      if (!form.value.document) {
        alert('Document is required.');
        return;
      }

      const documentRef = storageRef(storage, `uploaded_docs/${form.value.document.name}`);
      await uploadBytes(documentRef, form.value.document);
      const documentUrl = await getDownloadURL(documentRef);

      await addDoc(collection(db, 'connections'), {
        childId: selectedChild.value.id,
        userName: form.value.userName,
        userAge: form.value.userAge,
        userPhoneNumber: form.value.userPhoneNumber,
        description: form.value.description,
        docs_Url: documentUrl,
        status: 'pending'
      });

      await updateDoc(doc(db, 'children', selectedChild.value.id), {
        connectionStatus: 'pending'
      });

      connectionDialog.value = false;
      alert('Connection initiated successfully');
    };

    const fetchChildren = () => {
      const q = query(collection(db, 'children'));
      onSnapshot(q, (querySnapshot) => {
        children.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      });
    };

    onMounted(() => {
      fetchChildren();
    });

    return {
      searchQuery,
      children,
      connectionDialog,
      form,
      isFormValid,
      file,
      searchChild,
      initiateConnection,
      handleFileChange,
      submitConnection
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
