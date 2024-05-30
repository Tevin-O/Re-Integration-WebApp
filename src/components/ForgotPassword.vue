<template>
  <v-card elevation="0">
    <div class="text-center">
      <h1 class="mb-2">Forgot Password</h1>
      <p>We will send a password reset link to the email address of the connected account.</p>
    </div>
    <v-form @submit.prevent="resetPassword">
      <v-text-field
        label="Enter your email address"
        name="email"
        prepend-inner-icon="fas fa-envelope"
        type="email"
        class="rounded-0"
        v-model="email"
        outlined
      ></v-text-field>
      <v-btn class="rounded-0" color="black" x-large block dark type="submit">Reset Password</v-btn>
    </v-form>
  </v-card>
</template>

<script>
import { ref } from 'vue';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

export default {
  name: 'forgotpassword',
  setup() {
    const email = ref('');
    const auth = getAuth();

    const resetPassword = () => {
      if (!email.value) {
        alert('Please enter your email.');
        return;
      }

      sendPasswordResetEmail(auth, email.value)
        .then(() => {
          alert('Password reset email sent. Please check your inbox.');
        })
        .catch((error) => {
          console.error(error);
          alert(error.message);
        });
    };

    return {
      email,
      resetPassword,
    };
  },
};
</script>

<style scoped>
/* Your styles here */
</style>
