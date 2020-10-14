<template>
  <div class="wrapper">
    <template v-if="count === 0 && categories.status === 'loading'">
      <skeleton-card class=".skeleton" :height="198" />
      <skeleton-card class=".skeleton" :height="198" />
      <skeleton-card class=".skeleton" :height="198" />
    </template>
    <template v-else>
      <router-link
        v-for="category in Object.values(categories.byId)"
        :key="category.id"
        :to="`/category/${category.id}`"
      >
        <category-card :category="category" />
      </router-link>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import CategoryCard from './CategoryCard.vue';
import SkeletonCard from '@/components/common/SkeletonCard.vue';
import { Category, Content } from '@/store/modules/content/state';

export default defineComponent({
  name: 'CategoryList',
  components: {
    CategoryCard,
    SkeletonCard
  },
  props: {
    categories: {
      type: Object as () => Content<Category>,
      required: true
    }
  },
  setup(props) {
    const count = computed(() => Object.values(props.categories.byId).length);

    return {
      count
    };
  }
});
</script>

<style scoped lang="scss">
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
</style>
