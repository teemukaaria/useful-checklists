<template>
  <div class="category-view page">
    <div class="section">
      <template v-if="category">
        <category-header-card :category="category" />
      </template>
      <template v-else>
        <skeleton-card :height="122" />
      </template>
    </div>
    <div class="section">
      <checklist-card-list
        :checklists="checklists"
        :loading="checklistsLoading"
        :color="category && category.color"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore, ContentActions } from '@/store';

import SkeletonCard from '@/components/common/SkeletonCard.vue';
import CategoryHeaderCard from '@/components/categories/CategoryHeaderCard.vue';
import ChecklistCardList from '@/components/categories/ChecklistCardList.vue';

export default defineComponent({
  name: 'Category',
  components: {
    CategoryHeaderCard,
    ChecklistCardList,
    SkeletonCard
  },
  setup() {
    const { params } = useRoute();
    const id = params.id as string;

    const store = useStore();

    const allChecklists = computed(() => store.state.content.checklists);
    const category = computed(() => store.state.content.categories.byId[id]);
    const checklistIds = computed(
      () => store.state.content.checklistsByCategory.byId[id]
    );

    const checklists = computed(() =>
      checklistIds.value
        ? Object.values(allChecklists.value.byId).filter(checklist =>
            checklistIds.value.includes(checklist.id)
          )
        : []
    );
    const checklistsLoading = computed(
      () =>
        !checklistIds.value &&
        (!allChecklists.value.status ||
          allChecklists.value.status === 'loading')
    );

    watch(
      [id],
      () => {
        // This is handeled in app level
        // store.dispatch(ContentActions.FETCH_CATEGORY_BY_ID, id);
        store.dispatch(ContentActions.FETCH_CHECKLISTS_FOR_CATEGORY, id);
      },
      { immediate: true }
    );

    return {
      category,
      checklists,
      checklistsLoading
    };
  }
});
</script>

<style lang="scss" scoped>
.category-view {
  .section {
    &:not(:last-child) {
      margin-bottom: var(--spacing-2);
    }
  }
}
</style>
