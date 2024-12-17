import { ref, computed } from 'vue'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { APIRequest } from '@/utils'
import { useUserStore } from './user'
import { useTagsStore } from './tags'

const { account } = storeToRefs(useUserStore())
const tagsStore = useTagsStore()
const { tags } = storeToRefs(tagsStore)

export const useItemsStore = defineStore('items', () => {
   const itemMap = ref(new Map())
   /** @type {import('vue').ComputedRef<import('./types').Item[]>} */
   const items = computed(() => {
      return [...itemMap.value.values()]
         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Trier les items par date de création
         .sort((a, b) => b.sticky - a.sticky) // Positionner les items épinglés en premier
   })

   /**
    * Create an item object with additional methods and accessors
    * @param {object} json
    * @returns {import('./types').Item}
    */
   function makeItemObject(json) {
      return {
         ...json,
         /** Whether the item is owned by the current user */
         get isOwned() {
            return this.created_by._id === account.value?._id
         },
         /** Toggle and update the sticky state of the item */
         async update() {
            await APIRequest('PUT', `/items/${this._id}`, this)
         },
         /** Delete the item */
         async delete() {
            await APIRequest('DELETE', `/items/${this._id}`).then(() => itemMap.value.delete(this._id))
         },
         reactions: [],
         /** Whether the current user has reacted to the item */
         get userReaction() {
            return this.reactions?.find(reaction => reaction.user_id === account.value?._id)
         },
         /** Sync the item's reactions */
         async syncReactions() {
            await APIRequest('GET', `/items/${this._id}/reactions`).then(data => {
               if (data.response.ok) this.reactions = data.json
            })
         },
         /** React to the item */
         async react(type) {
            await APIRequest('POST', `/items/${this._id}/reactions`, { type })
         },
         /** Delete the user's reaction */
         async unreact() {
            const reaction = this.userReaction
            if (reaction) await APIRequest('DELETE', `/reactions/${reaction._id}`)
         },
         /** Sync uncached tags, if there are any */
         async syncUncachedTags() {
            if (this.tags.some(tagId => !tags.value?.find(tag => tag._id === tagId)))
               await tagsStore.syncTags()
         }
      }
   }

   /**
    * Save the fetched item(s) to the cache
    * @param {object | object[]} json
    * @returns {void}
    */
   function saveToCache(json) {
      Array.isArray(json)
         ? json.forEach(item => itemMap.value.set(item._id, makeItemObject(item)))
         : itemMap.value.set(json._id, makeItemObject(json))
   }

   /**
    * Fetch data from the API and save it to the cache
    * @param {string} route 
    * @param {object} [body] 
    * @returns {Promise<{ response: Response, json: object | object[] }>}
    */
   function requestAndSaveToCache(route, body) {
      return new Promise((resolve, reject) => {
         APIRequest('GET', route, body).then(data => {
            if (data.response.ok)
               saveToCache(data.json)
            resolve(data)
         }, reject)
      })
   }

   const syncGlobalPublicItems = () => requestAndSaveToCache('/items')
   const syncUserPublicItems = (userId) => requestAndSaveToCache(`/users/${userId}/items`)
   const syncMyItems = () => requestAndSaveToCache('/me/items')
   const syncItem = (itemId) => requestAndSaveToCache(`/items/${itemId}`)

   return {
      items,
      syncGlobalPublicItems,
      syncUserPublicItems,
      syncMyItems,
      syncItem
   }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useItemsStore, import.meta.hot));
