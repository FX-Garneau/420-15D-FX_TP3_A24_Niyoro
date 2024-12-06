import { ref, computed, readonly } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { APIRequest } from '@/utils'


export const useUserStore = defineStore('user', () => {
   // Get the token from the local storage
   const _authToken = ref(localStorage.getItem('token'))

   // Short hand to check if the user is connected
   const isAuthenticated = computed(() => !!_authToken.value)

   // The user account data
   const account = ref(null)
   if (isAuthenticated.value) login(_authToken.value)

   // Sync the user data from the server
   async function sync() {
      return new Promise((resolve, reject) => {
         APIRequest('GET', '/me').then(data => {
            if (data.response.ok) account.value = data.json
            resolve(data)
         }, reject)
      })
   }

   // Login the user
   function login(authToken) {
      _authToken.value = authToken
      localStorage.setItem('token', authToken)
      sync()
   }

   // Logout the user
   function logout() {
      _authToken.value = null
      localStorage.removeItem('token')
      account.value = null
   }

   return {
      account,
      authToken: readonly(_authToken),
      isAuthenticated,
      sync,
      logout,
      login
   }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
