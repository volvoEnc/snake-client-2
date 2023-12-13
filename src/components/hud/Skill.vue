<template>
  <div class="skill">
    <div class="text">{{ getText }}</div>
    <img class="image" :src="`/icons/${getImage}`" />
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps(['type']);
const getText = computed(() => {
  switch (props.type) {
    case 'speed':
      return 'SHIFT';
    case 'shot':
      return 'SPACE';
  }
});
const getImage = computed(() => {
  switch (props.type) {
    case 'speed':
      return 'speedIcon.png';
    case 'shot':
      return 'bulletIcon.png';
  }
});
</script>
<style scoped>
.skill {
  width: 100px;
  height: 100px;
  border: solid 2px #000;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.skill .image {
  width: 100%;
  height: auto;
}
.skill .text {
  position: absolute;
  color: #000;
  font-size: 24px;
  font-weight: bold;
  bottom: 0;
  width: 100%;
  text-align: center;
  background: white;
}
</style>
