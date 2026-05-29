<!--
TODO
add a way to show bits instead of x/y
show heritage in expanded region (incl. jumping to parent. also, back button?)
sorting
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
                        <th>
                            <span>ID</span>
                            <SortButton
                                :ascending="sortColumn != 'id' || sortDirection == 'ascending'"
                                :descending="sortColumn != 'id' || sortDirection == 'descending'"
                                @click="sortBy('id')"
                            />
                        </th>
                        <th>
                            <span>X</span>
                            <SortButton
                                :ascending="sortColumn != 'x' || sortDirection == 'ascending'"
                                :descending="sortColumn != 'x' || sortDirection == 'descending'"
                                @click="sortBy('x')"
                            />
                        </th>
                        <th>
                            <span>Y</span>
                            <SortButton
                                :ascending="sortColumn != 'y' || sortDirection == 'ascending'"
                                :descending="sortColumn != 'y' || sortDirection == 'descending'"
                                @click="sortBy('y')"
                            />
                        </th>
                        <th>
                            <span>Fitness</span>
                            <SortButton
                                :ascending="sortColumn != 'fitness' || sortDirection == 'ascending'"
                                :descending="
                                    sortColumn != 'fitness' || sortDirection == 'descending'
                                "
                                @click="sortBy('fitness')"
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <PopulationRow
                        :chromosome="chromosome"
                        v-for="chromosome of sortedPopulation"
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
import { computed, ref } from "vue";
import PopulationRow from "./PopulationRow.vue";
import SortButton from "./SortButton.vue";
import WindowHeader from "./WindowHeader.vue";
import WindowHeaderButton from "./WindowHeaderButton.vue";

type SortColumn = "id" | "x" | "y" | "fitness";
type SortDirection = "ascending" | "descending";
const sortColumn = ref<SortColumn>("id");
const sortDirection = ref<SortDirection>("ascending");

const sortedPopulation = computed(() => {
    return State.population.value.toSorted((a, b) => {
        const orderMult = sortDirection.value == "descending" ? -1 : 1;
        const col = sortColumn.value;
        if (col == "fitness") {
            const aFit = State.targetFunction.value.eval(a.x, a.y);
            const bFit = State.targetFunction.value.eval(b.x, b.y);
            return orderMult * (aFit - bFit);
        } else if (col == "id") {
            // All chromosomes in the population list are guaranteed to be of the same generation, so we don't need to compare that.
            const aId = parseInt(a.id.split("#")[1]!);
            const bId = parseInt(b.id.split("#")[1]!);
            return orderMult * (aId - bId);
        } else {
            return orderMult * (a[col] - b[col]);
        }
    });
});

function sortBy(col: SortColumn) {
    if (sortColumn.value == col) {
        sortDirection.value = sortDirection.value == "ascending" ? "descending" : "ascending";
    } else {
        sortColumn.value = col;
        sortDirection.value = "ascending";
    }
}

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

    th button {
        vertical-align: middle;
    }

    tr:nth-child(even of .chromosome) {
        background-color: var(--bg-dim);
    }

    td {
        padding: 0.25em;
    }
}
</style>
