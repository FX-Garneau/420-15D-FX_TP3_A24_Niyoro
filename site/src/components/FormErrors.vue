<script setup>
import { computed } from 'vue';

const props = defineProps({
   error: String
})

const formattedError = computed(() => props.error?.replace("|", '<div class="divider my-0"></div>'))
</script>

<template>
   <div v-if="error" v-html="formattedError"
      class="flex flex-col gap-0 alert text-warning border-warning bg-warning bg-opacity-15"></div>
</template>

<style scoped></style>
