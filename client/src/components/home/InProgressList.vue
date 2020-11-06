<template>
  <div class="wrapper">
    <template v-if="!loading">
      <router-link
        v-for="checklist in Object.values(checklists.byId)"
        :key="checklist.id"
        :to="`/checklist/${checklist.checklist}/${checklist.id}`"
      >
        <checklist-card
          :checklist="checklist"
          :color="categoriesById[checklist.category]?.color"
        />
      </router-link>
    </template>
    <template v-else>
      <skeleton-card class=".skeleton" :height="160" :width="160" />
      <skeleton-card class=".skeleton" :height="160" :width="160" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import ChecklistCard from './ChecklistCard.vue';
import SkeletonCard from '@/components/common/SkeletonCard.vue';
import { InProgress, Content } from '@/store/modules/content/state';
import { useStore } from '@/store';

export default defineComponent({
  name: 'InProgressList',
  components: {
    ChecklistCard,
    SkeletonCard
  },
  props: {
    checklists: {
      type: Object as () => Content<InProgress>,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const store = useStore();

    const categoriesById = computed(() => store.state.content.categories.byId);

    return {
      categoriesById
    };
  }
});
</script>

<style scoped lang="scss">
.wrapper {
  overflow-x: auto;
  display: flex;
  padding: 5px;
  margin: -5px;

  a {
    text-decoration: none;
  }

  & > * {
    flex-shrink: 0;
  }
  & > *:not(:last-child) {
    margin-right: var(--spacing-2);
  }
}
</style>
