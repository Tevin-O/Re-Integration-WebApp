import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'
import HighchartsVue from 'highcharts-vue';

import * as components from './components'

const componentList = components?.default

const VuetifyComponents = {
    install(app) {
        Object.keys(componentList).forEach((name) => {
           app.component(name, componentList[name])
        })
    },
}
 
 
export default VuetifyComponents

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAuth } from "firebase/auth";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxVsu3o5cAPMb1VoC-LyrLBKn5gw7ikJE",
  authDomain: "reintegration-system.firebaseapp.com",
  projectId: "reintegration-system",
  storageBucket: "reintegration-system.appspot.com",
  messagingSenderId: "170089311919",
  appId: "1:170089311919:web:c07ff4d70f80a0b548ae5a",
  measurementId: "G-1JN4V81J1X"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export{auth};

loadFonts()


createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .use(HighchartsVue)
  .mount('#app');


