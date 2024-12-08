import { ref, computed } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { APIRequest } from '@/utils'

export const useTagsStore = defineStore('tags', () => {
   // The last items fetched
   const tagMap = ref(new Map())
   const tags = computed(() => [...tagMap.value.values()])

   function fetchAndSync(route) {
      return new Promise((resolve, reject) => {
         APIRequest('GET', route).then(data => {
            if (data.response.ok)
               Array.isArray(data.json)
                  ? data.json.forEach(item => tagMap.value.set(item.id, item))
                  : tagMap.value.set(data.json.id, data.json)
            resolve(data)
         }, reject)
      })
   }

   const syncTags = () => fetchAndSync('/tags')
   const syncTag = (tagId) => fetchAndSync(`/tags/${tagId}`)

   function namesToIds(names, keepInvalid = false) {
      return names.map(name => tags.value.find(tag => tag.name === name)?.id ?? (keepInvalid ? name : null)).filter(id => id !== null)
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
