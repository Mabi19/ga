<template>
    <Teleport to="body">
        <dialog closedby="any" ref="dialog" class="settings" @close="emit('close')">
            <div>
                <label for="function-expression">Expression</label>
                <input type="text" name="function-expression" v-model="functionExpr" />
            </div>
            <div>{{ functionExpr }} = {{ functionNode?.eval(0, 0) ?? "(error)" }}</div>
            <div>
                <FunctionGraph :func="functionNode" class="settings-function-preview" />
            </div>
        </dialog>
    </Teleport>
</template>

<script setup lang="ts">
import { ConstantNode, type ExpressionNode } from "@/lib/expression/node";
import { parse } from "@/lib/expression/parse";
import { ref, shallowRef, useTemplateRef, watchEffect } from "vue";
import FunctionGraph from "./FunctionGraph.vue";

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

const functionExpr = ref("");
const functionNode = shallowRef<ExpressionNode>(new ConstantNode(0));
watchEffect(() => {
    const node = parse(functionExpr.value);
    if (node) {
        functionNode.value = node;
    }
});
</script>

<style scoped>
.settings {
    width: calc(100vw - 2em);
    height: calc(100vh - 2em);
    background-color: white;
    border-radius: 1em;
    border: none;
    outline: none;

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

.settings-function-preview {
    width: 50%;
    aspect-ratio: 1 / 1;
}
</style>
