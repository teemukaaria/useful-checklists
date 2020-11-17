<template>
  <div class="page">
    <h4 class="title">My Checklists</h4>
    <h6
      v-if="!checklistsLoading && (!checklists || !checklists.length)"
      class="empty-info"
    >
      You have not created any checklists yet
    </h6>
    <checklist-card-list
      :checklists="checklists"
      :loading="checklistsLoading"
      color="var(--color-blue)"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore, ContentActions } from '@/store';

import ChecklistCardList from '@/components/categories/ChecklistCardList.vue';

export default defineComponent({
  name: 'MyChecklists',
  components: {
    ChecklistCardList
  },
  setup() {
    const store = useStore();

    const user = computed(() => store.state.app.user);
    const userId = computed(() => user.value && user.value.id);

    const checklists = computed(() =>
      Object.values(store.state.content.checklistsForCurrentUser.byId)
    );
    const checklistsLoading = computed(
      () =>
        !store.state.content.checklistsForCurrentUser.status ||
        store.state.content.checklistsForCurrentUser.status === 'loading'
    );

    watch(
      [userId],
      () => {
        if (userId.value) {
          store.dispatch(
            ContentActions.FETCH_CHECKLISTS_FOR_CURRENT_USER,
            undefined
          );
        }
      },
      { immediate: true }
    );

    return {
      checklists,
      checklistsLoading
    };
  }
});
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: var(--spacing-2);
}
.empty-info {
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  margin-top: 120px;
  text-align: center;
}
</style>
