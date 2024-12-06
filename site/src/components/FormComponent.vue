<script setup>
import { ref, computed, getCurrentInstance } from 'vue'
import FormLabel from './FormLabel.vue';
import FormComponentErrors from './FormComponentErrors.vue';

const props = defineProps({
   kind: String,
   name: String,
   label: String,
   rules: Array,
   required: Boolean
})

const _this = getCurrentInstance()
setTimeout(() => {
   // Climb parent chain until we find the form, then register this component
   let parent = _this?.parent
   let depth = 0
   while (parent && parent.exposed && !("registerComponent" in parent.exposed) && depth++ < 50)
      parent = parent.parent
   parent?.exposed?.registerComponent?.(props.name, _this)
})

// Create the error list object
const errors = ref([])

// Get child v-model and create validation function
const v_model = ref()

const validate = () => !(
   errors.value = (props.rules ?? [])
      ?.map(rule => v_model.value && rule?.[0](v_model.value) ? rule[1] : null)
      ?.concat([!v_model.value && props.required ? "Ce champ est requis" : null])
      ?.filter(result => !!result)
).length

defineExpose({ name: props.name, errors, validate, setValue: (value) => v_model.value = value })

defineOptions({
   inheritAttrs: false,
})

const borderColor = computed(() => ({ "!border-error": !!errors.value.length }))
</script>

<template>
   <div class="form-control w-full">
      <!-- Template for text/password/email -->
      <template v-if="['text', 'password', 'email'].includes(kind)">
         <FormLabel v-if="label" :text="label" :required="required" />
         <input v-bind="$attrs" v-model="v_model" @input="validate" :type="kind" :name="name"
            class="input input-bordered focus:outline-none" :class="borderColor" />
      </template>

      <!-- Template for checkbox -->
      <template v-else-if="kind === 'checkbox'">
         <div class="flex gap-2">
            <input v-bind="$attrs" v-model="v_model" @change="validate" :type="kind" :name="name" class="checkbox"
               :class="borderColor" />
            <FormLabel v-if="label" :text="label" :required="required" class="!p-0" />
         </div>
      </template>

      <!-- Template for dates -->
      <template v-else-if="kind === 'date'">
         <FormLabel v-if="label" :text="label" :required="required" />
         <input v-bind="$attrs" v-model="v_model" @input="validate" :type="kind" :name="name"
            class="input input-bordered focus:outline-none" :class="borderColor" />
      </template>

      <!-- Template for number pickers -->
      <template v-else-if="kind === 'number'">
         <FormLabel v-if="label" :text="label" :required="required" />
         <input v-bind="$attrs" v-model="v_model" min="0" @input="validate" :type="kind" :name="name"
            class="input input-bordered focus:outline-none" :class="borderColor" />
      </template>

      <!-- Error messages -->
      <template v-if="kind !== 'betNumber'">
         <FormComponentErrors :errors="errors" />
      </template>
   </div>
</template>

<style scoped></style>