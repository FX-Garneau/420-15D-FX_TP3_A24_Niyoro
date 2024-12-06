import { useUserStore } from "./stores/user"

/**
 * @param {'GET'|'POST'|'PUT'|'DELETE'} method
 * @param {string} route
 * @param {object} [body]
 * @returns {Promise<{response: Response, json: any}>}
 */
export function APIRequest(method, route, body) {
   return new Promise((resolve, reject) => {
      const userStore = useUserStore()
      const endpoint = import.meta.env?.VITE_API_URL ?? ""
      fetch(endpoint + route, {
         method,
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
         },
         body: JSON.stringify(body)
      }).then(async response => {
         try {
            const json = await response.json()
            if (response.status === 401) {
               // If the user is authenticated and the server returns a 401 status code, the token is invalid, so we remove it
               if (userStore.isAuthenticated) userStore.logout()
               reject({ response, json })
            } else {
               resolve({ response, json })
            }
         } catch (error) {
            reject({ response, json: null })
         }
      }).catch((error) => {
         reject(error)
      })
   })
}
