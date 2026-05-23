<template>
    <div class="header">
        <div class="title">{{ title }}</div>
        <div class="buttons">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
const { title } = defineProps<{
    title: string;
}>();
</script>

<style scoped>
.header {
    background-color: var(--accent);
    color: white;
    padding: 0.5em;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5em;
}

.title {
    font-weight: bold;
    padding-left: 0.25em;
}

.buttons > :deep(button) {
    border-radius: 0.5em;
}
</style>
