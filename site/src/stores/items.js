import { ref, readonly, computed } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { APIRequest } from '@/utils'

export const useItemsStore = defineStore('items', () => {
   // The last items fetched
   const items = ref(new Map())

   function saveItemToCache(item) {
      items.value.set(item.id, item)
   }

   function fetchAndSyncItems(route, body) {
      return new Promise((resolve, reject) => {
         APIRequest('GET', route, body).then(data => {
            if (data.response.ok) data.json.forEach(item => saveItemToCache(item))
            resolve(data)
         }, reject)
      })
   }

   const syncGlobalPublicItems = () => fetchAndSyncItems('/items')
   const syncUserPublicItems = (userId) => fetchAndSyncItems(`/users/${userId}/items`)
   const syncMyItems = () => fetchAndSyncItems('/me/items')
   const syncItem = (itemId) => fetchAndSyncItems(`/items/${itemId}`)

   return {
      items: computed(() => [...items.value.values()]),
      syncGlobalPublicItems,
      syncUserPublicItems,
      syncMyItems,
      syncItem
   }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useItemsStore, import.meta.hot));
