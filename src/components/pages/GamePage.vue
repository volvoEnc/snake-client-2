<template>
  <div class="wrapper">
    <div class="game" id="game"></div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {initPhaser} from "../../main.js";

const phaserInstance = ref(null);

onMounted(() => {
  phaserInstance.value = initPhaser();
});
</script>

<style scoped>
.wrapper {
  border: solid 1px #32CD32;
}
.game-start {
  width: 300px;
  height: 40px;
  background: #b73737;
  color: #fff;
  cursor: pointer;
}
</style>
