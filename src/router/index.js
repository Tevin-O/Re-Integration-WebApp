import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Register from '../views/Register.vue'
import Feed from '../views/Feed.vue'
import Signin from '../views/Signin.vue'
import {getAuth,onAuthStateChanged} from "firebase/auth";

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
 {
  path:'/register',
  name:'register',
  component: Register
 },
 {
  path:'/feed',
  name:'feed',
  component: Feed,
  meta: {
    requiresAuth: true,
  }
 },
 {
  path:'/signin',
  name:'signin',
  component: Signin
 }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

const getCurrentUser =()=>{
  return new Promise ((reslove,reject) =>{
    const removeListener = onAuthStateChanged(
      getAuth(),
          (user) =>{
            removeListener();
            reslove(user);
          },
      reject
    );
  })
}

router.beforeEach(async(to,from,next) =>{
   if(to.matched.some((record)=> record.meta.requireAuth)){
      if(await getCurrentUser()){
        next();
      }else{
        alert ("you dont have access");
        next("/");
      }
   }else{
    next();
   }
});
export default router
