<template>
    <div class="fitness-view">
        <WindowHeader title="Fitness"></WindowHeader>
        <div id="fitness-graph">
            <canvas ref="canvas"></canvas>
        </div>
    </div>
</template>

<script setup lang="ts">
import { initCharts } from "@/chart-init.ts";
import * as State from "@/state";
import { Chart, type ChartData } from "chart.js";
import { computed, shallowRef, useTemplateRef, watch } from "vue";
import WindowHeader from "./WindowHeader.vue";

type FitnessGraphData = ChartData<"line">;

initCharts();

const data = computed(() => {
    const maxFitnesses: number[] = [];
    const minFitnesses: number[] = [];
    for (const gen of State.generations.value) {
        let maxFit = -Infinity;
        let minFit = Infinity;
        for (const chromosome of gen) {
            const val = State.targetFunction.value.eval(chromosome.x, chromosome.y);
            maxFit = Math.max(maxFit, val);
            minFit = Math.min(minFit, val);
        }
        maxFitnesses.push(maxFit);
        minFitnesses.push(minFit);
    }

    return {
        labels: Array.from({ length: State.generations.value.length }).map((_, idx) => idx),
        datasets: [
            {
                label: "Max Fitness",
                data: maxFitnesses,
                borderColor: "#663399",
                fill: "+1",
                backgroundColor: "#6633992f",
            },
            { label: "Min Fitness", data: minFitnesses, borderColor: "#6633997f" },
        ],
    } satisfies FitnessGraphData;
});

const canvas = useTemplateRef("canvas");
const chart = shallowRef<Chart>();
watch(canvas, () => {
    if (canvas.value) {
        chart.value = new Chart(canvas.value, {
            type: "line",
            data: data.value,
            options: {
                maintainAspectRatio: false,
                animation: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: (items) => {
                                return `Generation ${items[0]?.label}`;
                            },
                        },
                    },
                },
            },
        });
    }
});

watch(data, () => {
    if (chart.value) {
        chart.value.data = data.value;
        chart.value.update();
    }
});

document.fonts.addEventListener("loadingdone", () => {
    chart.value?.update();
});
</script>

<style scoped>
.fitness-view {
    display: flex;
    flex-flow: column nowrap;
    min-width: 0;
}

#fitness-graph {
    flex-grow: 1;
    min-width: 0;
    min-height: 0;
    position: relative;
    overflow: hidden;
}

canvas {
    width: 100%;
    height: 100%;
}
</style>
