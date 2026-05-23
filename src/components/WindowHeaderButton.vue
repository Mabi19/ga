<template>
    <button class="flat dark"><MaterialIcon :name="props.icon" /></button>
</template>

<script setup lang="ts">
import MaterialIcon from "./MaterialIcon.vue";

const props = defineProps<{ icon: string }>();
</script>
