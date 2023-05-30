<script>
import { computed, ref, reactive } from "vue";

const props = defineProps({
  art: [Array, Object],
});

</script>

<template>
    <tr>
        <td class="py-1">1</td>
        <td class="py-1">$21.20</td>
        <td class="py-1">------</td>
        <td class="py-1">------</td>
        <td class="py-1">1.01%</td>
    </tr>

    <tr>
        <td class="py-1">1</td>
        <td class="py-1">$21.20</td>
        <td class="py-1">$19.90</td>
        <td class="py-1">$1.30</td>
        <td class="py-1">1.01%</td>
    </tr>

    <tr>
        <td class="py-1">1</td>
        <td class="py-1">$21.20</td>
        <td class="py-1">$19.90</td>
        <td class="py-1">$1.30</td>
        <td class="py-1">1.01%</td>
    </tr>

    <tr>
        <td class="py-1">1</td>
        <td class="py-1">$21.20</td>
        <td class="py-1">$19.90</td>
        <td class="py-1">$1.30</td>
        <td class="py-1">1.01%</td>
    </tr>
    <div class="mt-3"></div>
</template>