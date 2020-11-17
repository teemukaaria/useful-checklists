<template>
  <div class="suggestion-card card" :style="{ '--color': 'var(--color-blue)' }">
    <h6>{{ suggestion.checklist.name }}</h6>
    <p class="typography--body">{{ suggestion.checklist.description }}</p>
    <router-link :to="`/review/${suggestion.id}`">
        <primary-button class="examine-button" :style="{ '--color': 'var(--color-blue)' }">examine suggestion</primary-button>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Suggestion } from '@/store/modules/suggestions/state';
import PrimaryButton from '@/components/general/PrimaryButton.vue'

export default defineComponent({
  name: 'ChecklistCard',
  props: {
    suggestion: {
      type: Object as () => Suggestion,
      required: true
    }
  },
  components: {
      PrimaryButton
  }
});
</script>

<style lang="scss" scoped>
.suggestion-card {
  display: flex;
  position: relative;
  flex-direction: column;
  text-decoration: none;

  p {
    font-size: var(--font-size-small);
  }

  & > *:not(:last-child) {
    margin-bottom: var(--spacing-1-5);
  }

  .examine-button {
      margin-left: auto;
  }

}
</style>