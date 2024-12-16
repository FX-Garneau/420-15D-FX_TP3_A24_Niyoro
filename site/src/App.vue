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

<style>
body {
   background-image: url("https://image-processor-storage.s3.us-west-2.amazonaws.com/uploads/b5c4700668ebee95676a7a75ab54fa20/abstractjpg.jpg");
   background-size: cover;
   background-repeat: no-repeat;
   background-attachment: fixed;
}

.btn-success {
   color: var(--fallback-bc, oklch(var(--bc)/var(--tw-text-opacity)))
}


.menu li>*:not(ul, .menu-title, details, .btn):active,
.menu li>*:not(ul, .menu-title, details, .btn).active,
.menu li>details>summary:active {
   background-color: rgb(255 255 255 / 15%);
}
</style>
