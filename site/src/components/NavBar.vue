<script setup>
</script>

<template>
   <div class="navbar bg-base-100">
      <!-- Menu -->
      <div class="flex-none">
         <div class="dropdown dropdown-hover">
            <div tabindex="0" role="button" class="btn btn-square btn-ghost m-1">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  class="inline-block h-5 w-5 stroke-current">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16">
                  </path>
               </svg>
            </div>
            <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
               <li><a>Item 1</a></li>
               <li><a>Item 2</a></li>
            </ul>
         </div>
      </div>
      <!-- Logo -->
      <div class="flex-1">
         <a class="btn btn-ghost text-xl tracking-wider italic">Niyɔrɔ</a>
      </div>
      <!-- Account + Avatar -->
      <div class="flex-none">
         <!-- Username -->
         <p class="m-0">username</p>
         <!-- Avatar -->
         <div class="avatar">
            <RouterLink to="/profile" class=" ml-4 w-10 h-10">
               <img class="rounded-full" src="https://i.pravatar.cc/500?img=32" alt="avatar">
            </RouterLink>
         </div>
         <div class="dropdown dropdown-end dropdown-hover">
            <div tabindex="0" role="button" class="btn btn-square btn-ghost m-1">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  class="inline-block h-5 w-5 stroke-current">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7">
                  </path>
               </svg>
            </div>
            <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
               <li><a>Profile</a></li>
               <li><a>Settings</a></li>
               <li><a class="text-error">Logout</a></li>
            </ul>
         </div>
      </div>
   </div>
</template>

<style scoped></style>
