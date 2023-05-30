<script setup>
import BaseIcon from "@/components/BaseIcon.vue";
import { computed } from "vue";

const props = defineProps({
  icon: {
    type: String,
    default: null,
  },
  h: {
    type: String,
    default: null,
  },
  side: {
    type: String,
    default: null
  }
});

const inputElClass = computed(() => {
  const base = [
    "absolute top-0 z-10 pointer-events-none text-gray-500 dark:text-slate-400",
    props.side ? "right-0" : "left-0"
  ];
  return base;
});
</script>

<template>
  <BaseIcon
    :path="icon"
    w="w-10"
    :h="h"
    :class="inputElClass"
  />
</template>
