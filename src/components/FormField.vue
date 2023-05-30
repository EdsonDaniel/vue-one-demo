<script setup>
import { computed, useSlots } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: null,
  },
  labelFor: {
    type: String,
    default: null,
  },
  help: {
    type: String,
    default: null,
  },

  wrapClass:{
    type: String,
    default: null,
  },

  otherClasses:{
    type: String,
    default: null,
  },
});

const slots = useSlots();

const wrapperClass = computed(() => {
  const base = [];
  const slotsLength = slots.default().length;

  if(props.wrapClass === "row"){
    base.push("flex flex-row gap-3");
  }
  else{
    if (slotsLength > 1) {
      //base.push("grid grid-cols-1 gap-3");
      base.push("grid grid-cols-4 gap-3");
    }
    if (slotsLength === 3) {
      base.push("md:grid-cols-3");
    }
    if (slotsLength === 2) {
      base.push("md:grid-cols-2");
    }
    if (slotsLength === 4) {
      base.push("md:grid-cols-4");
    }

    /*if (slotsLength === 5) {
      base.push("md:grid-cols-5");
    }*/
  }

  return base;
});

const parentClases = computed(() => {
  const base = [" last:mb-0", props.otherClasses ? props.otherClasses : ""];
  return base;
});
</script>

<template>
  <div :class="parentClases">
    <label v-if="label" :for="labelFor" class="block font-bold mb-2">{{
      label
    }}</label>
    <div :class="wrapperClass">
      <slot />
    </div>
    <div v-if="help" class="text-xs text-gray-500 dark:text-slate-400 mt-1">
      {{ help }}
    </div>
  </div>
</template>
