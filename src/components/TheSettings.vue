<template>
    <Teleport to="body">
        <dialog closedby="any" ref="dialog" class="settings" @close="emit('close')">
            <WindowHeader title="Settings">
                <WindowHeaderButton @click="emit('close')" icon="close" />
            </WindowHeader>
            <div class="settings-content">
                <div>
                    <label for="function-expression">Expression</label>
                    <input
                        type="text"
                        name="function-expression"
                        v-model="State.targetFunctionExpression.value"
                    />
                </div>
                <div>
                    <FunctionGraph
                        :func="State.targetFunction.value"
                        class="settings-function-preview"
                    />
                </div>
            </div>
        </dialog>
    </Teleport>
</template>

<script setup lang="ts">
import * as State from "@/state";
import { useTemplateRef, watchEffect } from "vue";
import FunctionGraph from "./FunctionGraph.vue";
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

.settings-function-preview {
    width: 50%;
    aspect-ratio: 1 / 1;
}
</style>
