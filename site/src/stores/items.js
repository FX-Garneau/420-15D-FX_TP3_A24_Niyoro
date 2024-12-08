import { ref, computed } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { APIRequest } from '@/utils'

export const useItemsStore = defineStore('items', () => {
   // The last items fetched
   const itemMap = ref(new Map())
   const items = computed(() => [...itemMap.value.values()])

   function fetchAndSync(route, body) {
      return new Promise((resolve, reject) => {
         APIRequest('GET', route, body).then(data => {
            if (data.response.ok)
               Array.isArray(data.json)
                  ? data.json.forEach(item => itemMap.value.set(item._id, item))
                  : itemMap.value.set(data.json._id, data.json)
            resolve(data)
         }, reject)
      })
   }

   const syncGlobalPublicItems = () => fetchAndSync('/items')
   const syncUserPublicItems = (userId) => fetchAndSync(`/users/${userId}/items`)
   const syncMyItems = () => fetchAndSync('/me/items')
   const syncItem = (itemId) => fetchAndSync(`/items/${itemId}`)

   return {
      items,
      syncGlobalPublicItems,
      syncUserPublicItems,
      syncMyItems,
      syncItem
   }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useItemsStore, import.meta.hot));
