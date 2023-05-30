<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  titleClass: {
    type:String,
    default: ""
  }
});
</script>

<template>
  <div class="flex items-center justify-between mb-3">
    <h1 :class="'text-2xl ' + titleClass">
      {{ title }}
    </h1>
    <slot />
  </div>
</template>
