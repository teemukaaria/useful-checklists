<template>
  <div class="wrapper">
    <router-link
      v-for="category in categories"
      :key="category.id"
      :to="`/category/${category.id}`"
    >
      <category-card :category="category" />
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import CategoryCard from './CategoryCard.vue';
import { Category } from '@/store/modules/content/state';

export default defineComponent({
  name: 'CategoryList',
  components: {
    CategoryCard
  },
  props: {
    categories: {
      type: Array as () => Category[],
      required: true
    }
  }
});
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}

.wrapper {
  display: flex;
  flex-direction: column;

  a {
    text-decoration: none;

    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }
}
</style>
