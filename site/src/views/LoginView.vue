<script setup>
import Form from '@/components/Form.vue';
import FormComponent from '@/components/FormComponent.vue';
import router from '@/router/index';
import { useUserStore } from '@/stores/user';
import { APIRequest, validationRules } from '@/utils';
import { ref } from 'vue';

const userStore = useUserStore()

const error = ref(null)

async function loginFormCallback(data, components) {
   await APIRequest('POST', '/auth/login', data)
      .then(async ({ response, json }) => {
         error.value = null
         if (response.ok) {
            // Store the token in the user store
            await userStore.login(json.token)
            router.push({ name: 'home' })
         } else {
            // Display the error message
            error.value = json?.message?.replace("|", "<br>") ?? 'Une erreur est survenue'
         }
      })
      .catch(error => {
         // Display the error message
         error.value = 'Une erreur est survenue'
         console.error(error)
      })
}
</script>

<template>
   <div class="self-center">
      <center>
         <h1 class="text-2xl mb-4">Connexion</h1>
      </center>
      <Form :callback="loginFormCallback">
         <FormComponent kind="email" name="email" label="Adresse courriel" required />
         <FormComponent kind="password" name="password" label="Mot de passe" required />
         <button class="btn btn-success font-bold py-2 px-4 rounded-full">Se connecter</button>
         <p class="text-center">
            Pas de compte?
            <RouterLink :to="{ name: 'signup' }" class="link text-success">Inscription</RouterLink>
         </p>
         <!-- Error Alert -->
         <div v-if="error" v-html="error" class="alert text-warning border border-warning bg-warning bg-opacity-15">
         </div>
      </Form>
   </div>
</template>

<style scoped></style>
