<template>
    <div>
      <h1>User Dashboard</h1>
      <v-navigation-drawer v-model="drawer" dark app class="blue accent-2">
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
      <v-container>
        <component :is="currentComponent"></component>
      </v-container>
    </div>
  </template>
  
  <script>
  import UserProfile from '../components/UserProfile.vue';
  import UserConnections from '../components/UserConnections.vue';
  import CommonHomePage from '../components/CommonHomepage.vue';
  import Donations from '../components/Donations.vue';

  export default {
    data() {
      return {
        drawer: true,
        currentComponent: 'CommonHomePage',
        links: [
          { icon: 'fas fa-home', text: 'Home', component: 'CommonHomePage',path:'/commonhomepage' },
          { icon: 'fas fa-user', text: 'Profile', component: 'UserProfile',path:'/user/profile' },
          { icon: 'fas fa-link', text: 'Connections', component: 'UserConnections',path:'/user/connections' },
          { icon: 'fas fa-donate', text: 'Donations', component:'Donations', path: '/user/donations'}
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
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  