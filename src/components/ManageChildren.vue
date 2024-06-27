<template>
  <v-container>
    <v-row>
      <!-- Manage Children Title and Total Count -->
      <v-col cols="12">
        <v-card class="mx-auto my-5" elevation="2">
          <v-card-title class="d-flex justify-center">
            <h2>Manage Children</h2>
          </v-card-title>
          <v-card-text class="text-center">
            <p>Total children: {{ children.length }}</p>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Search, Edit, and Delete Section -->
      <v-col cols="12" md="6">
        <v-card class="mx-auto my-5 floating-card" elevation="2">
          <v-card-title>Search Child for Editing or Deleting</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="searchEditQuery"
              label="Enter Child ID..."
              prepend-inner-icon="fas fa-search"
              outlined
              dense
            ></v-text-field>
            <v-btn @click="searchChildById" color="primary" class="mt-4" block>Search</v-btn>
            <form v-if="isEditing" @submit.prevent="handleSubmit">
              <v-text-field v-model="child.name" label="Name" required></v-text-field>
              <v-text-field v-model="child.address" label="Address" required></v-text-field>
              <v-text-field v-model="child.age" label="Age" type="number" required></v-text-field>
              <v-select v-model="child.parents" :items="['known', 'unknown']" label="Parents" required></v-select>
              <v-select v-model="child.connectionStatus" :items="['unknown', 'pending', 'confirmed']" label="Connection Status" required></v-select>
              <v-file-input @change="handleFileChange" label="Upload Photo"></v-file-input>
              <v-btn type="submit" color="primary" class="mt-4" block>Update Child</v-btn>
            </form>
            <v-btn v-if="isEditing" @click="confirmDeleteChild(child.id)" color="error" class="mt-4" block>Delete Child</v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Add Child Form -->
      <v-col cols="12" md="6">
        <v-card class="mx-auto my-5 floating-card" elevation="2">
          <v-card-title>Add Child</v-card-title>
          <v-card-text>
            <form @submit.prevent="handleSubmit">
              <v-text-field v-model="child.name" label="Name" required></v-text-field>
              <v-text-field v-model="child.address" label="Address" required></v-text-field>
              <v-text-field v-model="child.age" label="Age" type="number" required></v-text-field>
              <v-select v-model="child.parents" :items="['known', 'unknown']" label="Parents" required></v-select>
              <v-select v-model="child.connectionStatus" :items="['unknown', 'pending', 'confirmed']" label="Connection Status" required></v-select>
              <v-file-input @change="handleFileChange" label="Upload Photo" required></v-file-input>
              <v-btn type="submit" color="primary" class="mt-4" block>Add Child</v-btn>
            </form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Search Results Table -->
      <v-col cols="12" v-if="filteredChildren.length">
        <v-card class="mx-auto my-5 floating-card" elevation="2">
          <v-card-title>Search Results</v-card-title>
          <v-card-text>
            <v-simple-table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Age</th>
                  <th>Parents</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(child, index) in filteredChildren" :key="index">
                  <td>{{ child.name }}</td>
                  <td>{{ child.address }}</td>
                  <td>{{ child.age }}</td>
                  <td>{{ child.parents }}</td>
                  <td>
                    <v-btn small @click="searchChildByIdForEdit(child.id)">Edit</v-btn>
                    <v-btn small color="error" @click="confirmDeleteChild(child.id)">Delete</v-btn>
                  </td>
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
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export default {
  name: 'ManageChildren',
  setup() {
    const db = getFirestore();
    const storage = getStorage();
    const children = ref([]);
    const child = ref({ id: '', name: '', address: '', age: '', parents: 'known', connectionStatus: 'unknown', photoUrl: '' });
    const searchQuery = ref('');
    const searchEditQuery = ref('');
    const isEditing = ref(false);
    const editingIndex = ref(null);
    const file = ref(null);
    const snackbar = ref({
      show: false,
      message: '',
      color: ''
    });

    const loadChildren = async () => {
      const querySnapshot = await getDocs(collection(db, 'children'));
      children.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    const handleFileChange = (e) => {
      file.value = e.target.files[0];
    };

    const handleSubmit = async () => {
      if (isEditing.value) {
        await updateChild();
      } else {
        await addChild();
      }
      resetForm();
    };

    const addChild = async () => {
      if (file.value) {
        const photoRef = storageRef(storage, `children_photos/${file.value.name}`);
        await uploadBytes(photoRef, file.value);
        child.value.photoUrl = await getDownloadURL(photoRef);
      }
      const docRef = await addDoc(collection(db, 'children'), child.value);
      await updateDoc(docRef, { id: docRef.id });
      child.value.id = docRef.id;
      snackbar.value = { show: true, message: 'Child added successfully', color: 'success' };
      loadChildren();
    };

    const updateChild = async () => {
      const childRef = doc(db, 'children', child.value.id);
      if (file.value) {
        const photoRef = storageRef(storage, `children_photos/${file.value.name}`);
        await uploadBytes(photoRef, file.value);
        child.value.photoUrl = await getDownloadURL(photoRef);
      }
      await updateDoc(childRef, child.value);
      snackbar.value = { show: true, message: 'Child updated successfully', color: 'success' };
      loadChildren();
    };

    const deleteChild = async (id) => {
      const childRef = doc(db, 'children', id);
      await deleteDoc(childRef);
      snackbar.value = { show: true, message: 'Child deleted successfully', color: 'success' };
      loadChildren();
    };

    const confirmDeleteChild = (id) => {
      if (confirm(`Are you sure you want to delete child with ID ${id}?`)) {
        deleteChild(id);
      }
    };

    const searchChildById = async () => {
      const docRef = doc(db, 'children', searchEditQuery.value);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        child.value = { id: docRef.id, ...data };
        isEditing.value = true;
        editingIndex.value = children.value.findIndex(c => c.id === searchEditQuery.value);
      } else {
        snackbar.value = { show: true, message: 'No such document!', color: 'error' };
      }
    };

    const searchChildByIdForEdit = async (id) => {
      const docRef = doc(db, 'children', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        child.value = { id: docRef.id, ...data };
        isEditing.value = true;
        editingIndex.value = children.value.findIndex(c => c.id === id);
      } else {
        snackbar.value = { show: true, message: 'No such document!', color: 'error' };
      }
    };

    const resetForm = () => {
      child.value = { id: '', name: '', address: '', age: '', parents: 'known', connectionStatus: 'unknown', photoUrl: '' };
      isEditing.value = false;
      editingIndex.value = null;
      file.value = null;
    };

    const searchChildren = () => {
      if (!searchQuery.value) return children.value;
      return children.value.filter(child =>
        Object.values(child).some(value =>
          value.toString().toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      );
    };

    onMounted(() => {
      loadChildren();
    });

    return {
      children,
      child,
      searchQuery,
      searchEditQuery,
      isEditing,
      editingIndex,
      file,
      handleSubmit,
      handleFileChange,
      deleteChild,
      confirmDeleteChild,
      searchChildById,
      searchChildByIdForEdit,
      searchChildren,
      filteredChildren: computed(() => searchChildren()),
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
</style>
