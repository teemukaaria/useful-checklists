<template>
  <button class="icon-button">
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

<style lang="scss">
.icon-button {
  background: transparent;
  border: none;
  padding: 4px;

  svg {
    color: var(--color-text);
    display: block;
    width: 24px;
    height: 24px;
  }

  &:hover,
  &:active {
    svg {
      opacity: 0.6;
    }
  }
}
</style>
