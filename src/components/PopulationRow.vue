<template>
    <tr class="chromosome">
        <td>
            <button class="flat">
                <MaterialIcon
                    :name="isExpanded ? 'collapse_content' : 'expand_content'"
                    @click="isExpanded = !isExpanded"
                />
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
        <td>btn</td>
        <td colspan="4">hi</td>
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

<!-- This is styled by ThePopulationView. -->
