<template>
  <div class="wrapper">
    <template v-if="checklists.status !== 'loading'">
      <router-link
        v-for="checklist in Object.values(checklists.byId)"
        :key="checklist.id"
        :to="`/checklist/${checklist.id}`"
      >
        <checklist-card :checklist="checklist" :color="color" />
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
import { defineComponent } from 'vue';

import ChecklistCard from './ChecklistCard.vue';
import SkeletonCard from '@/components/common/SkeletonCard.vue';
import { Checklist, Content } from '@/store/modules/content/state';

export default defineComponent({
  name: 'ChecklistCardList',
  components: {
    ChecklistCard,
    SkeletonCard
  },
  props: {
    checklists: {
      type: Object as () => Content<Checklist>,
      required: true
    },
    color: { type: String, default: 'white' }
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
