<script setup>
import router from '@/router/index';
import { useUserStore } from '@/stores/user';
import { computed } from 'vue';

const userStore = useUserStore();

const props = defineProps({
   dropdown: {
      type: Boolean,
      default: false
   },
   routes: {
      type: Array,
      required: false
   }
})

const allRoutes = router.getRoutes().filter(route => route.name && route.meta.title)

const selectedRoutes = computed(() => {
   return (props.routes ?? allRoutes.map(r => r.name))
      .map(name => allRoutes.find(r => r.name === name))
      .filter(r => r.name && r.meta.title)
      .filter(route => route.meta?.auth == null || userStore.isAuthenticated == route.meta?.auth)
})
</script>

<template>
   <ul class="menu"
      :class="$props.dropdown ? 'dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow border border-neutral' : ''"
      :tabindex="$props.dropdown ? '0' : ''">
      <li v-for="route in selectedRoutes">
         <RouterLink v-if="allRoutes.find(r => r.name === route.name)" :to="{ name: route.name }"
            :class="router.currentRoute.value.name === route.name ? 'active' : ''">
            {{ route.meta.title ?? route.name }}
         </RouterLink>
      </li>
      <slot></slot>
   </ul>
</template>

<style scoped></style>
