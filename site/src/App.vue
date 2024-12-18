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
   background-image: url("https://iili.io/2hQeqml.jpg");
   background-size: cover;
   background-repeat: no-repeat;
   background-attachment: fixed;
}

.btn-success,
.btn-warning,
.btn-error,
.btn-info,
.btn-primary,
.btn-secondary,
.btn-accent {
   color: var(--fallback-bc, oklch(var(--bc)/var(--tw-text-opacity)));
}

.btn-success.btn-outline:hover,
.btn-warning.btn-outline:hover,
.btn-error.btn-outline:hover,
.btn-info.btn-outline:hover,
.btn-primary.btn-outline:hover,
.btn-secondary.btn-outline:hover,
.btn-accent.btn-outline:hover {
   color: var(--fallback-bc, oklch(var(--bc)/var(--tw-text-opacity))) !important;
}


.menu li>*:not(ul, .menu-title, details, .btn):active,
.menu li>*:not(ul, .menu-title, details, .btn).active,
.menu li>details>summary:active {
   background-color: rgb(255 255 255 / 15%);
}
</style>
