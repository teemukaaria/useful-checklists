<template>
  <div class="category-card" :style="{ '--color': category.color }">
    <span class="bar">
      <h6>{{ category.name }}</h6>
      <div class="pimple" />
    </span>
    <p v-if="category.description" class="description">{{ category.description }}</p>
    <span class="bar">
      <span class="total">{{ category.list_count }} checklists</span>
      <primary-button text="contribute" />
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Category } from '@/store/modules/content/state';
import PrimaryButton from '@/components/general/PrimaryButton.vue';

export default defineComponent({
  name: 'CategoryHeaderCard',
  components: {
    PrimaryButton
  },
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

    .total {
      align-self: center;
      font-size: var(--font-size-small);
      font-weight: bold;
      flex: auto;
      color: var(--color);
      opacity: 0.7;
    }
  }

  .description {
    font-size: var(--font-size-small);
    margin-bottom: 8px;
  }

  ul {
    list-style-type: none;

    li {
      font-size: var(--font-size-small);
      margin-bottom: 4px;
      opacity: 0.7;
    }
  }
  
}
</style>