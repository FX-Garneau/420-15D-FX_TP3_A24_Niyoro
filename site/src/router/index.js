import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes: [
      {
         path: '/',
         name: 'home',
         meta: { title: 'Accueil' },
         component: () => import('@/views/HomeView.vue'),
      },
      {
         path: '/signup',
         name: 'signup',
         meta: { title: 'Inscription', auth: false },
      },
      {
         path: '/login',
         name: 'login',
         meta: { title: 'Connexion', auth: false },
         component: () => import('@/views/LoginView.vue'),
      },
      {
         path: '/:tag',
         name: 'tag',
      },
      {
         path: '/item/:id',
         name: 'item',
      },
      {
         path: '/add',
         name: 'add',
      },
      {
         path: '/tags',
         name: 'tags',
      },
      {
         path: '/profile/:id?',
         name: 'profile',
         meta: { title: 'Profil' },
      }
   ],
})

// router.beforeEach((to, from, next) => {
//    // TODO: Make |tags route only available if connected user is admin
// })

export default router