<template>
    <div class="dual-number-input">
        <input
            type="range"
            :min="props.min"
            :max="props.max"
            :step="props.step"
            :value="props.modelValue"
            @input="rangeChange"
        />
        <input
            type="number"
            :min="props.min"
            :max="props.max"
            :step="props.step"
            :value="props.modelValue"
            @input="numberChange"
        />
        <span v-if="unit">{{ unit }}</span>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    min: number;
    max: number;
    step: number;
    modelValue: number;
    unit?: string;
}>();

const emit = defineEmits<{
    "update:modelValue": [v: number];
}>();

function rangeChange(ev: InputEvent) {
    const el = ev.target! as HTMLInputElement;
    emit("update:modelValue", el.valueAsNumber);
}

function numberChange(ev: InputEvent) {
    const el = ev.target! as HTMLInputElement;
    const v = el.valueAsNumber;
    if (!isNaN(v) && v >= props.min && v <= props.max) {
        emit("update:modelValue", v);
    }
}
</script>

<style scoped>
.dual-number-input {
    display: flex;
    flex-flow: row nowrap;
    gap: 0.25em;
    align-items: center;
}
</style>
