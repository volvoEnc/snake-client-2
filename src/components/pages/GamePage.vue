<template>
  <div class="wrapper">
    <div id="game" class="game" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { initPhaser } from '../../main.ts';

const phaserInstance = ref(null);

onMounted(() => {
  phaserInstance.value = initPhaser();
});
</script>

<style scoped>
.wrapper {
  //border: solid 1px #32cd32;
}
.game-start {
  width: 300px;
  height: 40px;
  background: #b73737;
  color: #fff;
  cursor: pointer;
}
</style>
