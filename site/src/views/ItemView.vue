<script setup>
import ItemCard from '@/components/ItemCard.vue';
import { useRoute } from 'vue-router';

const itemId = useRoute().params.id
</script>

<template>
   <div class="container flex justify-center items-center p-4 min-w-xl">
      <ItemCard autoLoad :itemId="itemId" class="h-fit" />
   </div>
</template>

<style scoped></style>
