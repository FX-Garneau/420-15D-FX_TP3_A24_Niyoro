<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'

const props = defineProps({
   action: String,
   method: String,
   callback: Function
})

const components = new Map()

function registerComponent(name, component) {
   components.set(name, component)
}

function isValid() {
   return components.values()
      .map(component => component.exposed?.validate?.())
      .every(result => result === true)
}

// Get the form element and apply the validation before submitting
const formRef = ref()
const instance = getCurrentInstance()
onMounted(() => {
   if (instance == null)
      throw new Error("Instance is null")
   formRef.value?.addEventListener("submit", (event) => {
      if (props.callback != null) {
         event.preventDefault()
         if (isValid()) {
            const data = Object.fromEntries(new FormData(formRef.value).entries())
            props.callback.call(instance, data, components)
         }
      }
   })
})

defineExpose({
   registerComponent,
   isValid
})
</script>

<template>
   <form ref="formRef" :action="action" :method="method" class="flex flex-col gap-4" novalidate>
      <slot></slot>
   </form>
</template>

<style scoped></style>