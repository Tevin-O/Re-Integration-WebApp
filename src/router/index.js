import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginUi from '../views/LoginUi.vue';
import Feed from '../views/Feed.vue';
import Signin from '../views/Signin.vue';
import VerifyEmail from '../views/VerifyEmail.vue'; 
import Register2 from '../components/Register2.vue';
import ForgotPassword from '../components/ForgotPassword.vue';
import Login from '../components/Login.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import AdminManagement from '../components/AdminManagement.vue';
import UserDashboard from '../views/UserDashboard.vue';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/loginui',
    name: 'loginui',
    component: LoginUi
  },
  {
    path: '/forgotpassword',
    name: 'forgotpassword',
    component: ForgotPassword
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register2',
    name: 'register2',
    component: Register2
  },
  {
    path: '/feed',
    name: 'feed',
    component: Feed,
    meta: {
      requiresAuth: true,
      requiresEmailVerified: true
    }
  },
  {
    path: '/signin',
    name: 'signin',
    component: Signin
  },
  {
    path: '/verify-email',
    name: 'verify-email',
    component: VerifyEmail
  },
  {
    path: '/admin',
    component: AdminDashboard,
    meta: { requiresAdmin: true, requiresAuth: true },
    children: [
      {
        path: 'manage',
        component: AdminManagement,
        meta: { requiresAdmin: true, requiresAuth: true }
      }
    ]
  },
  {
    path: '/user',
    component: UserDashboard,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

router.beforeEach(async (to,from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const user = await getCurrentUser();
    if (user) {
      if (to.matched.some(record => record.meta.requiresEmailVerified)) {
        if (user.emailVerified) {
          if (to.matched.some(record => record.meta.requiresAdmin)) {
            const db = getFirestore();
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists() && userDoc.data().isAdmin) {
              next();
            } else {
              alert('You do not have admin access to this page.');
              next('/user');
            }
          } else {
            next();
          }
        } else {
          alert('Please verify your email to access this page.');
          next('/verify-email');
        }
      } else {
        next();
      }
    } else {
      alert('You do not have access to this page.');
      next('/');
    }
  } else {
    next();
  }
});

export default router;
