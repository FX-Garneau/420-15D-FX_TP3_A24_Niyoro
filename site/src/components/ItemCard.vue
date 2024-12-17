<script setup>
import { useTagsStore } from '@/stores/tags'
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
   item: Object
})

const tagsStore = useTagsStore()

/** @type {import("../stores/types").Item} */
const item = props.item
const detailsMode = computed(() => useRoute().params.id === item._id)
</script>

<template>
   <div class="card card-compact card-bordered border-neutral w-96 shadow-xl glass !bg-none">
      <div class="card-body justify-between *:flex-grow-0" :class="{ 'skeleton': !item }">
         <!-- Top Bar -->
         <h2 class="card-title flex items-center">
            <a v-if="item.url" :href="item.url" class="text-info">{{ item.title }} <i class="bi bi-link-45deg"></i></a>
            <template v-else>{{ item.title }}</template>
            <!-- Owner Actions -->
            <span class="flex-grow card-actions justify-end">
               <template v-if="item.isOwned">
                  <button @click="item.sticky = !item.sticky, item.update()"
                     class="btn btn-sm btn-square rounded-full btn-secondary"
                     :class="{ 'btn-outline text-secondary': !item.sticky }">
                     <i class="bi" :class="item.sticky ? 'bi-pin-angle-fill' : 'bi-geo-fill'"></i>
                  </button>
                  <button @click="" class="btn btn-sm btn-square rounded-full btn-outline btn-warning">
                     <i class="bi bi-pencil-square"></i>
                  </button>
                  <button @click="item.delete" class="btn btn-sm btn-square rounded-full btn-outline btn-error">
                     <i class="bi bi-trash"></i>
                  </button>
               </template>
               <i v-if="item.private" class="bi bi-lock-fill text-error"></i>
               <i v-else class="bi bi-globe2 text-info"></i>
            </span>
         </h2>
         <!-- Content -->
         <p class="border border-neutral-50 border-opacity-25 rounded p-2">{{ item.content }}</p>
         <!-- Tags -->
         <div class="card-actions">
            <i class="bi bi-tags-fill"></i>
            <RouterLink v-for="tag in item.tags" class="" :to="{ name: 'home', params: { tag: tag } }">
               #{{ tagsStore.tags.find(t => t._id === tag)?.name }}
            </RouterLink>
         </div>
         <!-- Date -->
         <div>
            <i class="bi bi-calendar"></i>
            {{ new Date(item.createdAt).toLocaleDateString("fr-CA", {
               day: '2-digit', month: 'long', year: 'numeric',
               hour: '2-digit', minute: '2-digit'
            }) }}
         </div>
         <!-- Author -->
         <div class="flex justify-between">
            <RouterLink :to="{ name: 'profile', params: { id: item.created_by._id } }" class="text-secondary">
               <i class="bi bi-person-fill"></i>
               {{ item.created_by.username }}
            </RouterLink>
            <!-- Details -->
            <span class="ml-auto mr-0" v-if="!detailsMode">
               <!-- Les consignes disent de mettre le permalien ici, mais cela ne fait pas de sens -->
               <!-- puisqu'il n'y a pas de page correspondant a cette route. Donc je vais mettre "/item/:id". -->
               <RouterLink :to="{ name: 'item', params: { id: item._id } }" class="link text-accent">
                  Détails
               </RouterLink>
            </span>
         </div>
      </div>
   </div>
</template>

<style scoped></style>
