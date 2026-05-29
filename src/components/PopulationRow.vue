<template>
    <tr class="chromosome" v-bind="$attrs">
        <td>
            <button class="flat" @click.stop="isExpanded = !isExpanded">
                <MaterialIcon :name="isExpanded ? 'collapse_content' : 'expand_content'" />
            </button>
        </td>
        <td>{{ chromosome.id }}</td>
        <td>{{ formatNumber(chromosome.x) }}</td>
        <td>{{ formatNumber(chromosome.y) }}</td>
        <td>
            {{ formatNumber(State.targetFunction.value.eval(chromosome.x, chromosome.y)) }}
        </td>
    </tr>
    <tr v-if="isExpanded" class="chromosome-extra">
        <td class="chromosome-extra-wrapper" colspan="5">
            <div class="bits-row">
                <div class="bits-x cell">{{ chromosome.bits.slice(0, 6) }}</div>
                <div class="bits-y cell">{{ chromosome.bits.slice(6, 12) }}</div>
            </div>
        </td>
    </tr>
</template>

<script setup lang="ts">
import type { Chromosome } from "@/lib/evolution/chromosome";
import * as State from "@/state";
import { ref } from "vue";
import MaterialIcon from "./MaterialIcon.vue";

const { chromosome } = defineProps<{ chromosome: Chromosome }>();

function formatNumber(x: number) {
    return Math.round(x * 1000) / 1000;
}

const isExpanded = ref(false);
</script>

<!-- This is styled by ThePopulationView, except we control our contents. -->
<style scoped>
.cell {
    padding: 0.25em;
}

.chromosome-extra-wrapper {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / 6;
    padding: 0 !important;
}

.bits-row {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 3 / 5;
}

.bits-x {
    text-align: right;
}
.bits-y {
    text-align: left;
}
</style>
