<template>
         <!--
    <h1>Create Account</h1>
    <p><input  v-model="email" type="text" placeholder="Email"></p>
    <p><input  v-model="password" type="password" placeholder="Password"></p>
    <p><button @click="register">Register</button></p>
    <p><button @click="signInWithGoogle">Sign In With Google</button></p>
    -->
        <v-container>
            <v-row align="center" justify="center" >
                <v-col cols="12" sm="10">
                  <v-card class="elevation-6 mt-10"  >
                   <v-window v-model="step">
                      <v-window-item :value="1">
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-card-text class="mt-12">
                              <h4
                                class="text-center"
                              >Login in to Your Account</h4>
                              <h6
                                class="text-center  grey--text "
                              >Log in to your account so you can continue builiding <br>and editing your onboarding flows</h6>
                              <v-row align="center" justify="center">
                                <v-col cols="12" sm="8">
                                 
                                <v-text-field
                                  v-model="email"
                                  label="Email"
                                  outlined
                                  dense
                                  color="blue"
                                  autocomplete="false"
                                 class="mt-16"
                                />
                                <v-text-field
                                  v-model="password"
                                  label="Password"
                                  outlined
                                  dense
                                  color="blue"
                                autocomplete="false"
                                 type="password"
                                
                                />
                                  <v-row>
                                    <v-col cols="12" sm="7">
                                      <v-checkbox
                             
                              label="Remember Me"
                              class="mt-n1"
                              color="blue"
                            > </v-checkbox>
                                    </v-col>
                                    <v-col cols="12" sm="5">
                                      <span class="caption blue--text">Forgot password</span>
                                    </v-col>
                                  </v-row>
                                <v-btn color="blue" dark block tile @click="login">Log in</v-btn>
                           
                               <h5
                                class="text-center  grey--text mt-4 mb-3"
                              >Or Log in using</h5>
                               <div class="d-flex  justify-space-between align-center mx-10 mb-16">
                              <v-btn depressed outlined color="grey" @click="signInWithGoogle">
                                <v-icon color="red">fab fa-google</v-icon>
                              </v-btn>
                              <v-btn depressed outlined color="grey">
                                <v-icon color="blue">fab fa-facebook-f</v-icon>
                              </v-btn>
                              <v-btn depressed outlined color="grey">
                                <v-icon color="light-blue lighten-3">fab fa-twitter</v-icon>
                              </v-btn>
                               </div>
                                </v-col>
                              </v-row>  
                            </v-card-text>
                          </v-col>
                          <v-col cols="12" md="6" class="blue rounded-bl-xl" >
                          <div style="  text-align: center; padding: 180px 0;">
                            <v-card-text class="white--text" >
                              <h3 class="text-center ">Don't Have an Account Yet?</h3>
                              <h6
                                class="text-center"
                              >Let's get you all set up so you can start creating your your first<br>  onboarding experience</h6>
                            </v-card-text>
                            <div class="text-center">
                              <v-btn tile outlined dark @click="step++">SIGN UP</v-btn>
                            </div>
                            </div>
                          </v-col>
                        </v-row>
                      </v-window-item>
                      <v-window-item :value="2">
                        <v-row >
                          <v-col cols="12" md="6" class="blue rounded-br-xl">
                           <div style="  text-align: center; padding: 180px 0;">
                            <v-card-text class="white--text" >
                              <h3 class="text-center ">Already Signed up?</h3>
                              <h6
                                class="text-center"
                              >Log in to your account so you can continue building and<br>  editing your onboarding flows</h6>
                            </v-card-text>
                            <div class="text-center">
                              <v-btn tile outlined dark @click="step--">Log in</v-btn>
                            </div>
                            </div>
                          </v-col>
      
                          <v-col cols="12" md="6">
                            <v-card-text class="mt-12">
                              <h4
                                class="text-center"
                              >Sign Up for an Account</h4>
                              <h6
                                class="text-center  grey--text "
                              >Let's get you all set up so you can start creatin your <br>
                              first onboarding experiance</h6>
                              <v-row align="center" justify="center">
                                <v-col cols="12" sm="8">
                                 <v-row>
                                 <v-col cols="12" sm="6">
                                  <v-text-field
                                  label="First Name"
                                  outlined
                                  dense
                                  color="blue"
                                  autocomplete="false"
                                 class="mt-4"
                                />
                                 </v-col>
                                 <v-col cols="12" sm="6">
                                  <v-text-field
                                  label="Last Name"
                                  outlined
                                  dense
                                  color="blue"
                                  autocomplete="false"
                                 class="mt-4"
                                />
                                 </v-col>
                                 </v-row>
                                <v-text-field
                                  v-model="email"
                                  label="Email"
                                  outlined
                                  dense
                                  color="blue"
                                  autocomplete="false"
                                />
                                <v-text-field
                                  v-model="password"
                                  label="Password"
                                  outlined
                                  dense
                                  color="blue"
                                autocomplete="false"
                                 type="password"
                                
                                />
                                  <v-row>
                                    <v-col cols="12" sm="7">
                                      <v-checkbox
                             
                              label="I Accept Finder Home"
                              class="mt-n1"
                              color="blue"
                            > </v-checkbox>
                                    </v-col>
                                    <v-col cols="12" sm="5">
                                      <span class="caption blue--text ml-n4">Terms & Conditions</span>
                                    </v-col>
                                  </v-row>
                                <v-btn color="blue" dark block tile @click="register">Sign up</v-btn>
                           
                               <h5
                                class="text-center  grey--text mt-4 mb-3"
                              >Or Sign up using</h5>
                               <div class="d-flex  justify-space-between align-center mx-10 mb-11">
                              <v-btn depressed outlined color="grey" @click="signInWithGoogle">
                                <v-icon color="red">fab fa-google</v-icon>
                              </v-btn>
                              <v-btn depressed outlined color="grey">
                                <v-icon color="blue">fab fa-facebook-f</v-icon>
                              </v-btn>
                              <v-btn depressed outlined color="grey">
                                <v-icon color="light-blue lighten-3">fab fa-twitter</v-icon>
                              </v-btn>
                               </div>
                                </v-col>
                              </v-row>  
                            </v-card-text>
                          </v-col>
                        </v-row>
                      </v-window-item>
                    </v-window>
                  </v-card>
                </v-col>
            </v-row>
            <!-- Add a logout button -->
    <v-btn color="red" dark block tile @click="handleSignOut" v-if="isLoggedIn">Log out</v-btn>
        </v-container>
      </template>
      
      <script>
      export default {
       data: () => ({
        step: 1
      }),
      props: {
        source: String
      }    
      }
    </script>

<script setup>
    import {ref} from 'vue';
    import {getAuth,createUserWithEmailAndPassword,sendEmailVerification,GoogleAuthProvider,signInWithPopup} from "firebase/auth";
    import { signInWithEmailAndPassword } from "firebase/auth";
    import { onMounted } from 'vue';
    import { onAuthStateChanged, signOut } from 'firebase/auth';
    import {useRouter} from 'vue-router' //import router
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


        
//const isLoggedIn = ref(false);
//const router = useRouter();
//const auth = getAuth();

// Use a hook called onAuthStateChanged
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

<style>
.v-application .rounded-bl-xl {
    border-bottom-left-radius: 300px !important;
}
.v-application .rounded-br-xl {
    border-bottom-right-radius: 300px !important;
}
</style>