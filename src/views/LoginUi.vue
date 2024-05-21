<template>
  <v-app>
    <v-main>
      <v-container>
        <v-tabs>
          <v-tab @click="login = true; register = false; forgotPassword = false">Login</v-tab>
          <v-tab @click="register = true; forgotPassword = false; login = false">Register</v-tab>
          <v-tab @click="forgotPassword = true; register = false; login = false">Forgot Password</v-tab>
        </v-tabs>
        <div>
          <login v-if="login" />
          <forgot-password v-if="forgotPassword" />
          <register v-if="register" />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Login from "@/components/Login.vue";
import ForgotPassword from "@/components/ForgotPassword.vue";
import Register2 from "@/components/Register2.vue";


export default {
  name: 'loginui',
  data() {
    return {
      login: true,
      register: false,
      forgotPassword: false,
    };
  },
  components: {
    Login,
    ForgotPassword,
    Register: Register2,
  },
};
</script>

<style scoped>
/* Your styles here */
</style>
