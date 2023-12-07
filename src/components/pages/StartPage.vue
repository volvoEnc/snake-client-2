<template>
  <div class="wrapper">
    <button class="game-start" :disabled="!enableStart">
      {{ enableStart ? 'Играть' : 'Подождите...' }}
    </button>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { socket } from '../../main.ts';
import MapState from '../../game/State/MapState.ts';

const enableStart = ref(false);

onMounted(() => {
  socket.on('connected', (myId) => {
    MapState.getInstance().setUserId(myId);
  });
  checkConnect(0);
});

function checkConnect(attempts) {
  if (socket.connected) {
    enableStart.value = true;
    return true;
  }

  if (attempts > 10) {
    alert('Не удалось подключиться к серверу!');
    return false;
  }

  setTimeout(() => {
    attempts++;
    checkConnect(attempts);
  }, 1000);
}
</script>

<style scoped>
.game-start {
  width: 300px;
  height: 40px;
  background: #b73737;
  color: #fff;
  cursor: pointer;
}
.game-start:disabled {
  background: #242424;
}
</style>
