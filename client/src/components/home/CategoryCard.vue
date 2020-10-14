<template>
  <div
    class="category-card card card--colored"
    :style="{ '--color': category.color }"
  >
    <span class="bar">
      <h4>{{ category.name }}</h4>
      <div class="pimple" />
    </span>
    <ul>
      <li v-for="(highlight, i) in category.highlights" :key="i">
        {{ highlight }}
      </li>
    </ul>
    <span class="total">{{ category.list_count }} checklists</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Category } from '@/store/modules/content/state';

export default defineComponent({
  name: 'CategoryCard',
  props: {
    category: {
      type: Object as () => Category,
      required: true
    }
  }
});
</script>

<style lang="scss" scoped>
.category-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;

  .bar {
    display: flex;
    align-items: center;
    margin-bottom: var(--spacing-1-5);

    h4 {
      flex: 1;
    }
  }

  ul {
    list-style-type: none;

    li {
      font-size: var(--font-size-small);
      margin-bottom: var(--spacing-1-5);
      opacity: 0.7;
    }
  }

  .total {
    align-self: flex-end;
    font-size: var(--font-size-text);
    font-weight: 600;

    &::after {
      content: ' \02192';
      font-size: 22px;
    }
  }
}
</style>
