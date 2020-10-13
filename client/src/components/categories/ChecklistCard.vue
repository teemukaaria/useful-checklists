<template>
  <div class="checklist-card" :style="{ '--color': color }">
    <span class="bar">
      <div class="pimple" />
    </span>
    <p class="name">{{ checklist.name }}</p>
    <span class="progress">
      {{ checklist.completed_count }} / {{ checklist.item_count }} done
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Checklist } from '@/store/modules/content/state';

export default defineComponent({
  name: 'ChecklistCard',
  props: {
    checklist: {
      type: Object as () => Checklist & { color: string },
      required: true
    },
    color: String
  }
});
</script>

<style lang="scss" scoped>
.checklist-card {
  display: flex;
  position: relative;
  flex-direction: column;
  text-decoration: none;
  color: var(--color-text);
  background: var(--color-background-card);
  border-radius: 8px;
  padding: 8px;
  width: 150px;
  height: 130px;

  .bar {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    margin-bottom: 8px;
    flex: 1;

    .pimple {
      height: calc(var(--font-size-large) - 2px);
      width: calc(var(--font-size-large) - 2px);
      margin: 2px;
      border-radius: 100%;
      background: var(--color);
    }
  }

  .name {
    font-weight: bold;
    margin-bottom: 8px;
  }

  .progress {
    align-self: flex-end;
    font-size: var(--font-size-small);
    opacity: 0.7;
  }
}
</style>
