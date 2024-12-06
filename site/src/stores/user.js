import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { APIRequest } from '@/utils'

export const useUserStore = defineStore('user', () => {
   // The user account data
   const account = ref(null)

   // Get the token from the local storage
   const authToken = ref(localStorage.getItem('token'))
   watch(authToken, (newToken) => newToken ? localStorage.setItem('token', newToken) : localStorage.removeItem('token'));

   // Short hand to check if the user is connected
   const isAuthenticated = computed(() => !!authToken.value)

   // Sync the user data from the server
   async function sync() {
      return new Promise((resolve, reject) => {
         APIRequest('GET', '/me').then(data => {
            account.value = data
            resolve(data)
         });
      });
   }

   // Logout the user and redirect to the login page
   function logout() {
      authToken.value = null
      router.push({ name: 'login' })
   }

   // Login the user
   function login(email, password) {
      return new Promise((resolve, reject) => {
         APIRequest('POST', '/login', { email, password }).then(data => {
            authToken.value = data.token
            resolve(data)
         });
      });
   }

   return {
      account,
      authToken,
      isAuthenticated,
      sync,
      logout,
      login
   }
})
