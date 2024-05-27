<template>
    <div>
      <h1>Admin Management</h1>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.email }} 
          <button v-if="!user.isAdmin" @click="makeAdmin(user.id)">Make Admin</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
  
  export default {
    setup() {
      const users = ref([]);
      const db = getFirestore();
  
      const fetchUsers = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'users'));
          users.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log('Users fetched successfully');
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
  
      const makeAdmin = async (userId) => {
        const userRef = doc(db, 'users', userId);
        try {
          await updateDoc(userRef, { isAdmin: true });
          console.log(`User with ID ${userId} successfully made admin`);
          fetchUsers();  // Refresh the user list
        } catch (error) {
          console.error(`Error making user with ID ${userId} an admin:`, error);
        }
      };
  
      onMounted(() => {
        fetchUsers();
      });
  
      return { users, makeAdmin };
    }
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  