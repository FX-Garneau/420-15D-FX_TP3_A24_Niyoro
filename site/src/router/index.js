import { useUserStore } from '@/stores/user'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes: [
      {
         path: '/:tag?',
         name: 'home',
         meta: { title: 'Accueil' },
         component: () => import('@/views/HomeView.vue')
      },
      {
         path: '/signup',
         name: 'signup',
         meta: { title: 'Inscription', auth: false },
         component: () => import('@/views/SignupView.vue'),
      },
      {
         path: '/login',
         name: 'login',
         meta: { title: 'Connexion', auth: false },
         component: () => import('@/views/LoginView.vue'),
      },
      {
         path: '/item/:id',
         name: 'item',
         meta: {},
         component: () => import('@/views/ItemView.vue')
      },
      {
         path: '/add',
         name: 'add',
         meta: {}
      },
      {
         path: '/tags',
         name: 'tags',
         meta: { auth: true, admin: true }
      },
      {
         path: '/profile/:id?',
         name: 'profile',
         meta: { title: 'Profil', auth: true }
      }
   ],
})

router.beforeEach((to, from, next) => {
   const userStore = useUserStore()
   // If the route requires the user to not be authenticated and the user is authenticated
   if (to.meta.auth === false && userStore.isAuthenticated) return
   // If the route requires authentication and the user is not authenticated
   if (to.meta.auth === true && !userStore.isAuthenticated) return next({ name: 'login' })
   // If the route requires admin rights and the user is not an admin
   if (to.meta.admin === true && !userStore.account?.is_admin) return next({ name: 'home' })
   // Continue to the route
   next()
})

export default router