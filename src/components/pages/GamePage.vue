<template>
  <div class="wrapper">
    <HUD />
    <div id="game" class="game" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { initPhaser } from '../../main.ts';
import HUD from '../hud/HUD.vue';

const phaserInstance = ref(null);

onMounted(() => {
  phaserInstance.value = initPhaser();
});
</script>

<style scoped>
.wrapper {
  position: relative;
}
</style>
