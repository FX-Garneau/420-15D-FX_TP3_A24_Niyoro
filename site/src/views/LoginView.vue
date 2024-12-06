<script setup>
import Form from '@/components/Form.vue';
import FormComponent from '@/components/FormComponent.vue';
import router from '@/router/index';
import { useUserStore } from '@/stores/user';
import { APIRequest } from '@/utils';

const userStore = useUserStore()

const regexCourriel = new RegExp(/^(?<localPart>(?<dotString>[0-9a-z!#$%&'*+-\/=?^_`\{|\}~\u{80}-\u{10FFFF}]+(\.[0-9a-z!#$%&'*+-\/=?^_`\{|\}~\u{80}-\u{10FFFF}]+)*)|(?<quotedString>"([\x20-\x21\x23-\x5B\x5D-\x7E\u{80}-\u{10FFFF}]|\\[\x20-\x7E])*"))(?<!.{64,})@(?<domainOrAddressLiteral>(?<addressLiteral>\[((?<IPv4>\d{1,3}(\.\d{1,3}){3})|(?<IPv6Full>IPv6:[0-9a-f]{1,4}(:[0-9a-f]{1,4}){7})|(?<IPv6Comp>IPv6:([0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,5})?::([0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,5})?)|(?<IPv6v4Full>IPv6:[0-9a-f]{1,4}(:[0-9a-f]{1,4}){5}:\d{1,3}(\.\d{1,3}){3})|(?<IPv6v4Comp>IPv6:([0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,3})?::([0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,3}:)?\d{1,3}(\.\d{1,3}){3})|(?<generalAddressLiteral>[a-z0-9-]*[[a-z0-9]:[\x21-\x5A\x5E-\x7E]+))\])|(?<Domain>(?!.{256,})(([0-9a-z\u{80}-\u{10FFFF}]([0-9a-z-\u{80}-\u{10FFFF}]*[0-9a-z\u{80}-\u{10FFFF}])?))(\.([0-9a-z\u{80}-\u{10FFFF}]([0-9a-z-\u{80}-\u{10FFFF}]*[0-9a-z\u{80}-\u{10FFFF}])?))*))$/iu)

const validationRules = {
   email: [[v => !regexCourriel.test(v), 'Format invalide']],
   password: [[v => v.trim().length < 6, 'Doit contenir au moins 6 caractères']]
}

async function loginFormCallback(data, components) {
   await APIRequest('POST', '/auth/login', data)
      .then(async ({ response, json }) => {
         if (response.ok) {
            // Store the token in the user store
            userStore.login(json.token)
            router.push({ name: 'home' })
         } else {
            console.warn(json)
         }
      })
      .catch(error => {
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
         <FormComponent kind="email" name="email" label="Adresse courriel" required :rules="validationRules.email" />
         <FormComponent kind="password" name="password" label="Mot de passe" required
            :rules="validationRules.password" />
         <button class="btn btn-success font-bold py-2 px-4 rounded-full">Connexion</button>
         <p>
            Pas de compte?
            <RouterLink :to="{ name: 'signup' }" class="link text-success">Se créer un compte</RouterLink>
         </p>
      </Form>
   </div>
</template>

<style scoped></style>
