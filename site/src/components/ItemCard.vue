<script setup>
import { useTagsStore } from '@/stores/tags'

defineProps({
   item: Object
})

const tagsStore = useTagsStore()
</script>

<template>
   <div class="card card-compact card-bordered border-neutral bg-base-100 w-96 shadow-xl">
      <!-- <figure>
         <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="Shoes" />
      </figure> -->
      <div class="card-body">
         <h2 class="card-title flex items-center">
            <a v-if="item.url" :href="item.url" class="text-info">{{ item.title }} <i class="bi bi-link-45deg"></i></a>
            <template v-else>{{ item.title }}</template>
            <span class="flex-grow flex justify-end gap-2">
               <i v-if="item.sticky" class="bi bi-pin-angle-fill text-warning"></i>
               <i v-if="item.private" class="bi bi-lock-fill text-error"></i>
               <i v-else class="bi bi-globe2 text-info"></i>
            </span>
         </h2>
         <p>{{ item.content }}</p>
         <div class="card-actions justify-end">
            <span v-for="tag in tagsStore.idsToNames(item.tags, true)" class="badge badge-outline">{{ tag }}</span>
         </div>
      </div>
   </div>
</template>

<style scoped></style>
