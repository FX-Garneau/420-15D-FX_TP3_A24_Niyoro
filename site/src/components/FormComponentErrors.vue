<script setup>
defineProps({
   errors: Array
})
</script>

<template>
   <div v-if="errors.length" class="flex flex-col justify-start ps-3 pt-1">
      <span v-for="(error, index) in errors" :key="index" class="label-text-alt text-error">
         {{ error }}
      </span>
   </div>
</template>

<style scoped></style>