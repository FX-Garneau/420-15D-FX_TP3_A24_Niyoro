<script setup>
import Form from '@/components/Form.vue';
import FormComponent from '@/components/FormComponent.vue';
</script>

<template>
   <div class="self-center">
      <center>
         <h1 class="text-2xl mb-4">Connexion</h1>
      </center>
      <Form class="">
         <FormComponent kind="email" label="Adresse courriel" required />
         <FormComponent kind="password" label="Mot de passe" required />
         <button class="btn btn-success font-bold py-2 px-4 rounded-full">Connexion</button>
         <p>
            Pas de compte?
            <RouterLink :to="{ name: 'signup' }" class="link text-success">Se créer un compte</RouterLink>
         </p>
      </Form>
   </div>
</template>

<style scoped></style>
