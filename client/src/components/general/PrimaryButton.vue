<template>
  <button class="primary-button card card--colored">
    {{ text }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PrimaryButton',
  props: {
    text: String
  }
});
</script>

<style lang="scss" scoped>
.primary-button {
  color: var(--color, white);
  border: none;
  padding: var(--spacing-1) var(--spacing-2);
  font-weight: bold;
  text-transform: uppercase;

  &::before {
    opacity: 0.15;
  }
}
</style>
