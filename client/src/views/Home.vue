<template>
  <div class="home">
    <div class="section">
      <h2
        v-if="
          inProgress.status !== 'done' ||
            Object.values(inProgress.byId).length > 0
        "
      >
        In progress
      </h2>
      <in-progress-list
        :checklists="inProgress"
        :loading="!inProgress.status || inProgress.status === 'loading'"
      />
    </div>
    <div class="section">
      <h2>Explore checklists</h2>
      <category-list :categories="categories" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch, onMounted } from 'vue';

import InProgressList from '@/components/home/InProgressList.vue';
import CategoryList from '@/components/home/CategoryList.vue';
import { useStore, ContentActions } from '@/store';

export default defineComponent({
  name: 'Home',
  components: {
    CategoryList,
    InProgressList
  },
  setup() {
    const store = useStore();

    const user = computed(() => store.state.app.user);
    const categories = computed(() => store.state.content.categories);
    const inProgress = computed(() => store.state.content.inProgress);

    const fetch = () => {
      if (user.value) {
        store.dispatch(ContentActions.FETCH_IN_PROGRESS, undefined);
      }
    };
    onMounted(() => fetch());
    const userId = computed(() => user.value && user.value.id);
    watch(userId, (userId, prevUserId) => {
      if (!prevUserId || userId !== prevUserId) fetch();
    });

    return {
      user,
      categories,
      inProgress
    };
  }
});
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
}

h2 {
  margin-bottom: var(--spacing-2);
}

.section {
  &:not(:last-child) {
    margin-bottom: var(--spacing-4);
  }
}
</style>
