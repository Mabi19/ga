<!--
TODO
add a way to highlight chromosomes on the graph (hover/tap)
add a way to show bits instead of x/y
show heritage in expanded region (incl. jumping to parent. also, back button?)
-->

<template>
    <div class="population-view">
        <WindowHeader title="Population">
            <WindowHeaderButton icon="fullscreen" />
        </WindowHeader>
        <div class="population-table-wrapper">
            <table id="population-table">
                <thead>
                    <tr class="header">
                        <th><!-- expand button --></th>
                        <th>ID</th>
                        <th>X</th>
                        <th>Y</th>
                        <th>Fitness</th>
                    </tr>
                </thead>
                <tbody>
                    <PopulationRow
                        :chromosome="chromosome"
                        v-for="chromosome of State.population.value"
                        :key="chromosome.id"
                        :class="
                            State.highlightID.value == chromosome.id && hasStrongHighlight
                                ? 'active'
                                : null
                        "
                        @click="strongHighlight(chromosome)"
                        @mouseenter="weakHighlightIn(chromosome)"
                        @mouseleave="weakHighlightOut()"
                    />
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Chromosome } from "@/lib/evolution/chromosome";
import * as State from "@/state";
import { ref } from "vue";
import PopulationRow from "./PopulationRow.vue";
import WindowHeader from "./WindowHeader.vue";
import WindowHeaderButton from "./WindowHeaderButton.vue";

// If this is true, an entry was clicked, and hovering does nothing.
const hasStrongHighlight = ref(false);

function weakHighlightIn(chromosome: Chromosome) {
    if (hasStrongHighlight.value) {
        return;
    }
    State.highlightID.value = chromosome.id;
}

function weakHighlightOut() {
    if (hasStrongHighlight.value) {
        return;
    }
    State.highlightID.value = null;
}

function strongHighlight(chromosome: Chromosome) {
    if (hasStrongHighlight.value) {
        if (State.highlightID.value == chromosome.id) {
            // the element is still hovered
            hasStrongHighlight.value = false;
        } else {
            State.highlightID.value = chromosome.id;
        }
    } else {
        State.highlightID.value = chromosome.id;
        hasStrongHighlight.value = true;
    }
}
</script>

<style scoped>
.population-view {
    display: flex;
    flex-flow: column nowrap;
}

.population-table-wrapper {
    flex-grow: 1;
    overflow-y: auto;
}
</style>

<style>
/* this affects the styles of PopulationRows as well */
#population-table {
    width: 100%;

    display: grid;
    grid-template-columns: max-content max-content auto auto auto;

    thead,
    tbody {
        display: contents;
    }

    .chromosome,
    .chromosome-extra,
    .header {
        display: grid;
        grid-template-columns: subgrid;
        grid-column: 1 / 6;
        align-items: center;
    }

    .chromosome:hover {
        box-shadow: inset 0px 0px 0px 3px rgb(from var(--accent) r g b / 0.4);
    }

    .chromosome.active {
        box-shadow: inset 0px 0px 0px 3px var(--accent);
    }

    .chromosome-extra {
        background-color: var(--bg-dimmer);
    }

    tr:nth-child(even of .chromosome) {
        background-color: var(--bg-dim);
    }

    td {
        padding: 0.25em;
    }
}
</style>
