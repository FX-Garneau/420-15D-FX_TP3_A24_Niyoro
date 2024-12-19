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
      const endpoint = import.meta.env?.VITE_API_URL ?? "http://localhost:8080"
      fetch(endpoint + route, {
         method,
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
         },
         body: JSON.stringify(body),
         signal: AbortSignal.timeout(5000)
      }).then(async response => {
         try {
            // If the user is authenticated and the server returns a 401 status code, the token is invalid, so we remove it
            if (response.status === 401 && userStore.isAuthenticated) userStore.logout()
            resolve({ response, json: await response.json() })
         } catch (error) {
            reject({ response, json: null })
         }
      }, reject)
   })
}


const regexCourriel = new RegExp(/^(?<localPart>(?<dotString>[0-9a-z!#$%&'*+-\/=?^_`\{|\}~\u{80}-\u{10FFFF}]+(\.[0-9a-z!#$%&'*+-\/=?^_`\{|\}~\u{80}-\u{10FFFF}]+)*)|(?<quotedString>"([\x20-\x21\x23-\x5B\x5D-\x7E\u{80}-\u{10FFFF}]|\\[\x20-\x7E])*"))(?<!.{64,})@(?<domainOrAddressLiteral>(?<addressLiteral>\[((?<IPv4>\d{1,3}(\.\d{1,3}){3})|(?<IPv6Full>IPv6:[0-9a-f]{1,4}(:[0-9a-f]{1,4}){7})|(?<IPv6Comp>IPv6:([0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,5})?::([0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,5})?)|(?<IPv6v4Full>IPv6:[0-9a-f]{1,4}(:[0-9a-f]{1,4}){5}:\d{1,3}(\.\d{1,3}){3})|(?<IPv6v4Comp>IPv6:([0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,3})?::([0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,3}:)?\d{1,3}(\.\d{1,3}){3})|(?<generalAddressLiteral>[a-z0-9-]*[[a-z0-9]:[\x21-\x5A\x5E-\x7E]+))\])|(?<Domain>(?!.{256,})(([0-9a-z\u{80}-\u{10FFFF}]([0-9a-z-\u{80}-\u{10FFFF}]*[0-9a-z\u{80}-\u{10FFFF}])?))(\.([0-9a-z\u{80}-\u{10FFFF}]([0-9a-z-\u{80}-\u{10FFFF}]*[0-9a-z\u{80}-\u{10FFFF}])?))*))$/iu)

export const validationRules = {
   maxchar50: [[v => v.trim().length > 50, 'Doit contenir au plus 50 caractères']],
   maxChar100: [[v => v.trim().length > 100, 'Doit contenir au plus 100 caractères']],
   email: [[v => !regexCourriel.test(v.trim()), 'Format invalide']],
   password: [[v => v.trim().length < 6, 'Doit contenir au moins 6 caractères']],
   latitude: [[v => +v < -90 || +v > 90, 'Doit être entre -90 et 90']],
   longitude: [[v => +v < -180 || +v > 180, 'Doit être entre -180 et 180']],
   url: [[v => !/^(http|https):\/\/[^ "]+$/.test(v.trim()), 'Format invalide']],
   tagList: [[v => v && !v?.split(" ").every(tag => /^[A-z0-9\_\-]+$/.test(tag.trim())), 'Tags invalides']]
}