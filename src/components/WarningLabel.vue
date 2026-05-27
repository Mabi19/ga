<template>
    <div class="warning">
        <MaterialIcon name="warning" />
        <span>
            <slot />
        </span>
    </div>
</template>

<script setup lang="ts">
import MaterialIcon from "./MaterialIcon.vue";
</script>

<style scoped>
.warning {
    color: darkgoldenrod;

    .material-symbols-rounded {
        vertical-align: middle;
        padding-right: 0.25em;
    }

    span {
        vertical-align: middle;
    }
}
</style>
