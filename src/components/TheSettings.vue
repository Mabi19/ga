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
                            <div class="function-preset">
                                <label for="function-preset">Preset</label>
                                <select @input="selectPreset" ref="preset">
                                    <option value="a">(x^2 - y^2) - (1 - x)^2</option>
                                    <option value="b" selected>x^2 + sin(y)</option>
                                    <option value="c">sin(3*x + y) * sin(y - x) * x</option>
                                    <option value="sinewave">sin(x) + cos(y)</option>
                                    <option value="bellcurve">e^-(x^2 + y^2)</option>
                                    <option value="rastrigin">Rastrigin function</option>
                                    <option value="">Custom</option>
                                </select>
                            </div>
                            <div class="function-expression">
                                <label for="function-expression">Expression</label>
                                <input
                                    type="text"
                                    name="function-expression"
                                    placeholder="f(x, y) ="
                                    v-model="State.targetFunctionExpression.value"
                                    @input="changeSelectToCustom"
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
                                        @input="changeSelectToCustom"
                                    />
                                    <span>, </span>
                                    <input
                                        type="text"
                                        inputmode="numeric"
                                        v-model.number="domain.xMax"
                                        v-invalid="testDomainHigh(domain.xMax)"
                                        @input="changeSelectToCustom"
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
                                        @input="changeSelectToCustom"
                                    />
                                    <span>, </span>
                                    <input
                                        type="text"
                                        inputmode="numeric"
                                        v-model.number="domain.yMax"
                                        v-invalid="testDomainHigh(domain.yMax)"
                                        @input="changeSelectToCustom"
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
                <fieldset>
                    <legend>Evolution</legend>
                    <div class="evolution-content">
                        <label for="population-size">Population size</label>
                        <DualNumberInput
                            id="population-size"
                            :min="2"
                            :max="32"
                            :step="1"
                            v-model="populationSize"
                        />
                        <WarningLabel
                            >Population size only applies for new generations, or after
                            reset.</WarningLabel
                        >
                        <label for="p-cross">Crossover probability</label>
                        <DualNumberInput
                            id="p-cross"
                            :min="0"
                            :max="100"
                            :step="1"
                            v-model="pCross"
                            unit="%"
                        />
                        <label for="p-mutate">Mutation probability (per bit)</label>
                        <DualNumberInput
                            id="p-mutate"
                            :min="0"
                            :max="100"
                            :step="1"
                            v-model="pMutate"
                            unit="%"
                        />
                    </div>
                </fieldset>
            </div>
        </dialog>
    </Teleport>
</template>

<script setup lang="ts">
import type { FunctionDomain } from "@/lib/expression/domain.ts";
import { vInvalid } from "@/lib/invalid-directive.ts";
import * as State from "@/state";
import { computed, ref, useTemplateRef, watchEffect } from "vue";
import DualNumberInput from "./DualNumberInput.vue";
import FunctionGraph from "./FunctionGraph.vue";
import WarningLabel from "./WarningLabel.vue";
import WindowHeader from "./WindowHeader.vue";
import WindowHeaderButton from "./WindowHeaderButton.vue";

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

interface Preset {
    expr: string;
    domain: FunctionDomain;
}

const PRESETS: Record<string, Preset> = {
    a: { expr: "(x^2 - y^2) - (1 - x)^2", domain: { xMin: -2, xMax: 2, yMin: -2, yMax: 2 } },
    b: { expr: "x^2 + sin(y)", domain: { xMin: 0, xMax: 1, yMin: 0, yMax: 3.14 } },
    c: { expr: "sin(3*x + y) * sin(y - x) * x", domain: { xMin: -5, xMax: 5, yMin: -5, yMax: 5 } },
    sinewave: { expr: "sin(x) + cos(y)", domain: { xMin: -5, xMax: 5, yMin: -5, yMax: 5 } },
    bellcurve: { expr: "e^-(x^2 + y^2)", domain: { xMin: -3, xMax: 3, yMin: -3, yMax: 3 } },
    rastrigin: {
        expr: "x^2 / 10 - cos(2 * pi * x) + y^2 / 10 - cos(2 * pi * y)",
        domain: { xMin: -5.12, xMax: 5.12, yMin: -5.12, yMax: 5.12 },
    },
};

const preset = useTemplateRef("preset");
function selectPreset(ev: InputEvent) {
    const el = ev.target as HTMLSelectElement;
    if (el?.value) {
        const preset = PRESETS[el.value]!;
        State.targetFunctionExpression.value = preset.expr;
        domain.value = {
            xMin: preset.domain.xMin.toString(),
            xMax: preset.domain.xMax.toString(),
            yMin: preset.domain.yMin.toString(),
            yMax: preset.domain.yMax.toString(),
        };
    }
}

function changeSelectToCustom() {
    if (preset.value) preset.value.value = "";
}

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

const pCross = computed({
    get: () => Math.round(State.pCross.value * 100),
    set: (v) => (State.pCross.value = v / 100),
});
const pMutate = computed({
    get: () => Math.round(State.pMutate.value * 100),
    set: (v) => (State.pMutate.value = v / 100),
});
const populationSize = computed({
    get: () => State.populationSize.value,
    set: (v) => (State.populationSize.value = Math.round(v)),
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
    display: flex;
    flex-flow: column nowrap;
    gap: 0.5em;
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

.function-preset select {
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

.evolution-content {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    gap: 0.25em;
}
</style>
