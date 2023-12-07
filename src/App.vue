<template>
  <div class="main">
    <StartPage v-if="pageState.start" @click="startGame" />
    <GamePage v-else-if="pageState.game" />
  </div>

  <!--  <h2 class="stepsLeft">Осталось: 0</h2>-->
  <!--  <h2 class="reward">Счет: 0</h2>-->
  <!--  <div id="game"></div>-->
</template>

<script setup>
import StartPage from './components/pages/StartPage.vue';
import { onMounted, reactive } from 'vue';
import GamePage from './components/pages/GamePage.vue';
import { socket } from './main.ts';
import MapState from './game/State/MapState.ts';

onMounted(() => {
  socket.on('joined-room', startGameServer);
});

const pageState = reactive({
  start: true,
  game: false,
});

function startGame() {
  socket.emit('start-game');
}

function startGameServer(data) {
  MapState.getInstance().setMapData(data);
  pageState.start = false;
  pageState.game = true;
}
</script>

<style scoped>
.main {
  width: 100%;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
