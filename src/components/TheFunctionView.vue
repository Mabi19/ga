<template>
    <div class="function-view">
        <WindowHeader title="Function">
            <WindowHeaderButton icon="fullscreen" />
        </WindowHeader>
        <FunctionGraph
            :func="State.targetFunction.value"
            :domain="State.targetFunctionDomain.value"
            :markers="true"
            class="function-view-graph"
        />
    </div>
</template>

<script setup lang="ts">
import * as State from "@/state";
import FunctionGraph from "./FunctionGraph.vue";
import WindowHeader from "./WindowHeader.vue";
import WindowHeaderButton from "./WindowHeaderButton.vue";
</script>

<style scoped>
.function-view {
    display: flex;
    flex-flow: column nowrap;
}

.function-view-graph {
    width: 100%;
    height: 100%;
}
</style>
