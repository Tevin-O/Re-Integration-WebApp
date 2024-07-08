import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginUi from '../views/LoginUi.vue';
import Feed from '../views/Feed.vue';
import Signin from '../views/Signin.vue';
import VerifyEmail from '../views/VerifyEmail.vue';
import Register2 from '../components/Register2.vue';
import ForgotPassword from '../components/ForgotPassword.vue';
import Login from '../components/Login.vue';
import AdminDash from '../components/AdminDash.vue';
import UserDash from '../components/UserDash.vue';
import ManageUsers from '../components/ManageUsers.vue';
import ManageChildren from '../components/ManageChildren.vue';
import ManageConnections from '../components/ManageConnections.vue';
import UserProfile from '../components/UserProfile.vue';
import UserConnections from '../components/UserConnections.vue';
import CommonHomepage from '../components/CommonHomepage.vue';
import Donations from '../components/Donations.vue';
import StatisticalData from '../components/StatisticalData.vue';

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
    path:'/commonhomepage',
    name: 'CommonHomepage',
    component: CommonHomepage
  },
  {
    path: '/admin',
    component: AdminDash,
    meta: { requiresAdmin: true, requiresAuth: true },
    children: [
      {
        path: 'users',
        component: ManageUsers,
        meta: { requiresAdmin: true, requiresAuth: true },
        children: [
          {
            path: 'statistics',
            name: 'statistical-data',
            component: StatisticalData,
            meta: { requiresAdmin: true, requiresAuth: true }
          }
        ]
      },
      {
        path:'children',
        component: ManageChildren,
        meta: { requiresAdmin: true, requiresAuth: true }
      },
      {
        path:'connections',
        component: ManageConnections,
        meta: { requiresAdmin: true, requiresAuth: true }
      }
    ]
  },
  {
    path: '/user',
    component: UserDash,
    meta: { requiresAuth: true },
    children: [
      {
        path:'profile',
        component: UserProfile
      },
      {
        path:'connections',
        component: UserConnections
      },
      {
        path:'donations',
        component: Donations
      }
    ]
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

router.beforeEach(async (to, from, next) => {
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
