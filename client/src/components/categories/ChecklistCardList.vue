<template>
  <div class="wrapper">
    <router-link
      v-for="checklist in checklists"
      :key="checklist.id"
      :to="`/checklist/${checklist.id}`"
    >
      <checklist-card :checklist="checklist" />
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import ChecklistCard from './ChecklistCard.vue';
import { Checklist } from '@/store/modules/content/state';

export default defineComponent({
  name: 'ChecklistCardList',
  components: {
    ChecklistCard
  },
  props: {
    checklists: {
      type: Array as () => Checklist[],
      required: true
    }
  }
});
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}

.wrapper {
  display: flex;
  flex-direction: column;

  a {
    text-decoration: none;

    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }
}
</style>
