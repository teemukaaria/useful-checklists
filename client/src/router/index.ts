import {
  createRouter as create,
  createWebHistory,
  RouteRecordRaw
} from 'vue-router';

import { Store } from '@/store';
import { watchEffect } from 'vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: () => import('../views/Category.vue')
  },
  {
    path: '/checklist/:id/:inProgress?',
    name: 'Checklist',
    component: () => import('../views/Checklist.vue')
  },
  {
    path: '/checklist/create',
    name: 'ChecklistCreate',
    component: () => import('../views/CreateChecklist.vue'),
    props: route => ({ copy: route.query.copy })
  },
  {
    path: '/review/:id',
    name: 'SuggestionReview',
    component: () => import('../views/SuggestionReview.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  }
];

const router = create({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export const createRouter = (store: Store) => {
  router.beforeEach((to, from, next) => {
    const { user } = store.state.app;
    if (user === null && to.path !== '/login' && to.path !== '/register')
      return next('/login');
    next();
  });

  watchEffect(() => {
    if (
      store.state.app.user === null &&
      router.currentRoute.value.path !== '/login' &&
      router.currentRoute.value.path !== '/register'
    )
      router.replace('/login');
  });

  return router;
};

export default router;
