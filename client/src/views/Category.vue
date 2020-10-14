<template>
  <div class="category-view">
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
        :color="category && category.color"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
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

    const checklists = computed(() => store.state.content.checklists);
    const categories = computed(() => store.state.content.categories.byId);

    const category = computed(() => categories.value[id]);

    onMounted(() => {
      store.dispatch(ContentActions.FETCH_CATEGORY_BY_ID, id);
      store.dispatch(ContentActions.FETCH_CHECKLISTS_FOR_CATEGORY, id);
    });

    return {
      category,
      checklists
    };
  }
});
</script>

<style lang="scss" scoped>
.category-view {
  width: 100%;

  .section {
    &:not(:last-child) {
      margin-bottom: var(--spacing-2);
    }
  }
}
</style>
