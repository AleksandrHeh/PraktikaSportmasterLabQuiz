import { createRouter, createWebHistory } from 'vue-router';

import LoginComponent from '../components/LoginComponent.vue';
import RegisterComponent from '../components/RegisterComponent.vue';
import QuizComponent from '../components/QuizComponent.vue';
import CommonForm from '../components/CommonForm.vue';

const routes = [

  {
    path: '/',
    name: 'CommonForm',
    component: CommonForm
  },
  {
    path: '/login',
    name: 'login',
    component: LoginComponent
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterComponent
  },
  {
    path: '/quiz',
    name: 'Quiz',
    component: QuizComponent
  }
];



const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
