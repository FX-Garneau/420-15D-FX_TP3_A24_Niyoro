import { ref, computed } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { APIRequest } from '@/utils'

export const useTagsStore = defineStore('tags', () => {
   // The last items fetched
   const tagMap = ref(new Map())
   /** @type {import('vue').ComputedRef<import('./types').Tag[]>} */
   const tags = computed(() => [...tagMap.value.values()])

   /**
    * Create an item object with additional methods and accessors
    * @param {object} json
    * @returns {import('./types').Tag}
    */
   function makeTagObject(json) {
      return {
         ...json,
         /** Update the tag with the current data */
         async update() {
            return await APIRequest('PUT', `/tags/${this._id}`, this)
         },
      }
   }

   /**
    * Save the fetched tag(s) to the cache
    * @param {object | object[]} json
    * @returns {void}
    */
   function saveToCache(json) {
      Array.isArray(json)
         ? json.forEach(tag => tagMap.value.set(tag._id, makeTagObject(tag)))
         : tagMap.value.set(json._id, makeTagObject(json))
   }

   /**
    * Fetch data from the API and save it to the cache
    * @param {string} route 
    * @param {object} [body] 
    * @returns {Promise<{ response: Response, json: object | object[] }>}
    */
   function requestAndSaveToCache(route) {
      return new Promise((resolve, reject) => {
         APIRequest('GET', route).then(data => {
            if (data.response.ok)
               saveToCache(data.json)
            resolve(data)
         }, reject)
      })
   }

   const syncTags = () => requestAndSaveToCache('/tags')
   const syncTag = (tagId) => requestAndSaveToCache(`/tags/${tagId}`)

   function namesToIds(names, keepInvalid = false) {
      return names.map(name => tags.value.find(tag => tag.name === name)?._id ?? (keepInvalid ? name : null)).filter(id => id !== null)
   }

   function idsToNames(ids, keepInvalid = false) {
      return ids.map(id => tagMap.value.get(id)?.name ?? (keepInvalid ? id : null)).filter(name => name !== null)
   }

   return {
      tags,
      syncTags,
      syncTag,
      namesToIds,
      idsToNames
   }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useTagsStore, import.meta.hot));
