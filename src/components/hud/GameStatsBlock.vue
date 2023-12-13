<template>
  <div class="stats-block">
    <div class="stat-text">Fps: {{ statsData.fps }}</div>
    <div class="stat-text">Ping: {{ statsData.ping }} ms</div>
    <div class="stat-text">Room Server: {{ statsData.serverLoad }}%</div>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import EventDispatcher from '../../game/classes/EventDispatcher';
import { IStatsData } from '../../game/classes/GameStats';
const statsData = reactive({
  fps: 0,
  ping: 0,
  serverLoad: 0,
});
const eventDispatcher = EventDispatcher.getInstance();

eventDispatcher.on('statsData', (data: IStatsData) => {
  statsData.fps = data.fps;
  statsData.ping = data.ping;
  statsData.serverLoad = data.serverLoad;
});
</script>

<style scoped>
.stats-block {
  display: flex;
  flex-direction: column;
}
</style>
