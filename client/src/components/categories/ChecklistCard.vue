<template>
  <div class="checklist-card card" :style="{ '--color': color }">
    <h6>{{ checklist.name }}</h6>
    <p class="typography--body">{{ checklist.description }}</p>
    <p class="bar">
      <span class="steps">{{ checklist.item_count }} steps</span>
      <span class="contributors">
        • {{ checklist.collaborators.length }} contributors
      </span>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Checklist } from '@/store/modules/content/state';

export default defineComponent({
  name: 'ChecklistCard',
  props: {
    checklist: {
      type: Object as () => Checklist,
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

  p {
    font-size: var(--font-size-small);
  }

  & > *:not(:last-child) {
    margin-bottom: var(--spacing-1-5);
  }

  .bar {
    align-self: flex-end;

    .steps {
      color: var(--color);
    }
    .contributors {
      opacity: 0.5;
    }
  }
}
</style>
