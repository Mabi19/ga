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
                                        v-model.number="domainXMin"
                                        v-invalid="domainXMin < -10 ? 'Too low' : false"
                                    />
                                    <span>, </span>
                                    <input
                                        type="text"
                                        inputmode="numeric"
                                        v-model.number="domainXMax"
                                        v-invalid="domainXMax > 10 ? 'Too high' : false"
                                    />
                                    <span>]</span>
                                </div>
                                <div>
                                    <span>y ∈ [</span>
                                    <input
                                        type="text"
                                        inputmode="numeric"
                                        v-model.number="domainYMin"
                                        v-invalid="domainYMin < -10 ? 'Too low' : false"
                                    />
                                    <span>, </span>
                                    <input
                                        type="text"
                                        inputmode="numeric"
                                        v-model.number="domainYMax"
                                        v-invalid="domainYMax > 10 ? 'Too high' : false"
                                    />
                                    <span>]</span>
                                </div>
                                <WarningLabel v-if="!domainValid">Invalid domain</WarningLabel>
                            </div>
                        </div>
                        <FunctionGraph
                            :func="State.targetFunction.value"
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
import { computed, ref, useTemplateRef, watchEffect } from "vue";
import FunctionGraph from "./FunctionGraph.vue";
import WindowHeader from "./WindowHeader.vue";
import WindowHeaderButton from "./WindowHeaderButton.vue";
import type { FunctionDomain } from "@/lib/expression/domain.ts";
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

const domain = ref<FunctionDomain>({ ...State.targetFunctionDomain.value });
function makeDomainParameter(name: keyof FunctionDomain) {
    return computed({
        get: () => domain.value[name],
        set: (v) => {
            if (typeof v == "number") {
                domain.value[name] = v;
            }
        },
    });
}

// TODO: This is very janky. Unjank it
const domainXMin = makeDomainParameter("xMin");
const domainXMax = makeDomainParameter("xMax");
const domainYMin = makeDomainParameter("yMin");
const domainYMax = makeDomainParameter("yMax");
const domainValid = ref(true);
watchEffect(() => {
    console.log("domain update");
    if (
        domain.value.xMin >= -10 &&
        domain.value.xMax <= 10 &&
        domain.value.xMin < domain.value.xMax &&
        domain.value.yMin >= -10 &&
        domain.value.yMax <= 10 &&
        domain.value.yMin < domain.value.yMax
    ) {
        domainValid.value = true;
        State.targetFunctionDomain.value = { ...domain.value };
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
