<script setup>
import { useTagsStore } from '@/stores/tags';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const tagsStore = useTagsStore()
const { tags } = storeToRefs(tagsStore);

// Sync the tags with the store
tagsStore.syncTags()

const newName = ref('')

function updateTag(tag) {
   // Get the input
   const input = document.getElementById(tag._id)
   // Save the old name in case of error
   const oldName = tag.name
   try {
      // Validate the name
      if (!/^[A-z0-9\_\-]+$/.test(newName.value.trim()))
         throw new Error('Name is invalid')
      // Update the tag
      tag.name = newName.value
      tag.update().then(res => {
         if (!res?.response?.ok)
            throw new Error('Error')
         // Remove red border
         tag.isInvalid = false
         // Stop editing
         tag.isEditing = false
         // Sync the tags
         tagsStore.syncTags()
      })
   } catch (error) {
      // Revert the name
      tag.name = oldName
      // Add red border
      tag.isInvalid = true
      // Focus the input
      input?.focus()
   }
}
</script>

<template>
   <div class="card glass !bg-none h-fit my-auto">
      <div class="card-body">
         <h1 class="card-title text-2xl mb-4 justify-center">Liste des tags</h1>
         <div class="card-actions">
            <!-- <span v-for="tag in tags" class="glass !bg-none p-2 pl-3 rounded-full">
            </span> -->
            <span v-for="tag in tags" :key="tag._id" class="w-fit glass !bg-none rounded-box pr-2"
               :class="{ 'border-error border-solid': tag.isInvalid }">
               <input :id="tag._id" type="text" v-model="newName" :value="tag.isEditing ? newName : tag.name"
                  :disabled="!tag.isEditing" class="input !bg-transparent !border-none !outline-none !text-inherit" />
               <template v-if="tag.isEditing">
                  <button class="btn btn-sm btn-square btn-success mr-2" @click="updateTag(tag)"
                     :disabled="tag.name === newName">
                     <i class="bi bi-check"></i>
                  </button>
                  <button class="btn btn-sm btn-square btn-error"
                     @click="tag.isEditing = false; newName = tag.name; tag.isInvalid = false">
                     <i class="bi bi-x"></i>
                  </button>
               </template>
               <template v-else>
                  <button class="btn btn-sm btn-square btn-warning btn-outline mr-2"
                     @click="tag.isEditing = true; newName = tag.name">
                     <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-sm btn-square btn-error btn-outline" @click="tag.delete()">
                     <i class="bi bi-trash"></i>
                  </button>
               </template>
            </span>
         </div>
      </div>
   </div>
</template>

<style scoped></style>
