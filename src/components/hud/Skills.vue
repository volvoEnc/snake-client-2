<template>
  <div class="skills">
    <Skill type="speed" />
    <Skill type="shot" />
  </div>
</template>
<script setup lang="ts">
import Skill from './Skill.vue';
</script>
<style scoped>
.skills {
  padding: 12px;
  display: flex;
  column-gap: 12px;
}
</style>
