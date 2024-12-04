import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes: [
      {
         path: '/',
         name: 'home',
      },
      {
         path: '/signup',
         name: 'signup',
      },
      {
         path: '/login',
         name: 'login',
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
      }
   ],
})

router.beforeEach((to, from, next) => {
   // TODO: Make |tags route only available if connected user is admin
})

export default router