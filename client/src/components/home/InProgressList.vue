<template>
  <div class="wrapper">
    <router-link
      v-for="checklist in checklists"
      :key="checklist.id"
      :to="`/checklist/${checklist.id}`"
    >
      <checklist-card
        :checklist="checklist"
        :color="categoriesById[checklist.category]?.color"
      />
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import ChecklistCard from './ChecklistCard.vue';
import { InProgress } from '@/store/modules/content/state';
import { useStore } from '@/store';

export default defineComponent({
  name: 'InProgressList',
  components: {
    ChecklistCard
  },
  props: {
    checklists: {
      type: Array as () => InProgress[],
      required: true
    }
  },
  setup() {
    const store = useStore();

    const categoriesById = computed(() => store.state.content.categoriesById);

    return {
      categoriesById
    };
  }
});
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}

.wrapper {
  display: flex;

  a {
    text-decoration: none;

    &:not(:last-child) {
      margin-right: 8px;
    }
  }
}
</style>
