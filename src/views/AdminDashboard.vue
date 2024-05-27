<template>
    <div>
      <h1>Admin Dashboard</h1>
      <router-link to="/admin/manage">Manage Users</router-link>
      <router-view></router-view>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdminDashboard'
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  