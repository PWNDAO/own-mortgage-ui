<template>
    <img v-if="icon" :src="icon" :alt="pool" />
    <div v-else>N/A</div>
</template>

<script setup lang="ts">
import { Pool } from '~/classes/Pool';

const props = defineProps<{
    pool: Pool | undefined;
}>();

const icon = computed(() => {
    switch (props.pool) {
        case Pool.AAVE_V3:
            return '/icons/aave.svg';
        case Pool.COMPOUND_V3:
            return '/icons/compound.svg';
        case Pool.MORPHO:
            return '/icons/morpho.svg';
        case Pool.EULER:
            return '/icons/euler.svg';
        default:
            return undefined;
    }
})
</script>