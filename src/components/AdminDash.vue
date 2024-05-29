<template>
  <div>
    <h1>Admin Dashboard</h1>
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
import ManageUsers from '../components/ManageUsers.vue';
import ManageChildren from '../components/ManageChildren.vue';
import ManageConnections from '../components/ManageConnections.vue';
import CommonHomePage from '../components/CommonHomepage.vue';

export default {
  data() {
    return {
      drawer: true,
      currentComponent: 'CommonHomePage',
      links: [
        { icon: 'fas fa-home', text: 'Home', component: 'CommonHomePage',path:'/commonhomepage' },
        { icon: 'fas fa-user', text: 'Manage Users', component: 'ManageUsers',path:'/admin/users' },
        { icon: 'fas fa-child', text: 'Manage Children', component: 'ManageChildren',path:'/admin/children' },
        { icon: 'fas fa-link', text: 'Connections', component: 'ManageConnections',path:'/admin/connections' },
      ]
    };
  },
  components: {
    CommonHomePage,
    ManageUsers,
    ManageChildren,
    ManageConnections
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
