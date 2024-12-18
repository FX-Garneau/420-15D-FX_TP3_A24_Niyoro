<script setup>
import { useItemsStore } from '@/stores/items';
import { useTagsStore } from '@/stores/tags'
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
   itemId: { type: String, required: true },
   autoLoad: { type: Boolean, default: false }
})

// States
const route = useRoute()
const detailsMode = computed(() => route.name === 'item' && route.params.id === props.itemId)

// Stores
const { account } = storeToRefs(useUserStore())
const tagsStore = useTagsStore()
const itemsStore = useItemsStore()
const { items } = storeToRefs(itemsStore)

// Loading
const loading = ref(false)
const item = computed(() => items.value.find(item => item._id === props.itemId))
if (props.autoLoad && !item.value) {
   loading.value = true
   itemsStore.syncItem(props.itemId).then(async () => {
      await item.value.syncUncachedTags()
      await item.value.syncReactions();
      loading.value = false
   }).catch(() => {
      loading.value = false
   })
}

// Map
const randomMapId = Math.random().toString(36).substring(7)
const hasMap = computed(() => item.value?.latitude != null && item.value?.longitude != null)
onMounted(() => {
   setTimeout(() => renderMap(hasMap), 100)
   watch(() => hasMap, renderMap)
})

function renderMap(enabled) {
   if (enabled) {
      const map = L.map(randomMapId).setView([item.value.latitude, item.value.longitude], 13)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
      L.marker([item.value.latitude, item.value.longitude]).addTo(map)
   }
}

// Reactions
async function itemReact(type) {
   if (!item.value) return
   await item.value.unreact()
   if (item.value.userReaction?.type !== type)
      await item.value.react(type)
   await item.value.syncReactions()
}

// Other
window.scrollTo({ top: 0, behavior: 'smooth' })
</script>

<template>
   <div class="card card-compact card-bordered border-neutral min-w-96 min-h-48 shadow-xl" :class="{
      'skeleton': !item,
      'glass !bg-none': item
   }">
      <template v-if="item">
         <div class="card-body justify-between *:flex-grow-0">
            <!-- Top Bar -->
            <h2 class="card-title flex items-center">
               <!-- Title -->
               <a v-if="item.url" :href="item.url" class="text-info">{{ item.title }} <i
                     class="bi bi-link-45deg"></i></a>
               <template v-else>{{ item.title }}</template>
               <!-- Owner Actions -->
               <span class="flex-grow card-actions items-center justify-end">
                  <template v-if="item.isOwned">
                     <button @click="item.sticky = !item.sticky, item.update()"
                        class="btn btn-sm btn-square rounded-full btn-secondary"
                        :class="{ 'btn-outline text-secondary': !item.sticky }">
                        <i class="bi" :class="item.sticky ? 'bi-pin-angle-fill' : 'bi-geo-fill'"></i>
                     </button>
                     <button @click="" class="btn btn-sm btn-square rounded-full btn-outline btn-warning">
                        <i class="bi bi-pencil-square"></i>
                     </button>
                     <button @click="item.delete()" class="btn btn-sm btn-square rounded-full btn-outline btn-error">
                        <i class="bi bi-trash"></i>
                     </button>
                  </template>
                  <i v-if="item.private" class="bi bi-lock-fill text-error"></i>
                  <i v-else class="bi bi-globe2 text-info"></i>
               </span>
            </h2>
            <!-- Content -->
            <div class="border border-neutral-50 border-opacity-25 rounded p-2">
               {{ item.content }}
               <!-- Map -->
               <div :id="randomMapId" :key="randomMapId" class="hidden h-28 mt-3"
                  :class="{ '!block': detailsMode && hasMap }">
               </div>
            </div>
            <!-- Tags -->
            <div class="card-actions items-center">
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
            <!-- Bottom Bar -->
            <div class="card-actions items-center justify-end">
               <!-- Author -->
               <RouterLink :to="{ name: 'profile', params: { id: item.created_by._id } }"
                  class="text-secondary ml-0 mr-auto">
                  <i class="bi bi-person-fill"></i>
                  {{ item.created_by.username }}
               </RouterLink>
               <template v-if="detailsMode">
                  <!-- Reactions -->
                  <button class="btn btn-sm btn-secondary" @click="itemReact(1)" :disabled="!account"
                     :class="{ 'btn-outline': item.userReaction?.type !== 1 }">
                     <i class="bi bi-heart-fill"></i>
                     {{ item.reactions.filter(r => r.type === 1).length }}
                  </button>
                  <button class="btn btn-sm btn-warning" @click="itemReact(2)" :disabled="!account"
                     :class="{ 'btn-outline': item.userReaction?.type !== 2 }">
                     <i class="bi bi-lightbulb-fill"></i>
                     {{ item.reactions.filter(r => r.type === 2).length }}
                  </button>
                  <button class="btn btn-sm btn-success" @click="itemReact(3)" :disabled="!account"
                     :class="{ 'btn-outline': item.userReaction?.type !== 3 }">
                     <i class="bi bi-emoji-laughing-fill"></i>
                     {{ item.reactions.filter(r => r.type === 3).length }}
                  </button>
                  <button class="btn btn-sm btn-error" @click="itemReact(4)" :disabled="!account"
                     :class="{ 'btn-outline': item.userReaction?.type !== 4 }">
                     <i class="bi bi-exclamation-triangle-fill"></i>
                     {{ item.reactions.filter(r => r.type === 4).length }}
                  </button>
                  <!-- Retour -->
                  <!-- <button @click="history.back()" class="btn btn-sm btn-outline btn-accent">
                     <i class="bi bi-arrow-left"></i>
                     Retour
                  </button> -->
               </template>
               <!-- Details -->
               <RouterLink v-if="!detailsMode" :to="{ name: 'item', params: { id: item._id } }"
                  class="btn btn-sm btn-accent btn-outline">
                  <!-- Les consignes disent de mettre le permalien ici, mais cela ne fait pas de sens -->
                  <!-- puisqu'il n'y a pas de page correspondant a cette route. Donc je vais mettre "/item/:id". -->
                  <i class="bi bi-info-circle"></i>
                  Détails
               </RouterLink>
            </div>
         </div>
      </template>
      <template v-else-if="!loading">
         <div class="w-full h-full flex justify-center items-center mt-auto mb-auto">
            <div class="text-center">
               <i class="bi bi-exclamation-triangle text-warning text-4xl"></i>
               <h1 class="text-3xl">Item introuvable</h1>
               <p>L'item que vous cherchez n'existe pas.</p>
            </div>
         </div>
      </template>
   </div>
</template>

<style scoped></style>
