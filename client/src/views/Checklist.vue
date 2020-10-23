<template>
  <div class="page" :style="{ '--color': category && category.color }">
    <div class="header">
      <header-card
        class="header-card"
        v-if="checklist"
        :checklist="checklist"
      />
      <skeleton-card v-else :height="156" />
    </div>
    <item-list :items="checklist && checklist.items" />
    <div
      class="suggest-wrapper"
      v-if="
        checklist && user && !checklist.private && checklist.owner !== user.id
      "
    >
      <primary-button class="suggest-button" variant="text">
        <plus-icon /><span>suggest a modification</span>
      </primary-button>
      <p class="typography--body">
        The checklist seems uncomplete? Copy it and suggest a modification.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, computed } from 'vue';
import { useRoute } from 'vue-router';

import { useStore, ContentActions } from '@/store';
import HeaderCard from '@/components/checklist/HeaderCard.vue';
import ItemList from '@/components/checklist/ItemList.vue';
import SkeletonCard from '@/components/common/SkeletonCard.vue';
import PlusIcon from '@/assets/icons/PlusIcon.vue';
import PrimaryButton from '@/components/general/PrimaryButton.vue';

export default defineComponent({
  components: {
    HeaderCard,
    ItemList,
    SkeletonCard,
    PlusIcon,
    PrimaryButton
  },
  setup() {
    const { params } = useRoute();
    const checklistId = params.id as string;
    const store = useStore();

    watch(
      [checklistId],
      () => store.dispatch(ContentActions.FETCH_CHECKLIST, checklistId),
      { immediate: true }
    );

    const checklist = computed(
      () => store.state.content.checklists.byId[checklistId]
    );
    const category = computed(() =>
      checklist.value
        ? store.state.content.categories.byId[checklist.value.category]
        : undefined
    );
    const user = computed(() => store.state.app.user);

    return {
      checklist,
      category,
      user
    };
  }
});
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: var(--spacing-4);
}

.suggest-wrapper {
  margin-top: var(--spacing-4);

  .suggest-button {
    margin-left: calc(-1 * var(--spacing-2));
    margin-bottom: var(--spacing-0-5);
  }
}
</style>
