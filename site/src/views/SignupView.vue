<script setup>
import Form from '@/components/Form.vue';
import FormComponent from '@/components/FormComponent.vue';
import FormErrors from '@/components/FormErrors.vue';
import router from '@/router/index';
import { useUserStore } from '@/stores/user';
import { APIRequest, validationRules } from '@/utils';
import { ref, useTemplateRef } from 'vue';

const userStore = useUserStore()

const validationMDPConfirm = [[v => v !== passwordInput.value?.$el.getElementsByTagName('input')?.namedItem('password')?.value, 'Doit être le même mot de passe']]

const error = ref(null)

async function signupFormCallback(data, components) {
   await APIRequest('POST', '/auth/signup', data)
      .then(async ({ response, json }) => {
         error.value = null
         if (response.ok) {
            // Store the token in the user store
            await userStore.login(json.token)
            router.push({ name: 'home' })
         } else {
            // Display the error message
            error.value = json?.message ?? 'Une erreur est survenue'
         }
      })
      .catch(error => {
         // Display the error message
         error.value = 'Une erreur est survenue'
         console.error(error)
      })
}

const passwordInput = useTemplateRef('passwordInput')
</script>

<template>
   <div class="self-center">
      <center>
         <h1 class="text-2xl mb-4">Inscription</h1>
      </center>
      <Form :callback="signupFormCallback">
         <FormErrors :error="error" />
         <div class="grid md:grid-cols-2 gap-4 *:w-72">
            <FormComponent kind="text" name="first_name" label="Prénom" required :rules="validationRules.maxchar50" />
            <FormComponent kind="text" name="last_name" label="Nom" required :rules="validationRules.maxchar50" />
            <FormComponent kind="text" name="username" label="Nom d'utilisateur" required
               :rules="validationRules.maxchar50" />
            <FormComponent kind="email" name="email" label="Adresse courriel" required :rules="validationRules.email" />
            <FormComponent kind="password" name="password" label="Mot de passe" required
               :rules="validationRules.password" ref="passwordInput" />
            <FormComponent kind="password" label="Confirmer le mot de passe" required :rules="validationMDPConfirm" />
         </div>
         <button class="btn btn-success font-bold py-2 px-4 rounded-full">S'inscrire</button>
         <p class="text-center">
            Déjà inscrit?
            <RouterLink :to="{ name: 'login' }" class="link text-success">Connexion</RouterLink>
         </p>
      </Form>
   </div>
</template>

<style scoped></style>
