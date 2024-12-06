<script setup>
defineProps({
   text: String,
   required: Boolean
})
</script>

<template>
   <label v-bind="$attrs" class="label-text text-left pb-1">
      {{ text }}
      <span v-if="required" class="text-error">*</span>
   </label>
</template>

<style scoped></style>