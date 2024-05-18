<template>
    <h1>Sign In</h1>
    <p><input  v-model="email" type="text" placeholder="Email"></p>
    <p><input  v-model="password" type="password" placeholder="Password"></p>
    <p v-if="errMsg">{{errMsg}}</p>
    <p><button @click="register">Login</button></p>
    <p><button @click="signInWithGoogle">Sign In With Google</button></p>
</template>

<script setup>
    import {ref} from 'vue';
    import {getAuth,signInWithEmailAndPassword} from "firebase/auth";
    import {useRouter} from 'vue-router' //import router
    const email = ref("");
    const password = ref("");
    const errMsg = ref() //error message
    const router = useRouter(); // get a reference to our vue router

    const register = ()=>{
        //need .value because of ref()
        signInWithEmailAndPassword(getAuth(),email.value,password.value)
            .then((data)=>{
                console.log("Successfully signed In");
                console.log(auth.currentUser);
                router.push('/feed') //redirect user after registration to the feed page 
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
        });
    }
</script>