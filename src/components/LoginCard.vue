<script setup>
import { computed } from "vue";
import CardBox from "@/components/CardBox.vue";
import HeaderLogin from "@/components/HeaderLogin.vue";

</script>

<template>
    <div>
        <loginHeader></loginHeader>
        <slot name="card"/>
    </div>
</template>
