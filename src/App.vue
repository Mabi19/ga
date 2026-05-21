<template>
    <main>hi</main>
    <TheSettings :open="settingsOpen" @close="settingsOpen = false" />
    <button @click="settingsOpen = true">open settings</button>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TheSettings from "./components/TheSettings.vue";

const settingsOpen = ref(false);
</script>
