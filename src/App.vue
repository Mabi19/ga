<template>
    <main id="main-grid">
        <ThePopulationView class="grid-population" />
        <TheFunctionView class="grid-function" />
        <TheFitnessView class="grid-fitness" />
    </main>
    <!-- todo: timeline -->
    <div id="status-bar" class="dark">
        <div class="generation">Generation ?</div>
        <div class="controls">
            <button @click="settingsOpen = true"><MaterialIcon name="settings" /></button>
        </div>
    </div>

    <TheSettings :open="settingsOpen" @close="settingsOpen = false" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import MaterialIcon from "./components/MaterialIcon.vue";
import TheFitnessView from "./components/TheFitnessView.vue";
import TheFunctionView from "./components/TheFunctionView.vue";
import ThePopulationView from "./components/ThePopulationView.vue";
import TheSettings from "./components/TheSettings.vue";

const settingsOpen = ref(false);

// Is it even worth it to have a separate settings dialog?
// If it was just a pane, we would show the function side-by-side automatically!
// The settings we want:
// - Function expression
// - Domain
// - Population size
// - Crossover probability
// - Crossover method
// - Mutation probability
// - Mutation method
// - Selection method
// that's a lot of settings. Combined with showing the population view, there'd likely not be enough space.
// So yes, have separate settings. If the function graph is a component it's easy to include it in there anyway
</script>

<style scoped>
/* the #app lives in index.html */
:global(#app) {
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    display: flex;
    flex-flow: column nowrap;
}

#main-grid {
    flex-grow: 1;
    min-height: 0;

    display: grid;
    grid-template-areas:
        "a b"
        "a c";
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
}

.grid-population {
    grid-area: a;
    min-height: 0;
}

.grid-function {
    grid-area: b;
    min-height: 0;
}

.grid-fitness {
    grid-area: c;
    min-height: 0;
}

#status-bar {
    padding: 0.5em;
    background-color: var(--accent);
    color: white;

    display: flex;
    flex-flow: row nowrap;
    gap: 0.5em;
    justify-content: space-between;
    align-items: center;

    .generation {
        font-weight: bold;
    }
}
</style>
