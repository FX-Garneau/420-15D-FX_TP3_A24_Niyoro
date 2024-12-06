<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/HeaderContent.vue';
import FooterContent from './components/FooterContent.vue';
</script>

<template>
   <header>
      <NavBar />
   </header>

   <RouterView />

   <footer>
      <FooterContent />
   </footer>
</template>

<style scoped></style>
