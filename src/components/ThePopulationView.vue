<!--
TODO
adjust spacing (this'll need to have the table turned into a grid, with a subgrid for each row...)
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
                    />
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as State from "@/state";
import PopulationRow from "./PopulationRow.vue";
import WindowHeader from "./WindowHeader.vue";
import WindowHeaderButton from "./WindowHeaderButton.vue";
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
