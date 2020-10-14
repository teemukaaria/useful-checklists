<template>
  <div class="checklist-card" :style="{ '--color': color }">
    <p class="name">{{ checklist.name }}</p>
    <p class="description">{{ checklist.description }}</p>
    <span class="bar">
      <span class="steps">{{ checklist.item_count }} steps</span> • {{ checklist.collaborators.length }} contributors
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

  .name {
    font-weight: bold;
    margin-bottom: 16px;
  }

  .description {
    margin-bottom: 16px;
  }

  .bar {
    align-self: flex-end;
    font-size: var(--font-size-small);
    opacity: 0.7;

    .steps {
      color: var(--color);
    }
  }
}
</style>
