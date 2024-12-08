<script setup>
import { useTagsStore } from '@/stores/tags'

defineProps({
   item: Object
})

const tagsStore = useTagsStore()
</script>

<template>
   <div class="card card-bordered border-neutral bg-base-100 w-96 shadow-xl">
      <!-- <figure>
         <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="Shoes" />
      </figure> -->
      <div class="card-body">

         <h2 class="card-title">
            <a v-if="item.url" :href="item.url">{{ item.title }}</a>
            <template v-else>{{ item.title }}</template>
         </h2>
         <p>{{ item.content }}</p>
         <div class="card-actions justify-end">
            <span v-for="tag in tagsStore.idsToNames(item.tags, true)" class="badge badge-outline">{{ tag }}</span>
         </div>
      </div>
   </div>
</template>

<style scoped></style>
