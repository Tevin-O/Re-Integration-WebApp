<template>
  <div class="app-container">
    <v-app-bar app>
      <v-toolbar-title>Welcome, {{ userName }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="lockScreen">
        <v-icon>fas fa-lock</v-icon>
      </v-btn>
      <v-btn icon @click="logout">
        <v-icon>fas fa-sign-out-alt</v-icon>
      </v-btn>
    </v-app-bar>
    
    <v-navigation-drawer v-model="drawer" dark app class="blue accent-2" @click-outside="closeDrawer">
      <v-list>
        <v-list-item v-for="link in links" :key="link.text" @click="navigateTo(link.component)">
          <v-list-item-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-btn icon @click="toggleDrawer" class="drawer-toggle-btn">
      <v-icon>{{ drawer ? 'fas fa-arrow-left' : 'fas fa-arrow-right' }}</v-icon>
    </v-btn>
    
    <v-main class="floating-background">
      <v-container fluid>
        <component :is="currentComponent"></component>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import UserProfile from '../components/UserProfile.vue';
import UserConnections from '../components/UserConnections.vue';
import CommonHomePage from '../components/CommonHomepage.vue';
import Donations from '../components/Donations.vue';

export default {
  setup() {
    const userName = ref('');
    const auth = getAuth();

    const getUserName = () => {
      const user = auth.currentUser;
      if (user) {
        userName.value = user.displayName || 'User';
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        userName.value = user.displayName || 'User';
      } else {
        userName.value = '';
      }
    });

    onMounted(getUserName);

    return {
      userName,
    };
  },
  data() {
    return {
      drawer: true,
      currentComponent: 'CommonHomePage',
      links: [
        { icon: 'fas fa-home', text: 'Home', component: 'CommonHomePage', path: '/commonhomepage' },
        { icon: 'fas fa-user', text: 'Profile', component: 'UserProfile', path: '/user/profile' },
        { icon: 'fas fa-link', text: 'Connections', component: 'UserConnections', path: '/user/connections' },
        { icon: 'fas fa-donate', text: 'Donations', component: 'Donations', path: '/user/donations' }
      ]
    };
  },
  components: {
    CommonHomePage,
    UserProfile,
    UserConnections,
    Donations
  },
  methods: {
    navigateTo(component) {
      this.currentComponent = component;
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    closeDrawer() {
      this.drawer = false;
    },
    lockScreen() {
      this.previousComponent = this.currentComponent;
      this.$router.push('/loginui');
    },
    async logout() {
      const auth = getAuth();
      try {
        await signOut(auth);
        console.log('User logged out successfully');
        this.$router.push('/'); // Redirect user to the home page after logout
      } catch (error) {
        console.error('Logout error', error);
        alert('Failed to logout. Please try again.');
      }
    }
  },
  watch: {
    '$route'(to, from) {
      if (to.path === '/loginui' && from.path !== '/') {
        this.currentComponent = this.previousComponent;
      }
    }
  }
};
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.drawer-toggle-btn {
  position: fixed;
  top: 64px; /* Adjust this value if your app bar height is different */
  left: 10px; /* Adjust this value as needed */
  z-index: 1001; /* Ensure it is above other elements */
}

.floating-background {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px;
  position: relative;
  overflow: hidden;
  animation: float 3s infinite ease-in-out;
  flex-grow: 1;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
