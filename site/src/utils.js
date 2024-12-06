import router from "./router/index"
import { useUserStore } from "./stores/user"

/**
 * @param {'GET'|'POST'|'PUT'|'DELETE'} method
 * @param {string} route
 * @param {object} [body]
 * @returns 
 */
export function APIRequest(method, route, body) {
   return new Promise((resolve, reject) => {
      const user = useUserStore()
      const endpoint = import.meta.env?.VITE_API_URL ?? "";
      fetch(endpoint + route, {
         method,
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
         },
         body
      }).then((response) => {
         if (response.ok) {
            resolve(response.json())
         } else {
            if (response.status === 401) {
               // If the user is authenticated and the server returns a 401 status code, the token is invalid, so we remove it
               if (user.isAuthenticated) user.authToken = null
               // We redirect the user to the login page
               router.push({ name: 'login' })
               reject(response)
            }
         }
      }).catch((error) => {
         reject(error)
      })
   })
}
