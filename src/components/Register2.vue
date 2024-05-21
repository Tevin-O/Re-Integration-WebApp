<template>
    <v-card elevation="0">
      <div class="text-center">
        <h1 class="mb-2">Register</h1>
      </div>
      <v-card-text>
        <v-form @submit.prevent="register">
          <v-text-field
            label="Enter your Name"
            name="name"
            prepend-inner-icon="mdi-account"
            type="text"
            class="rounded-0"
            outlined
          ></v-text-field>
          <v-text-field
            v-model="email"
            label="Enter your Email"
            name="email"
            prepend-inner-icon="mdi-email"
            type="email"
            class="rounded-0"
            outlined
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Enter your password"
            name="password"
            prepend-inner-icon="mdi-lock"
            type="password"
            class="rounded-0"
            outlined
          ></v-text-field>
          <v-text-field
            v-model="confirmPassword"
            label="Re-enter password"
            name="confirmPassword"
            prepend-inner-icon="mdi-lock-outline"
            type="password"
            class="rounded-0"
            outlined
          ></v-text-field>
          <v-btn class="rounded-0" color="#000000" x-large block dark type="submit">Register</v-btn>
          <v-card-actions class="text--secondary">
            <v-spacer></v-spacer>
            Already have an account?
            <router-link to="/login" class="pl-2" style="color: #000000">Sign In</router-link>
          </v-card-actions>
        </v-form>
      </v-card-text>
      <v-card-actions class="ml-6 mr-6 text-center">
        <p>
          By continuing, you agree to Fedorae Education's
          <a href="#" class="pl-2" style="color: #000000">Policy</a>
          and
          <a href="#" class="pl-2" style="color: #000000">Terms of Use</a>
        </p>
      </v-card-actions>
    </v-card>
  </template>
  
  <script>

  import { ref } from 'vue';
  import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'Register2',
    setup() {
      const email = ref("");
      const password = ref("");
      const confirmPassword = ref("");
      const router = useRouter();
      const auth = getAuth();
      
      const register = () => {
        if (password.value !== confirmPassword.value) {
          alert("Passwords do not match!");
          return;
        }
  
        createUserWithEmailAndPassword(auth, email.value, password.value)
          .then((userCredential) => {
            console.log("Successfully registered");
            sendEmailVerification(userCredential.user).then(() => {
              alert("Verification email sent. Please check your inbox.");
              router.push('/about');
            });
          })
          .catch((error) => {
            console.log(error.code);
            alert(error.message);
          });
      };
  
      return {
        email,
        password,
        confirmPassword,
        register,
      };
    }
  };
</script>