<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="mx-auto my-5" elevation="2">
          <v-card-title>Tabular Data</v-card-title>
          <v-card-text>
            <!-- Table data will go here -->
            <v-simple-table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <v-btn small @click="viewDetails(user.id)">Details</v-btn>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'TabularData',
  data() {
    return {
      users: [
        // Placeholder data
        { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' }
      ]
    };
  },
  methods: {
    viewDetails(userId) {
      // Handle viewing details
    }
  }
};
</script>

<style scoped>
.v-card {
  margin: 20px;
  padding: 20px;
}
</style>
