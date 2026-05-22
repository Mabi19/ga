<template>
    <main>hi</main>
    <TheSettings :open="settingsOpen" @close="settingsOpen = false" />
    <button @click="settingsOpen = true">open settings</button>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TheSettings from "./components/TheSettings.vue";

const settingsOpen = ref(false);

// Is it even worth it to have a separate settings dialog?
// If it was just a pane, we would show the function side-by-side automatically!
// The settings we want:
// - Function expression
// - Domain
// - Parameter bit count
// - Population size
// - Crossover probability
// - Crossover method
// - Mutation probability
// - Mutation method
// - Selection method
// that's a lot of settings. Combined with showing the population view, there'd likely not be enough space.
// So yes, have separate settings. If the function graph is a component it's easy to include it in there anyway
</script>
