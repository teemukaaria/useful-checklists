<template>
  <div class="list-wrapper">
    <template v-if="items">
      <checklist-item v-for="item in items" :key="item.id" :item="item" />
    </template>
    <template v-else>
      <skeleton-checklist-item />
      <skeleton-checklist-item />
      <skeleton-checklist-item />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import ChecklistItem from './ChecklistItem.vue';
import SkeletonChecklistItem from './SkeletonChecklistItem.vue';
import { ChecklistItem as IChecklistItem } from '@/store/modules/content/state';

export default defineComponent({
  components: {
    ChecklistItem,
    SkeletonChecklistItem
  },
  props: {
    items: {
      type: Array as () => IChecklistItem[],
      default: undefined
    }
  }
});
</script>

<style lang="scss" scoped>
.list-wrapper {
  & > *:not(:last-child) {
    margin-bottom: var(--spacing-2-5);
  }
}
</style>
