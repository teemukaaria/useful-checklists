<template>
  <div class="category-card" :style="{ '--color': category.color }">
    <span class="bar">
      <h6>{{ category.name }}</h6>
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
  position: relative;
  flex-direction: column;
  text-decoration: none;
  color: var(--color-text);
  padding: 8px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: var(--color);
    z-index: -1;
    border-radius: 8px;
    opacity: 0.5;
  }

  .bar {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    h6 {
      flex: 1;
    }

    .pimple {
      height: calc(var(--font-size-large) - 2px);
      width: calc(var(--font-size-large) - 2px);
      margin: 2px;
      border-radius: 100%;
      background: var(--color);
    }
  }

  ul {
    list-style-type: none;

    li {
      font-size: var(--font-size-small);
      margin-bottom: 4px;
      opacity: 0.7;
    }
  }

  .total {
    align-self: flex-end;
    font-size: var(--font-size-small);
    font-weight: bold;

    &::after {
      content: ' \02192';
      font-size: 22px;
    }
  }
}
</style>
