<template>
    <span class="material-symbols-rounded">{{ name }}</span>
</template>

<script setup lang="ts">
const { name } = defineProps<{ name: string }>();
</script>

<style>
.material-icons-rounded {
    user-select: none;
}
</style>
