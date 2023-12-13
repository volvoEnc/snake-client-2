<template>
  <div class="hud">
    <div class="header">
      <GameStatsBlock />
    </div>
    <div class="body"></div>
    <div class="footer">
      <Skills />
    </div>
  </div>
</template>
<script lang="ts" setup>
import GameStatsBlock from './GameStatsBlock.vue';
import Skills from './Skills.vue';
</script>
<style scoped>
.hud {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: flex;
  flex-direction: column;
}
.hud > * {
  pointer-events: all;
}
.hud .header {
  padding: 12px;
  display: flex;
  justify-content: space-between;
}
.hud .body {
  width: 100%;
  height: 70%;
}
</style>
