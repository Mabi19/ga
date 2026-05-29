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
            <div class="heritage-row" v-if="chromosome.heritage.length == 0">
                <div class="origin cell"><abbr title="Randomly generated">rnd</abbr></div>
                <div class="bits-x cell">{{ chromosome.bits.slice(0, 6) }}</div>
                <div class="bits-y cell">{{ chromosome.bits.slice(6, 12) }}</div>
            </div>
            <template v-else>
                <!-- eslint-disable-next-line vue/require-v-for-key -->
                <div class="heritage-row" v-for="entry of chromosome.heritage">
                    <template v-if="entry.type == 'parent'">
                        <div class="goto cell">
                            <button class="flat"><MaterialIcon name="jump_to_element" /></button>
                        </div>
                        <div class="origin cell">{{ entry.parent.id }}</div>
                        <div class="bits-x cell">
                            <PopulationRowBits
                                :bits="entry.parent.bits.slice(0, 6)"
                                :highlight="entry.usedBits.slice(0, 6)"
                            />
                        </div>
                        <div class="bits-y cell">
                            <PopulationRowBits
                                :bits="entry.parent.bits.slice(6, 12)"
                                :highlight="entry.usedBits.slice(6, 12)"
                            />
                        </div>
                    </template>
                    <template v-if="entry.type == 'mutate'"
                        ><div class="origin cell"><abbr title="Mutated">mut</abbr></div>
                        <div class="bits-x cell">
                            <PopulationRowBits
                                :bits="chromosome.bits.slice(0, 6)"
                                :highlight="entry.flippedBits.slice(0, 6)"
                            />
                        </div>
                        <div class="bits-y cell">
                            <PopulationRowBits
                                :bits="chromosome.bits.slice(6, 12)"
                                :highlight="entry.flippedBits.slice(6, 12)"
                            />
                        </div>
                    </template>
                </div>
            </template>
        </td>
    </tr>
</template>

<script setup lang="ts">
import type { Chromosome } from "@/lib/evolution/chromosome";
import * as State from "@/state";
import { ref } from "vue";
import MaterialIcon from "./MaterialIcon.vue";
import PopulationRowBits from "./PopulationRowBits.vue";

const { chromosome } = defineProps<{ chromosome: Chromosome }>();

function formatNumber(x: number) {
    return Math.round(x * 1000) / 1000;
}

const isExpanded = ref(false);
</script>

<!-- This is partly styled by ThePopulationView, except we control our contents. -->
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

.heritage-row {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / 6;
}

.origin {
    grid-column: 2;
    text-align: left;
}

.bits-x {
    grid-column: 3;
    text-align: right;
}
.bits-y {
    grid-column: 4;
    text-align: left;
}
</style>
