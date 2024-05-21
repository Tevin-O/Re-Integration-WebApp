<template>
    <div>
        <slot name="logo">
      <v-img
        class="mx-auto my-6"
        max-width="228"
        src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
      ></v-img>
        </slot>
  
        <v-form @submit.prevent="login()" ref="form">
      <v-card
        class="mx-auto pa-12 pb-8"
        elevation="8"
        max-width="448"
        rounded="lg"
      >
        <div class="text-subtitle-1 text-medium-emphasis">Email</div>
  
           <v-text-field
          v-model="email"
          density="compact"
          :placeholder="Emailplease"
          :rules="[v => !!v || 'Item is required']"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
        ></v-text-field>
  
        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Password
  
          <a
            class="text-caption text-decoration-none text-blue"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
            style="pointer-events: none;"
          >
            Forgot login password?</a>
        </div>
  
        <v-text-field
                v-model="password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          :placeholder="passwordPlaceholder"
          :rules="[v => !!v || 'Item is required']"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
        ></v-text-field>
  
        <slot name="notice">
        <v-card
          class="mb-12"
          color="surface-variant"
          variant="tonal"
        >
          <v-card-text class="text-medium-emphasis text-caption">
            Warning: After 3 consecutive failed login attempts, you account will be temporarily locked for three hours. If you must login now, you can also click "Forgot login password?" below to reset the login password.
          </v-card-text>
        </v-card>
        </slot>
  
        <v-btn
          block
          class="mb-8"
          color="blue"
          size="large"
          variant="tonal"
          type="submit"
        >
          Log In
        </v-btn>

        <h5 class="text-center grey--text mt-4 mb-3">Or Sign up using</h5>
                          <div class="d-flex justify-space-between align-center mx-10 mb-11">
                            <v-btn depressed outlined color="grey" @click="signInWithGoogle">
                              <v-icon color="red">fab fa-google</v-icon>
                            </v-btn>
                        </div>
        <v-card-text class="text-center">
          <a
            class="text-blue text-decoration-none"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
            style="pointer-events: none;"
          >
            Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
          </a>
        </v-card-text>
      </v-card>
        </v-form>
    </div>
  </template>

  <script setup>
  import {ref} from 'vue';
  import {getAuth,createUserWithEmailAndPassword,sendEmailVerification,GoogleAuthProvider,signInWithPopup} from "firebase/auth";
    import { signInWithEmailAndPassword } from "firebase/auth";
    import { onMounted } from 'vue';
    import { onAuthStateChanged, signOut } from 'firebase/auth';
     // Want the signout to be available when user is signed In
     const email = ref("");
    const password = ref("");
    const router = useRouter(); // get a reference to our vue router
    const auth = getAuth()// from firebase authentication
    const isLoggedIn = ref(false);
    const register = ()=>{
        //need .value because of ref()
        createUserWithEmailAndPassword(getAuth(),email.value,password.value)
            .then((userCredential)=>{
                console.log("Successfully registered");
                sendEmailVerification(userCredential.user).then(()=>{
                    alert("Verification email sent.Please check your inbox");
                    router.push('/about') //redirect user after registration to the about page 
                })
               // console.log(auth.currentUser);
            })
            .catch((error)=>{
                console.log(error.code);
                alert(error.message);
            });
    };

    const signInWithGoogle = ()=>{
        const provider = new GoogleAuthProvider();
        signInWithPopup(getAuth(),provider)
        .then((result) =>{
            console.log(result.user);
            router.push("/feed");
        })
        .catch((error)=>{
            //handle error
            console.error('Google sign-in error', error);
            alert('Failed to sign in with Google.Please try again');
        });
    }

    const login = ()=>{
        //need .value because of ref()
        signInWithEmailAndPassword(getAuth(),email.value,password.value)
            .then((userCredential)=>{
                console.log("Successfully signed In",userCredential);
              // console.log(auth.currentUser);
              if(auth.currentUser.emailVerified){
                router.push('/feed') //redirect user after registration to the feed page
              }else{
                alert("Please verify your email before accessing this page")
                router.push('/verify-email');
              }
            })
            .catch((error)=>{
                console.log(error.code);
                switch(error.code){
                    case "auth/invalid-email":
                        errMsg.value = "Invalid email";
                        break;
                        case "auth/user-not-found":
                        errMsg.value = "No account with that email was found";
                        break;
                        case "auth/wrong-password":
                        errMsg.value = "Incorrect password";
                        break;
                        default:
                        errMsg.value = "Email or password was incorrect";
                        break;
                }
            });
            onMounted(() => {
            onAuthStateChanged(auth, (user) => {
            isLoggedIn.value = !!user;
             });
             });
             };

             const handleSignOut = () => {
             signOut(auth).then(() => {
             router.push('/');
             });
            }; 
</script>