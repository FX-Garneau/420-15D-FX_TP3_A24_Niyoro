<script setup>
import Form from '@/components/Form.vue';
import FormComponent from '@/components/FormComponent.vue';
import FormErrors from '@/components/FormErrors.vue';
import { APIRequest, validationRules } from '@/utils';
import { ref } from 'vue';

const error = ref(null)

async function addItemFormCallback(data, components) {
   if (!data.latitude && !data.longitude) {
      delete data.latitude
      delete data.longitude
   }
   await APIRequest('POST', '/items', data)
      .then(async ({ response, json }) => {
         error.value = null
         if (response.ok) {
            console.log("ok")
         } else {
            // Display the error message
            error.value = json?.message ?? 'Une erreur est survenue'
            console.log("not ok", json?.data)
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
      <div class="card glass !bg-none">
         <Form :callback="addItemFormCallback" class="card-body">
            <h1 class="card-title text-2xl mb-4 justify-center">Ajouter un item</h1>
            <FormErrors :error="error" />
            <div class="grid md:grid-cols-2 gap-4 *:w-72">
               <FormComponent kind="text" name="title" label="Titre" required :rules="validationRules.maxChar100" />
               <FormComponent kind="text" name="url" label="URL" :rules="validationRules.url" />
               <FormComponent kind="text" name="content" label="Contenu" />
               <FormComponent kind="text" name="tags" label="Tags" />
               <FormComponent kind="number" name="latitude" label="Latitude" :rules="validationRules.latitude" />
               <FormComponent kind="number" name="longitude" label="Longitude" :rules="validationRules.longitude" />
               <FormComponent kind="checkbox" name="private" label="Privé" checked />
            </div>
            <button type="submit" class="btn btn-success font-bold py-2 px-4 rounded-full">
               Ajouter l'item
            </button>
         </Form>
      </div>
   </div>
</template>

<style scoped></style>
