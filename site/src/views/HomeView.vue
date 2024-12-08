<script setup>
import FormComponent from '@/components/FormComponent.vue';
import ItemCard from '@/components/ItemCard.vue';
import { useItemsStore } from '@/stores/items';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { computed, ref, watchEffect } from 'vue';

// Initier l'état du filtre "Montrer seulement mes items" à faux
const onlyMine = ref(false);

// Récupérer les stores
const userStore = useUserStore();
const itemsStore = useItemsStore();
const { items } = storeToRefs(itemsStore);

// Filtrer les items visibles
const visibleItems = computed(() =>
   onlyMine.value === true
      ? items.value.filter(item => item.created_by === userStore.account?.id)
      : items.value.filter(item => item.private === false)
)

// Récupérer les items
const loadingItems = ref(false);
async function refreshItems() {
   try {
      loadingItems.value = true;
      await itemsStore.syncGlobalPublicItems();
      if (userStore.isAuthenticated)
         await itemsStore.syncMyItems();
   } catch {
      // Ignorer les erreurs
   } finally {
      setTimeout(() => {
         loadingItems.value = false;
      }, 100);
   }
}
refreshItems();
</script>

<template>
   <div class="container flex flex-col gap-8 w-full">
      <h1 class="text-3xl">Accueil</h1>
      <div>
         <h2 class="text-xl mb-2">Filtres</h2>
         <FormComponent kind="checkbox" label="Montrer seulement mes items" v-model="onlyMine" />
      </div>
      <div>
         <h2 class="text-xl mb-2 flex items-center gap-2">
            Items
            <button @click="refreshItems" class="btn btn-xs btn-square btn-accent btn-outline">
               <span v-if="loadingItems" class="loading loading-spinner loading-xs"></span>
               <i v-else class="bi bi-arrow-clockwise"></i>
            </button>
         </h2>
         <div class="flex flex-col gap-4">
            <ItemCard v-for="item in visibleItems" :item="item" />
         </div>
      </div>
   </div>
</template>

<style scoped></style>
