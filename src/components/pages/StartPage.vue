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
.wrapper {
  width: 100%;
  height: 100vh;
  background: url("background.png");
  background-size: cover;
  display: flex;
  align-items: end;
  justify-content: center;
}
.game-start {
  width: 256px;
  height: 256px;
  background: transparent;
  color: #fff;
  cursor: pointer;
  border-radius: 50%;
  border: solid 5px #242441;
  font-size: 32px;
  text-transform: uppercase;
}
.game-start:disabled {
  background: #242424;
}
</style>
