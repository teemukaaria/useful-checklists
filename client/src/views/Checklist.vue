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
    <item-list
      :items="items"
      :checklistId="checklist?.id"
      :inProgressId="inProgressId"
    />
    <div class="suggest-wrapper">
      <primary-button
        @click="handleSuggClick"
        class="suggest-button"
        variant="text"
      >
        <plus-icon /><span
          v-if="checklist && user && checklist.owner === user.id"
          >make a modification</span
        ><span v-else>suggest a modification</span>
      </primary-button>
      <p class="typography--body">
        <template v-if="checklist && user && checklist.owner === user.id">
          Make a suggestion, which will be automatically approved.
        </template>
        <template v-else>
          The checklist seems uncomplete? Copy it and suggest a modification.
        </template>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

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
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const checklistId = computed(() => route.params.id as string);
    const inProgressId = computed(() => route.params.inProgress as string);

    watch(
      [checklistId, inProgressId],
      () => {
        inProgressId.value &&
          store.dispatch(ContentActions.FETCH_CHECKLIST, {
            checklistId: inProgressId.value,
            collection: 'in_progress'
          });
        store.dispatch(ContentActions.FETCH_CHECKLIST, {
          checklistId: checklistId.value
        });
      },
      { immediate: true }
    );

    const inProgress = computed(
      () =>
        inProgressId.value &&
        store.state.content.inProgress.byId[inProgressId.value]
    );
    const checklist = computed(
      () => store.state.content.checklists.byId[checklistId.value]
    );
    const category = computed(() =>
      checklist.value
        ? store.state.content.categories.byId[checklist.value.category]
        : undefined
    );
    const items = computed(
      () =>
        store.state.content.itemsByChecklist.byId[
          inProgressId.value || checklistId.value
        ]
    );
    const user = computed(() => store.state.app.user);

    const handleSuggClick = () => {
      router.push({
        path: `/checklist/create`,
        query: { copy: checklist.value.id, suggestion: 'true' }
      });
    };

    return {
      checklist,
      category,
      user,
      items,
      inProgressId,
      handleSuggClick
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
