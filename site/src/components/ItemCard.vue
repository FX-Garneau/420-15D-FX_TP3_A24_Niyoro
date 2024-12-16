<script setup>
import { useTagsStore } from '@/stores/tags'

const props = defineProps({
   item: Object
})

const tagsStore = useTagsStore()

/** @type {import("../stores/types").Item} */
const item = props.item
</script>

<template>
   <div class="card card-compact card-bordered border-neutral w-96 shadow-xl glass !bg-none">
      <div class="card-body justify-between *:flex-grow-0">
         <h2 class="card-title flex items-center">
            <a v-if="item.url" :href="item.url" class="text-info">{{ item.title }} <i class="bi bi-link-45deg"></i></a>
            <template v-else>{{ item.title }}</template>
            <span class="flex-grow flex justify-end gap-2">
               <i v-if="item.private" class="bi bi-lock-fill text-error"></i>
               <i v-else class="bi bi-globe2 text-info"></i>
            </span>
         </h2>
         <p>{{ item.content }}</p>
         <div class="card-actions">
            <span>
               <i class="bi bi-tags-fill"></i>
               Tags:
            </span>
            <RouterLink v-for="tag in item.tags" class="badge badge-outline badge-primary-content"
               :to="{ name: 'home', params: { tag: tag } }">
               #{{ tagsStore.tags.find(t => t._id === tag)?.name }}
            </RouterLink>
         </div>
         <div>
            <i class="bi bi-calendar"></i>
            {{ new Date(item.createdAt).toLocaleDateString("fr-CA", {
               day: '2-digit', month: 'long', year: 'numeric',
               hour: '2-digit', minute: '2-digit'
            }) }}
         </div>
         <div>
            <RouterLink :to="{ name: 'profile', params: { id: item.created_by._id } }" class="text-primary">
               <i class="bi bi-person-fill"></i>
               {{ item.created_by.username }}
            </RouterLink>
         </div>
         <div class="card-actions items-center">
            <span class="flex-grow">
               <!-- Les consignes disent de mettre le permalien ici, mais cela ne fait pas de sens -->
               <!-- puisqu'il n'y a pas de page correspondant a cette route. Donc je vais mettre "/item/:id". -->
               <RouterLink :to="{ name: 'item', params: { id: item._id } }" class="link text-accent">
                  Détails
               </RouterLink>
            </span>
            <template v-if="item.isOwned">
               <button @click="item.sticky = !item.sticky, item.update()" class="btn btn-sm btn-square btn-secondary"
                  :class="{ 'btn-outline text-secondary': !item.sticky }">
                  <i class="bi" :class="item.sticky ? 'bi-pin-angle-fill' : 'bi-geo-fill'"></i>
               </button>
               <button @click="" class="btn btn-sm btn-square btn-outline btn-warning">
                  <i class="bi bi-pencil-square"></i>
               </button>
               <button @click="item.delete" class="btn btn-sm btn-square btn-outline btn-error">
                  <i class="bi bi-trash"></i>
               </button>
            </template>
         </div>
      </div>
   </div>
</template>

<style scoped></style>
