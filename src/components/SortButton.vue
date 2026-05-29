<template>
    <button class="raw sort-button">
        <svg viewBox="0 0 16 16" width="16" height="16">
            <path d="M 8 0 L 14 6 L 2 6 Z" stroke-linejoin="round" v-if="up" />
            <path d="M 8 16 L 14 10 L 2 10 Z" stroke-linejoin="round" v-if="down" />
        </svg>
    </button>
</template>

<script setup lang="ts">
const { ascending: up, descending: down } = defineProps<{
    ascending: boolean;
    descending: boolean;
}>();
</script>

<style scoped>
.sort-button {
    background: none;
    border: none;

    &:hover {
        opacity: 0.75;
    }

    &:active {
        opacity: 0.6;
    }
}
</style>
