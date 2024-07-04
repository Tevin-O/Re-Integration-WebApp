<template>
  <v-container>
    <v-row>
      <!-- Manage Children Title and Total Count -->
      <v-col cols="12">
        <v-card class="mx-auto my-5 floating-card" elevation="2">
          <v-card-title class="d-flex justify-center align-center">
            <v-icon class="mr-2">fas fa-child</v-icon>
            <h2 class="title-text">Manage Children</h2>
          </v-card-title>
          <v-card-text class="text-center">
            <v-chip class="ma-2" color="primary" text-color="white">
              <v-icon left>fas fa-user</v-icon> Total children: {{ childrenCount }}
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Navigation Links -->
      <v-col cols="12" class="d-flex justify-center">
        <v-btn @click="showAddChildForm = true" color="primary" class="ma-2">
          <v-icon left>fas fa-plus</v-icon> Add Child
        </v-btn>
        <v-btn @click="toggleEditChildren" color="secondary" class="ma-2">
          <v-icon left>fas fa-edit</v-icon> Edit Children
        </v-btn>
      </v-col>

      <!-- Add Child Form -->
      <v-col cols="12" v-if="showAddChildForm">
        <v-card class="mx-auto my-5 floating-card" elevation="2">
          <v-card-title>Add Child</v-card-title>
          <v-card-text>
            <form @submit.prevent="handleSubmit">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="child.name" label="Name" required></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="child.address" label="Address" required></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="child.age" label="Age" type="number" required></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select v-model="child.parents" :items="['known', 'unknown']" label="Parents" required></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select v-model="child.connectionStatus" :items="['unknown', 'pending', 'confirmed']" label="Connection Status" required></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-file-input @change="handleFileChange" label="Upload Photo" required></v-file-input>
                </v-col>
              </v-row>
              <v-btn type="submit" color="primary" class="mt-4" block>Add Child</v-btn>
            </form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Current Children -->
      <v-col cols="12" v-show="!showAddChildForm" ref="childrenTable">
        <v-card class="mx-auto my-5 floating-card" elevation="2">
          <v-card-title>
            <v-row>
              <v-col cols="6">
                <h3 class="title-text">Current Children</h3>
              </v-col>
              <v-col cols="6" class="d-flex justify-end">
                <v-text-field 
                  v-model="searchChildName" 
                  label="Search by Name" 
                  prepend-inner-icon="fas fa-search" 
                  @input="searchChildByName" 
                  outlined 
                  dense 
                  clearable>
                </v-text-field>
                <v-btn v-if="searchChildName" @click="clearSearch" color="primary" class="ml-2">
                  Show All
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-data-table :headers="childHeaders" :items="paginatedChildren" class="elevation-1" item-key="id" :items-per-page="5">
              <template v-slot:item.actions="{ item }">
                <v-btn small @click="promptEditChild(item)">Edit</v-btn>
                <v-btn small color="error" @click="promptDeleteChild(item)">Delete</v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Edit Child Form -->
      <v-col cols="12" v-if="isEditing">
        <v-dialog v-model="isEditing" max-width="600px">
          <v-card>
            <v-card-title>Edit Child</v-card-title>
            <v-card-text>
              <form @submit.prevent="handleSubmit">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="child.name" label="Name" required></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="child.address" label="Address" required></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="child.age" label="Age" type="number" required></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select v-model="child.parents" :items="['known', 'unknown']" label="Parents" required></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select v-model="child.connectionStatus" :items="['unknown', 'pending', 'confirmed']" label="Connection Status" required></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-file-input @change="handleFileChange" label="Upload Photo"></v-file-input>
                  </v-col>
                </v-row>
                <v-btn type="submit" color="primary" class="mt-4" block>Update Child</v-btn>
              </form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="isEditing = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <!-- Snackbar for Notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" top right>
      {{ snackbar.message }}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>

    <!-- Confirm Delete Dialog -->
    <v-dialog v-model="confirmDeleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>
          <v-textarea v-model="adminComment" label="Reason for deletion" outlined dense></v-textarea>
          Are you sure you want to delete this child?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="confirmDeleteDialog = false">Cancel</v-btn>
          <v-btn @click="deleteChild" color="error">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    const searchChildName = ref('');
    const isEditing = ref(false);
    const showAddChildForm = ref(false);
    const file = ref(null);
    const snackbar = ref({
      show: false,
      message: '',
      color: ''
    });
    const childrenCount = ref(0);
    const adminComment = ref('');
    const confirmDeleteDialog = ref(false);
    const selectedChild = ref(null);
    const childrenTable = ref(null);

    const loadChildren = async () => {
      const querySnapshot = await getDocs(collection(db, 'children'));
      children.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      childrenCount.value = children.value.length;
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

    const deleteChild = async () => {
      const childRef = doc(db, 'children', selectedChild.value.id);
      await deleteDoc(childRef);
      snackbar.value = { show: true, message: 'Child deleted successfully', color: 'success' };
      confirmDeleteDialog.value = false;
      loadChildren();
    };

    const promptDeleteChild = (child) => {
      selectedChild.value = child;
      confirmDeleteDialog.value = true;
    };

    const searchChildByName = async () => {
      try {
        if (searchChildName.value.trim() === '') {
          loadChildren(); // If search is empty, load all children
        } else {
          const querySnapshot = await getDocs(collection(db, 'children'));
          children.value = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(child => child.name.toLowerCase().includes(searchChildName.value.toLowerCase()));
        }
      } catch (error) {
        snackbar.value = { show: true, message: 'Error searching children: ' + error.message, color: 'error' };
      }
    };

    const promptEditChild = async (child) => {
      const docRef = doc(db, 'children', child.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        child.value = { id: docRef.id, ...data };
        isEditing.value = true;
      } else {
        snackbar.value = { show: true, message: 'No such document!', color: 'error' };
      }
    };

    const resetForm = () => {
      child.value = { id: '', name: '', address: '', age: '', parents: 'known', connectionStatus: 'unknown', photoUrl: '' };
      isEditing.value = false;
      file.value = null;
    };

    const toggleEditChildren = () => {
      showAddChildForm.value = false;
      if (childrenTable.value && childrenTable.value.$el) {
        childrenTable.value.$el.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const childHeaders = [
      { text: 'Name', value: 'name' },
      { text: 'Address', value: 'address' },
      { text: 'Age', value: 'age' },
      { text: 'Parents', value: 'parents' },
      { text: 'Actions', value: 'actions', sortable: false }
    ];

    const filteredChildren = computed(() => {
      return children.value.filter(child => 
        child.name.toLowerCase().includes(searchChildName.value.toLowerCase()));
    });

    const paginatedChildren = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage.value;
      const endIndex = startIndex + itemsPerPage.value;
      return filteredChildren.value.slice(startIndex, endIndex);
    });

    const currentPage = ref(1);
    const itemsPerPage = ref(5);

    onMounted(() => {
      loadChildren();
    });

    return {
      children,
      child,
      searchChildName,
      isEditing,
      showAddChildForm,
      file,
      handleSubmit,
      handleFileChange,
      deleteChild,
      promptDeleteChild,
      promptEditChild,
      searchChildByName,
      filteredChildren,
      paginatedChildren,
      currentPage,
      itemsPerPage,
      childHeaders,
      childrenCount,
      adminComment,
      confirmDeleteDialog,
      resetForm,
      snackbar,
      toggleEditChildren,
      childrenTable
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
.v-select,
.v-file-input,
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
