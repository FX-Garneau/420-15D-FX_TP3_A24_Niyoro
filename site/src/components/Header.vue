<script setup>
import { useUserStore } from '@/stores/user';
import NavigationMenu from './NavigationMenu.vue';

const userStore = useUserStore();
</script>

<template>
   <header>
      <div class="navbar bg-base-100">
         <!-- Navigation Menu (Dropdown) -->
         <div class="flex-none">
            <div v-if="userStore.account" class="dropdown">
               <div tabindex="0" role="button" class="btn btn-square btn-ghost m-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     class="inline-block h-5 w-5 stroke-current">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16">
                     </path>
                  </svg>
               </div>
               <NavigationMenu dropdown :routes="[]" />
            </div>
         </div>
         <div class="flex-1">
            <!-- Logo -->
            <RouterLink :to="{ name: 'home' }" class="btn btn-ghost text-xl tracking-wider italic">Niyɔrɔ</RouterLink>
            <!-- Navigation Menu -->
            <NavigationMenu class="menu-horizontal gap-2" :routes="[]" />
         </div>
         <!-- Account + Avatar -->
         <div class="flex-none flex gap-2">
            <template v-if="userStore.account">
               <!-- Username -->
               <p class="m-0">{{ userStore.account.username }}</p>
               <!-- Avatar -->
               <div class="dropdown dropdown-end dropdown-hover">
                  <div tabindex="0" role="button" class="avatar">
                     <RouterLink to="/profile" class="w-10 h-10">
                        <img class="rounded-full" src="https://i.pravatar.cc/500?img=32" alt="avatar">
                     </RouterLink>
                  </div>
                  <NavigationMenu dropdown :routes="['profile']">
                     <li>
                        <button class="text-error" @click="userStore.logout">Déconnexion</button>
                     </li>
                  </NavigationMenu>
               </div>
            </template>
            <template v-else>
               <RouterLink to="/login" class="btn btn-success btn-outline">Connexion</RouterLink>
               <RouterLink to="/register" class="btn btn-success">Inscription</RouterLink>
            </template>
         </div>
      </div>
   </header>
</template>

<style scoped></style>
