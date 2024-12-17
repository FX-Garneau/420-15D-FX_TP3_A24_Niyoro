<script setup>
import ItemCard from '@/components/ItemCard.vue';
import { useItemsStore } from '@/stores/items';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const itemId = useRoute().params.id

const itemsStore = useItemsStore()
const { items } = storeToRefs(itemsStore)

const item = computed(() => items.value.find(item => item._id === itemId))

const loading = ref(true)
itemsStore.syncItem(itemId).then(() => {
   loading.value = false
})
</script>

<template>
   <div class="container flex justify-center items-center p-4 min-w-xl">
      <ItemCard v-if="loading || item" :item="item" class="h-fit" />
      <div v-else class="w-full flex justify-center items-center">
         <div class="text-center">
            <i class="bi bi-exclamation-triangle text-warning text-9xl"></i>
            <h1 class="text-3xl">Item introuvable</h1>
            <p>Il semble que l'item que vous cherchez n'existe pas.</p>
         </div>
      </div>
   </div>
</template>

<style scoped></style>
