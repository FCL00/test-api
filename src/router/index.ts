import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import UserProfileView from '@/views/UserProfileView.vue'
import MainLayout from '@/layout/MainLayout.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'home', component: HomeView },
      { path: '/users/:id', name: 'user', component: UserProfileView },
      { path: '/:pathMatch(.*)*', name: 'notFound', component: NotFound },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
  scrollBehavior(to, from, next) {
    return { top: 0, left: 0 }
  },
})

export default router
