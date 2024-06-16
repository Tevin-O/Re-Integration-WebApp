<template>
  <v-card elevation="0">
    <div class="text-center">
      <h1 class="mb-2">Register</h1>
    </div>
    <v-card-text>
      <v-form @submit.prevent="register">
        <v-text-field
          v-model="name"
          label="Enter your Name"
          name="name"
          prepend-inner-icon="fas fa-user"
          type="text"
          class="rounded-0"
          outlined
        ></v-text-field>
        <v-text-field
          v-model="email"
          label="Enter your Email"
          name="email"
          prepend-inner-icon="fas fa-envelope"
          type="email"
          class="rounded-0"
          outlined
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Enter your password"
          name="password"
          prepend-inner-icon="fas fa-lock"
          type="password"
          class="rounded-0"
          outlined
        ></v-text-field>
        <v-text-field
          v-model="confirmPassword"
          label="Re-enter password"
          name="confirmPassword"
          prepend-inner-icon="fas fa-lock"
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
        By continuing, you agree to Finder Family
        <a href="#" class="pl-2" style="color: #000000">Policy</a>
        and
        <a href="#" class="pl-2" style="color: #000000">Terms of Use</a>
      </p>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { useRouter } from 'vue-router';
import { getFirestore, doc, setDoc } from "firebase/firestore";

export default {
  name: 'Register2',
  setup() {
    const name = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const router = useRouter();
    const auth = getAuth();
    const db = getFirestore();

    const register = async () => {
      if (password.value !== confirmPassword.value) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        console.log("Successfully registered");

        // Update the user's profile with the displayName
        await updateProfile(userCredential.user, {
          displayName: name.value
        });

        // Store additional user information in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: email.value,
          isAdmin: false,
          name: name.value,
          paymentMethods: {} // Initialize paymentMethods as an empty map
        });

        await sendEmailVerification(userCredential.user);
        alert("Verification email sent. Please check your inbox.");
        router.push('/');
      } catch (error) {
        console.log(error.code);
        alert(error.message);
      }
    };

    return {
      name,
      email,
      password,
      confirmPassword,
      register,
    };
  }
};
</script>

<style scoped>
/* Your styles here */
</style>
