<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/feed">Feed</router-link> |
    <router-link to="/register">Register</router-link> |
    <router-link to="/signin">SignIn</router-link>
    <button class="signOut" v-if="isLoggedIn" @click="handleSignOut">Sign Out</button>
  </nav>
  <router-view/>
</template>

<script setup>
// Want the signout to be available when user is signed In
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const isLoggedIn = ref(false);
const router = useRouter();
const auth = getAuth();

// Use a hook called onAuthStateChanged
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
  });
});

const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push('/');
  });
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
