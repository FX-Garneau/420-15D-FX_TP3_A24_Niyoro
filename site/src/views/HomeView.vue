<script setup>
import FormComponent from '@/components/FormComponent.vue'
import ItemCard from '@/components/ItemCard.vue'
import { useItemsStore } from '@/stores/items'
import { useTagsStore } from '@/stores/tags'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// Initier l'état du filtre "Montrer seulement mes items" à faux
const onlyMine = ref(false);

// Récupérer les stores
const userStore = useUserStore()
const { account } = storeToRefs(userStore)
const tagsStore = useTagsStore()
const { tags } = storeToRefs(tagsStore)
const itemsStore = useItemsStore()
const { items } = storeToRefs(itemsStore)

// Filtrer les items visibles
const route = useRoute()
const filteredTag = computed(() => route.params.tag && tags.value.find(tag => tag._id === route.params.tag || tag.name === decodeURIComponent(route.params.tag)))
const visibleItems = computed(() => {
   const _items = onlyMine.value && account.value
      ? items.value.filter(item => item.isOwned)
      : items.value.filter(item => item.private === false)
   return filteredTag.value
      ? _items.filter(item => item.tags.includes(filteredTag.value._id))
      : _items
})

watch(() => route.params.tag, newTag => {
   if (newTag) {
      const matchingTag = tags.value.find(tag => tag._id === newTag)
      if (matchingTag)
         window.history.replaceState({}, '', '/' + encodeURIComponent(matchingTag.name))
   }
})

// Récupérer les items et les tags
const refreshing = ref(false)
async function refresh() {
   try {
      refreshing.value = true
      await tagsStore.syncTags()
      await itemsStore.syncGlobalPublicItems()
      if (userStore.isAuthenticated)
         await itemsStore.syncMyItems()
   } catch {
      // Ignorer les erreurs
   } finally {
      setTimeout(() => {
         refreshing.value = false
      }, 100);
   }
}
refresh()
</script>

<template>
   <div class="container flex flex-col gap-8 w-full p-4">
      <h1 class="text-3xl">Accueil</h1>
      <div>
         <h2 class="text-xl mb-2">Filtres</h2>
         <template v-if="account">
            <FormComponent kind="checkbox" label="Montrer seulement mes items" v-model="onlyMine" />
         </template>
         <div v-else class="tooltip tooltip-bottom" data-tip="Vous devez être connecter pour utiliser cette option">
            <FormComponent kind="checkbox" label="Montrer seulement mes items" v-model="onlyMine" disabled />
         </div>
      </div>
      <div>
         <h2 class="text-xl mb-2 flex items-center gap-2">
            Items
            <button @click="refresh" class="btn btn-xs btn-square btn-accent btn-outline">
               <span v-if="refreshing" class="loading loading-spinner loading-xs"></span>
               <i v-else class="bi bi-arrow-clockwise"></i>
            </button>
         </h2>
         <div class="flex flex-wrap gap-4">
            <ItemCard v-for="item in visibleItems" :key="item._id" :itemId="item._id" />
         </div>
      </div>
   </div>
</template>

<style scoped></style>
