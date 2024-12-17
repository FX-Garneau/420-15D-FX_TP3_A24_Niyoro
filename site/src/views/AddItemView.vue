<script setup>
import Form from '@/components/Form.vue';
import FormComponent from '@/components/FormComponent.vue';
import FormErrors from '@/components/FormErrors.vue';
import router from '@/router/index';
import { APIRequest, validationRules } from '@/utils';
import { ref } from 'vue';

const error = ref(null)

async function addItemFormCallback(data, components) {
   if (!data.latitude && !data.longitude) {
      delete data.latitude
      delete data.longitude
   }
   data.private = Boolean(data.private)
   if (data.tags?.trim()) {
      data.tags = data.tags.trim().split(' ').map(tag => tag.trim()).filter(Boolean)
   }
   await APIRequest('POST', '/items', data)
      .then(async ({ response, json }) => {
         error.value = null
         if (response.ok) {
            // Redirect to the item page
            await router.push({ name: 'home', params: { id: json.data?._id } })
         } else {
            if (Object.keys(json?.data ?? {})) {
               // Display the form errors next to the fields
               if (json.data && typeof json.data === "object") {
                  for (const [key, value] of Object.entries(json.data)) {
                     const errorList = components.get(key)?.exposed?.errors;
                     if (errorList) errorList.value = [value];
                  }
               }
            } else {
               // Display the error message
               error.value = json?.message ?? 'Une erreur est survenue'
            }
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
               <FormComponent kind="text" name="title" label="Titre" required />
               <FormComponent kind="text" name="url" label="URL" :rules="validationRules.url" />
               <FormComponent kind="text" name="content" label="Contenu" />
               <FormComponent kind="text" name="tags" label="Tags" :rules="validationRules.tagList" />
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
