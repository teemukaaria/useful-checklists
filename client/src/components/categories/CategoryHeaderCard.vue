<template>
  <div
    class="category-card card card--colored"
    :style="{ '--color': category.color }"
  >
    <span class="bar top">
      <h4>{{ category.name }}</h4>
      <div class="pimple" />
    </span>
    <p v-if="category.description" class="typography--body description">
      {{ category.description }}
    </p>
    <span class="bar">
      <span class="total">{{ category.list_count }} checklists</span>
      <router-link :to="`/checklist/create?category=${category.id}`">
        <primary-button>contribute</primary-button>
      </router-link>
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
  flex-direction: column;
  text-decoration: none;
  padding-bottom: var(--spacing-1);

  .bar {
    display: flex;
    align-items: center;

    &.top {
      margin-bottom: var(--spacing-1-5);
    }

    h4 {
      flex: 1;
    }

    .total {
      align-self: center;
      font-size: var(--font-size-small);
      flex: auto;
      color: var(--color);
    }
  }

  .description {
    margin-bottom: var(--spacing-1);
  }
}
</style>
