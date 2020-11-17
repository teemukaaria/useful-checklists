<template>
  <div class="wrapper">
    <template v-if="!loading">
      <router-link
        v-for="checklist in checklists"
        :key="checklist.id"
        :to="`/checklist/${checklist.id}`"
      >
        <checklist-card
          :checklist="checklist"
          :color="categories[checklist.category]?.color || color"
        />
      </router-link>
    </template>
    <template v-else>
      <skeleton-card :height="120" />
      <skeleton-card :height="120" />
      <skeleton-card :height="120" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import ChecklistCard from './ChecklistCard.vue';
import SkeletonCard from '@/components/common/SkeletonCard.vue';
import { Checklist } from '@/store/modules/content/state';
import { useStore } from '@/store';

export default defineComponent({
  name: 'ChecklistCardList',
  components: {
    ChecklistCard,
    SkeletonCard
  },
  props: {
    checklists: {
      type: Array as () => Checklist[],
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    color: { type: String, default: 'white' }
  },
  setup() {
    const store = useStore();

    const categories = computed(() => store.state.content.categories.byId);

    return {
      categories
    };
  }
});
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;

  a {
    text-decoration: none;
  }
  & > *:not(:last-child) {
    margin-bottom: var(--spacing-2);
  }
}
</style>
