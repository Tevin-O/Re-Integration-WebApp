<template>
    <div class="feed-container">
      <!-- Display welcoming message with user's name if available -->
      <h1>Welcome{{ userName ? ', ' + userName : '' }}</h1>
      <!-- Add logout button -->
      <v-btn class="logout-button" color="red" @click="confirmLogout">Logout</v-btn>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { getAuth, signOut } from 'firebase/auth';
  
  const router = useRouter();
  const auth = getAuth();
  const userName = ref('');
  
  // Function to get user's name
  const getUserName = () => {
    if (auth.currentUser) {
      userName.value = auth.currentUser.displayName || '';
    }
  };
  
  // Function to prompt user for logout confirmation
  const confirmLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
    }
  };
  
  // Function to logout the user
  const logout = () => {
    signOut(auth)
      .then(() => {
        console.log("User logged out successfully");
        router.push('/'); // Redirect user to the home page after logout
      })
      .catch((error) => {
        console.error("Logout error", error);
        alert('Failed to logout. Please try again.');
      });
  };
  
  onMounted(getUserName);
  </script>
  
  <style scoped>
  .feed-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logout-button {
    margin-left: 10px; /* Adjust as needed */
  }
  
  .welcome-message {
    margin-right: 10px; /* Adjust as needed */
  }
  </style>
  