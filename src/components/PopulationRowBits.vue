<template>
    <span v-for="(bit, idx) of bits" :class="{ highlight: highlight[idx] }" :key="idx">{{
        bit
    }}</span>
</template>

<script setup lang="ts">
const { bits, highlight } = defineProps<{ bits: string; highlight: boolean[] }>();
</script>

<style scoped>
.highlight {
    color: red;
}
</style>
