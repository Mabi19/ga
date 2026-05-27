<template>
    <Teleport to="body">
        <dialog closedby="any" ref="dialog" class="settings" @close="emit('close')">
            <WindowHeader title="Settings">
                <WindowHeaderButton @click="emit('close')" icon="close" />
            </WindowHeader>
            <div class="settings-content">
                <fieldset id="settings-function">
                    <legend>Function</legend>
                    <div class="function-content">
                        <div class="function-parameters">
                            <div class="function-expression">
                                <label for="function-expression">Expression</label>
                                <input
                                    type="text"
                                    name="function-expression"
                                    placeholder="f(x, y) ="
                                    v-model="State.targetFunctionExpression.value"
                                />
                                <WarningLabel v-if="!State.targetFunctionIsValid.value"
                                    >Invalid expression</WarningLabel
                                >
                            </div>
                            <div class="function-domain">
                                <strong>Domain</strong>
                                <div>
                                    <span>x ∈ [</span>
                                    <input
                                        type="text"
                                        inputmode="numeric"
                                        v-model="domain.xMin"
                                        v-invalid="testDomainLow(domain.xMin)"
                                    />
                                    <span>, </span>
                                    <input
                                        type="text"
                                        inputmode="numeric"
                                        v-model.number="domain.xMax"
                                        v-invalid="testDomainHigh(domain.xMax)"
                                    />
                                    <span>]</span>
                                </div>
                                <div>
                                    <span>y ∈ [</span>
                                    <input
                                        type="text"
                                        inputmode="numeric"
                                        v-model.number="domain.yMin"
                                        v-invalid="testDomainLow(domain.yMin)"
                                    />
                                    <span>, </span>
                                    <input
                                        type="text"
                                        inputmode="numeric"
                                        v-model.number="domain.yMax"
                                        v-invalid="testDomainHigh(domain.yMax)"
                                    />
                                    <span>]</span>
                                </div>
                                <WarningLabel v-if="!domainValid">Invalid domain</WarningLabel>
                            </div>
                        </div>
                        <FunctionGraph
                            :func="State.targetFunction.value"
                            :domain="State.targetFunctionDomain.value"
                            class="function-preview"
                        />
                    </div>
                </fieldset>
                <div>
                    {{ State.targetFunctionDomain.value }}
                </div>
            </div>
        </dialog>
    </Teleport>
</template>

<script setup lang="ts">
import * as State from "@/state";
import { ref, useTemplateRef, watchEffect } from "vue";
import FunctionGraph from "./FunctionGraph.vue";
import WindowHeader from "./WindowHeader.vue";
import WindowHeaderButton from "./WindowHeaderButton.vue";
import { vInvalid } from "@/lib/invalid-directive.ts";
import WarningLabel from "./WarningLabel.vue";

const { open } = defineProps<{
    open: boolean;
}>();

const emit = defineEmits<{
    close: [];
}>();

const dialog = useTemplateRef<HTMLDialogElement>("dialog");

watchEffect(() => {
    if (open) {
        dialog.value?.showModal();
    } else {
        dialog.value?.close();
    }
});

const domain = ref({
    xMin: State.targetFunctionDomain.value.xMin.toString(),
    xMax: State.targetFunctionDomain.value.xMax.toString(),
    yMin: State.targetFunctionDomain.value.yMin.toString(),
    yMax: State.targetFunctionDomain.value.yMax.toString(),
});

function testDomainLow(vs: string) {
    const v = parseFloat(vs);
    if (isNaN(v)) {
        return "Invalid number";
    } else if (v < -10) {
        return "Too low";
    } else {
        return false;
    }
}

function testDomainHigh(vs: string) {
    const v = parseFloat(vs);
    if (isNaN(v)) {
        return "Invalid number";
    } else if (v > 10) {
        return "Too high";
    } else {
        return false;
    }
}

const domainValid = ref(true);
watchEffect(() => {
    const xMin = parseFloat(domain.value.xMin);
    const xMax = parseFloat(domain.value.xMax);
    const yMin = parseFloat(domain.value.yMin);
    const yMax = parseFloat(domain.value.yMax);

    if (xMin >= -10 && xMax <= 10 && xMin < xMax && yMin >= -10 && yMax <= 10 && yMin < yMax) {
        domainValid.value = true;
        State.targetFunctionDomain.value = {
            xMin,
            xMax,
            yMin,
            yMax,
        };
    } else {
        domainValid.value = false;
    }
});
</script>

<style scoped>
.settings {
    width: calc(100vw - 2em);
    height: calc(100vh - 2em);
    padding: 0;
    background-color: white;
    border-radius: 1em;
    border: none;
    outline: none;

    flex-flow: column nowrap;

    transform: scale(0.9);
    opacity: 0;
    transition:
        transform 0.25s ease-out,
        opacity 0.25s ease-out,
        display 0.25s allow-discrete,
        overlay 0.25s allow-discrete;

    &::backdrop {
        transition: background-color 0.25s ease-out;
        background-color: rgb(0 0 0 / 0);
    }

    &[open] {
        display: flex;

        transform: scale(1);
        opacity: 1;

        &::backdrop {
            background-color: rgb(0 0 0 / 0.35);
        }

        @starting-style {
            transform: scale(0.9);
            opacity: 0;

            &::backdrop {
                background-color: rgb(0 0 0 / 0);
            }
        }
    }
}

.settings-content {
    padding: 0.5em;
    overflow-y: auto;
}

.settings-content fieldset {
    background-color: var(--bg-dim);
    border: none;
    border-radius: 0.5em;

    legend {
        font-weight: bold;
        font-size: 1.25em;
        display: block;
        width: 100%;
        float: left;
        padding: 0;
    }
}

.function-content {
    display: grid;
    grid-template-areas: "a b";
    grid-template-columns: auto 1fr;
    gap: 0.5em;

    width: 100%;
}

.function-domain {
    display: flex;
    flex-flow: column nowrap;
    gap: 0.25em;
}

.function-parameters {
    grid-area: a;
}

.function-expression input {
    margin-left: 0.25em;
}

.function-preview {
    grid-area: b;
    width: 20em;
    height: 20em;
    aspect-ratio: 1 / 1;

    background-color: var(--bg);
    border: 1px solid var(--bg-dimmer);
    border-radius: 0.25em;
}
</style>
