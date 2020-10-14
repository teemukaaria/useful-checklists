<template>
  <div class="home">
    <div class="section">
      <category-header-card :category="category" />
    </div>
    <div class="section">
      <checklist-card-list :checklists="checklists" :color="category.color"/>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore, ContentActions } from '@/store';
import CategoryHeaderCard from '@/components/categories/CategoryHeaderCard.vue';
import ChecklistCardList from '@/components/categories/ChecklistCardList.vue';

export default defineComponent({
  name: 'Category',
  components: {
    CategoryHeaderCard,
    ChecklistCardList
  },
  setup() {
    const {
      params: { id }
    } = useRoute();

    const store = useStore();
    const router = useRoute();

    const user = computed(() => store.state.app.user);
    const checklists = computed(() =>
      Object.values(store.state.content.checklistsById)
    );

    const category = computed(() =>
      store.state.content.currentCategory
    );

    onMounted(() => {
      if (user.value) {
        store.dispatch(ContentActions.FETCH_CATEGORY_BY_ID, id as string);
        store.dispatch(ContentActions.FETCH_CHECKLISTS_FOR_CATEGORY, id as string);
      }
    });

    return {
      category,
      checklists
    };
  }
});
</script>

<style lang="scss" scoped>
.home {
  width: 100%;

  .section {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
}

</style>

