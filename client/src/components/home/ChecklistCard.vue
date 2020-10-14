<template>
  <div class="checklist-card card" :style="{ '--color': color }">
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
import { InProgress } from '@/store/modules/content/state';

export default defineComponent({
  name: 'ChecklistCard',
  props: {
    checklist: {
      type: Object as () => InProgress & { color: string },
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
  padding-bottom: var(--spacing-1);
  width: 160px;
  height: 160px;

  .bar {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    margin-bottom: 8px;
    flex: 1;
  }

  .name {
    font-weight: bold;
    margin-bottom: 8px;
  }

  .progress {
    align-self: flex-end;
    font-size: var(--font-size-small);
    font-weight: 500;
    opacity: 0.5;
  }
}
</style>
