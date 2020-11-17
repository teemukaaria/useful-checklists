<template>
  <div class="page">
    <h4 class="title">Suggestions to my checklists</h4>
    <h6 v-if="!suggestions || !suggestions.length" class="empty-info">You do not have any unresolved suggestions for any of your checklists</h6>
    <div class="wrapper">
        <suggestion 
        v-for="suggestion in suggestions"
        :key="suggestion.id"
        :suggestion="suggestion"
        />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore, SuggestionActions } from '@/store';

import Suggestion from '@/components/suggestions/Suggestion.vue';

export default defineComponent({
  name: 'Suggestions',
  components: {
    Suggestion
  },
  setup() {

    const store = useStore();

    const user = computed(() => store.state.app.user);
    const userId = computed(() => user.value && user.value.id);

    watch(
      [user],
      () => {
        if (user.value)
          store.dispatch(SuggestionActions.FETCH_SUGGESTIONS, 'received');
      },
      { immediate: true }
    );
    const suggestions = computed(() =>
      Object.values(store.state.suggestions.suggestions.byId).filter(
        sugg => sugg.approver === user.value?.id && !sugg.status
      )
    );

    return {
        suggestions
    };
  }
});
</script>

<style lang="scss" scoped>
.title {
    margin-bottom: var(--spacing-2);
}
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
.empty-info {
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  margin-top: 120px;
  text-align: center;
}
</style>
