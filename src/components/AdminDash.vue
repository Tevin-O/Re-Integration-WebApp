<template>
  <div class="app-container">
    <v-app-bar app>
      <v-toolbar-title>Admin Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="notificationsMenu = true">
        <v-icon>fas fa-bell</v-icon>
        <v-badge
          color="red"
          :content="unreadCount"
          class="badge"
          v-if="unreadCount > 0"
        ></v-badge>
      </v-btn>
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

    <!-- Notification Dialog -->
    <v-dialog v-model="notificationsMenu" max-width="400">
      <v-card>
        <v-card-title class="headline">Notifications</v-card-title>
        <v-divider></v-divider>
        <v-list>
          <v-list-item v-for="(notification, index) in notifications" :key="index">
            <v-list-item-content>
              <v-list-item-title>{{ notification.userName }}</v-list-item-title>
              <v-list-item-subtitle>initiated a connection</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon small @click="markAsRead(index)">
                <v-icon small>fas fa-times</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn text small @click="clearAll">Clear All</v-btn>
          <v-spacer></v-spacer>
          <v-btn text small @click="notificationsMenu = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>





<script>
import { db } from '../main'; // Correctly import Firestore instance as db
import { collection, query, onSnapshot } from 'firebase/firestore';
import ManageUsers from '../components/ManageUsers.vue';
import ManageChildren from '../components/ManageChildren.vue';
import ManageConnections from '../components/ManageConnections.vue';
import CommonHomePage from '../components/CommonHomepage.vue';
import { signOut } from 'firebase/auth';
import { auth } from '../main'; // Import auth from main.js

export default {
  data() {
    return {
      drawer: true,
      currentComponent: 'CommonHomePage',
      links: [
        { icon: 'fas fa-home', text: 'Home', component: 'CommonHomePage', path: '/commonhomepage' },
        { icon: 'fas fa-user', text: 'Manage Users', component: 'ManageUsers', path: '/admin/users' },
        { icon: 'fas fa-child', text: 'Manage Children', component: 'ManageChildren', path: '/admin/children' },
        { icon: 'fas fa-link', text: 'Connections', component: 'ManageConnections', path: '/admin/connections' },
      ],
      previousComponent: null,
      notifications: [],
      notificationsMenu: false,
      unreadCount: 0,
    };
  },
  components: {
    CommonHomePage,
    ManageUsers,
    ManageChildren,
    ManageConnections,
  },
  methods: {
    navigateTo(component) {
      this.previousComponent = this.currentComponent;
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
    logout() {
      signOut(auth)
        .then(() => {
          console.log('User logged out successfully');
          this.$router.push('/'); // Redirect user to the home page after logout
        })
        .catch((error) => {
          console.error('Logout error', error);
          alert('Failed to logout. Please try again.');
        });
    },
    markAsRead(index) {
      this.notifications.splice(index, 1);
      this.unreadCount = this.notifications.length;
    },
    clearAll() {
      this.notifications = [];
      this.unreadCount = 0;
    },
    fetchNotifications() {
      const connectionsRef = collection(db, 'connections');
      const q = query(connectionsRef);
      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const connection = change.doc.data();
            const message = `${connection.userName} initiated a connection`;
            this.notifications.push({ userName: connection.userName, message });
            this.unreadCount = this.notifications.length;
          }
        });
      });
    },
  },
  mounted() {
    this.fetchNotifications();
  },
  watch: {
    '$route'(to, from) {
      if (to.path === '/loginui' && from.path !== '/') {
        this.currentComponent = this.previousComponent;
      }
    },
  },
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

.v-card {
  max-width: 400px;
  padding: 10px;
  border-radius: 8px;
  background-color: #f5f5f5;
}

.v-card-title {
  font-size: 18px;
  font-weight: bold;
}

.v-list-item {
  padding: 10px 0;
}

.v-list-item-content {
  margin-left: 10px;
}

.v-list-item-title {
  font-size: 16px;
  color: #333;
}

.v-list-item-subtitle {
  font-size: 14px;
  color: #666;
}

.v-list-item-action {
  margin-left: auto;
  padding-left: 10px;
}

.v-btn {
  margin: 0;
  padding: 0;
}

.v-divider {
  margin: 10px 0;
}

.v-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 12px;
  height: 20px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: red;
  color: white;
}
</style>
