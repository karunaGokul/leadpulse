import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Login from '../views/Login/Index.vue';
import Registration from '../views/Login/Registration.vue';
import ForgotPassword from '../views/Login/Forgot-Password.vue';
import ResetPassword from '../views/Login/Reset-Password.vue';

import Home from '../views/Home/Index.vue';

import Dashboard from '../views/Dashboard/Index.vue';
import Leads from '../views/Leads/Index.vue';
import ConsumerData from '@/views/Consumer-Data/Index.vue';
import Sites from '../views/Sites/Index.vue';
import Billing from '../views/Billing/Index.vue';
import Users from '../views/Users/Index.vue';
import Support from '../views/Support/Index.vue';
import DataRequestForm from '@/views/DataRequestForm/Index.vue';

import Success from '../views/Pages/Success.vue';
import Cancel from '../views/Pages/Cancel.vue';

import PageNotFound from "@/views/PageNotFound/Index.vue";

import store from '@/store';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { anonymous: true }
  },
  {
    path: '/registration',
    name: 'Registration',
    component: Registration,
    meta: { anonymous: true }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { anonymous: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { anonymous: true }
  },
  {
    path: "/:catchAll(.*)",
    name: 'PageNotFound',
    component: PageNotFound
  },
  {
    path: '/success',
    name: 'Success',
    component: Success
  },
  {
   path: '/cancel' ,
   name: 'Cancel',
   component: Cancel
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: { 
      name: 'Dashboard'
    },
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: '/leads',
        name: 'Leads',
        component: Leads
      },
      {
        path: '/sites',
        name: 'Sites',
        component: Sites
      },
      {
        path: '/consumer-data',
        name: 'Consumer Data',
        component: ConsumerData
      },
      {
        path: '/data-request',
        name: 'Data Request',
        component: DataRequestForm
      },
      {
        path: '/billing',
        name: 'Billing',
        component: Billing
      },
      {
        path: '/users',
        name: 'Users',
        component: Users
      },
      {
        path: '/support',
        name: 'Support',
        component: Support
      }
    ]
  },
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => !record.meta.anonymous)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
})