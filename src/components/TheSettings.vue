<template>
    <Teleport to="body">
        <dialog closedby="any" ref="dialog" class="settings" @close="emit('close')">
            todo: settings
        </dialog>
    </Teleport>
</template>

<script setup lang="ts">
import { useTemplateRef, watchEffect } from "vue";

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
    background-color: white;
    border-radius: 1em;
    border: none;
    outline: none;

    transform: scale(0.9);
    opacity: 0;
    transition:
        transform 0.3s ease-out,
        opacity 0.3s ease-out,
        display 0.3s allow-discrete,
        overlay 0.3s allow-discrete;

    &::backdrop {
        transition: background-color 0.3s ease-out;
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
</style>
