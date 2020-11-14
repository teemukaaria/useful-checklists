<template>
  <div class="page review" :style="{ '--color': category?.color }">
    <div class="header">
      <template v-if="checklist">
        <suggestion-header
          :checklist="checklist"
          :modified="changes && !!changes[checklist.id]"
          @reject="rejectSuggestions"
          @approve="approveSuggestions"
        />
      </template>
      <template v-else>
        <skeleton-card :height="156" />
      </template>
    </div>

    <div class="item-list">
      <template v-if="items && changes">
        <checklist-item
          v-for="item in items"
          :key="item.id"
          :item="changes[item.id]?.new || item"
          :modification="changes[item.id]?.type"
        />
        <checklist-item
          v-for="change in Object.values(changes || {}).filter(
            x => x.type === 'create'
          )"
          :key="change.id"
          :item="change.new"
          modification="create"
        />
      </template>
      <template v-else>
        <skeleton-checklist-item />
        <skeleton-checklist-item />
        <skeleton-checklist-item />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore, ContentActions, SuggestionActions } from '@/store';
import SkeletonCard from '@/components/common/SkeletonCard.vue';
import ChecklistItem from '@/components/checklist/ChecklistItem.vue';
import SkeletonChecklistItem from '@/components/common/SkeletonChecklistItem.vue';
import { Checklist } from '@/store/modules/content/state';
import SuggestionHeader from '@/components/suggestions/SuggestionHeader.vue';

export default defineComponent({
  components: {
    SkeletonCard,
    ChecklistItem,
    SkeletonChecklistItem,
    SuggestionHeader
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const suggestionId = computed(() => route.params.id as string);
    const suggestion = computed(
      () => store.state.suggestions.suggestions.byId[suggestionId.value]
    );
    const changes = computed(
      () => store.state.suggestions.changesBySuggestion.byId[suggestionId.value]
    );
    const checklistId = computed(() => suggestion.value?.checklist.id);
    const checklist = computed(
      () =>
        (checklistId.value &&
          store.state.content.checklists.byId[checklistId.value]) ||
        (suggestion.value?.checklist as Checklist)
    );
    const items = computed(
      () =>
        checklistId.value &&
        store.state.content.itemsByChecklist.byId[checklistId.value] &&
        Object.values(
          store.state.content.itemsByChecklist.byId[checklistId.value]
        )
    );
    const category = computed(
      () =>
        checklist.value?.category &&
        store.state.content.categories.byId[checklist.value.category]
    );

    watch(
      [suggestionId],
      () => {
        if (suggestionId.value)
          store.dispatch(
            SuggestionActions.FETCH_SUGGESTION,
            suggestionId.value
          );
      },
      { immediate: true }
    );
    watch(
      [checklistId],
      () => {
        if (checklistId.value)
          store.dispatch(ContentActions.FETCH_CHECKLIST, {
            checklistId: checklistId.value
          });
      },
      { immediate: true }
    );

    const rejectSuggestions = () => {
      store.dispatch(SuggestionActions.REJECT, suggestionId.value);
      router.back();
    };

    const approveSuggestions = () => {
      store.dispatch(SuggestionActions.VALIDATE_ALL, suggestionId.value);
      router.back();
    };

    return {
      checklist,
      suggestion,
      category,
      items,
      changes,
      rejectSuggestions,
      approveSuggestions
    };
  }
});
</script>

<style lang="scss" scoped>
.review {
  .header {
    margin-bottom: var(--spacing-4);
  }

  .item-list {
    & > *:not(:last-child) {
      margin-bottom: var(--spacing-2-5);
    }
  }
}
</style>
