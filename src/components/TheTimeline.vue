<template>
    <div id="timeline" ref="timeline">
        <label
            v-for="idx in State.generations.value.length"
            :key="idx"
            :data-id="idx"
            class="timeline-entry"
        >
            <input
                type="radio"
                name="timeline"
                :value="idx - 1"
                v-model="stringGen"
                class="timeline-input"
            />
            <span class="timeline-label">{{ idx - 1 }}</span>
        </label>
    </div>
</template>

<script setup lang="ts">
import * as State from "@/state";
import { computed, nextTick, useTemplateRef, watch } from "vue";

const stringGen = computed({
    get: () => State.currentGeneration.value.toString(),
    set: (v) => (State.currentGeneration.value = parseInt(v)),
});

const timeline = useTemplateRef("timeline");

watch(State.currentGeneration, () => {
    nextTick(() => {
        const el = timeline.value?.querySelector(
            `label[data-id="${State.currentGeneration.value}"]`,
        );
        el?.scrollIntoView({
            behavior: "smooth",
            inline: "center",
        });
    });
});
</script>

<style scoped>
#timeline {
    display: flex;
    flex-flow: row nowrap;
    overflow-x: auto;
    flex-shrink: 0;
    scrollbar-width: thin;
}

.timeline-input {
    display: none;
}

.timeline-label {
    display: block;
    padding: 0.25em 0.5em;
    background-color: var(--input-bg);
    border: 1px solid var(--input-dim);
    border-radius: 0.25em 0.25em 0 0;

    user-select: none;
}

.timeline-label:hover {
    box-shadow: 0px 2px 4px 2px var(--input-shadow-color-active);
}

.timeline-input:checked + .timeline-label {
    background-color: var(--input-dim);
    margin-top: 0.25em;
    padding-bottom: 0;
    box-shadow: none;
}
</style>
