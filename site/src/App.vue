<script setup>
import { RouterView } from 'vue-router'
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
</script>

<template>
   <div class="min-h-screen flex flex-col">
      <Header />

      <main class="flex-grow p-2 flex justify-center">
         <RouterView />
      </main>
   </div>

   <Footer />
</template>

<style scoped></style>
