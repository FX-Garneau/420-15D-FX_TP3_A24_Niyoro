<script setup>
import { useUserStore } from '@/stores/user';
import { APIRequest } from '@/utils';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const userStore = useUserStore()
const { account } = storeToRefs(userStore);

const route = useRoute()
const otherUserId = route.params.id

const accountData = ref(null)
const notFound = ref(false)

if (otherUserId) {
   APIRequest('GET', `/users/${otherUserId}`)
      .then(({ response, json }) => {
         console.log(json)
         if (response.ok) {
            accountData.value = json
         } else {
            notFound.value = true
         }
      })
      .catch(() => {
         notFound.value = true
      })
} else {
   accountData.value = account.value
}
</script>

<template>
   <div class="card card-side min-w-[46.5em] min-h-[18.75em]  h-fit my-auto"
      :class="{ 'skeleton': !accountData, 'glass !bg-none': accountData }">
      <template v-if="accountData">
         <figure>
            <img class="w-auto" :src="accountData.avatar" alt="Avatar" />
         </figure>
         <div class="divider divider-horizontal"></div>
         <div class="card-body *:h-min justify-between">
            <h1 class="card-title">Profile</h1>
            <div>Nom d'utilisateur: {{ accountData.username }}</div>
            <div>Prénom: {{ accountData.first_name }}</div>
            <div>Nom: {{ accountData.last_name }}</div>
            <div>Date d'inscription: {{ new Date(accountData.createdAt).toLocaleDateString("fr-CA", {
               day: '2-digit', month: 'long', year: 'numeric',
               hour: '2-digit', minute: '2-digit'
            }) }}
            </div>
         </div>
      </template>
      <template v-else-if="notFound">
         <div class="w-full h-full flex justify-center items-center mt-auto mb-auto">
            <div class="text-center">
               <i class="bi bi-exclamation-triangle text-warning text-8xl"></i>
               <h1 class="text-3xl">Utilisateur introuvable</h1>
               <p>L'utilisateur que vous cherchez n'existe pas.</p>
            </div>
         </div>
      </template>
   </div>
</template>

<style scoped></style>
