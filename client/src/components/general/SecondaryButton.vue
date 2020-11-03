<template>
  <button
    :class="{
      'secondary-button': true,
      card: true,
      'card--no-background': true,
      'button--text': variant === 'text'
    }"
    :ref="e => (rootRef = e)"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useBlurOnClick } from '@/utils/ui.utils';

export default defineComponent({
  name: 'SecondaryButton',
  props: {
    variant: {
      type: String as () => 'contained' | 'text',
      default: 'contained'
    }
  },
  setup() {
    const rootRef = ref<HTMLButtonElement | null>(null);

    useBlurOnClick(rootRef);

    return { rootRef };
  }
});
</script>

<style lang="scss" scoped>
.secondary-button {
  color: var(--color, white);
  border: none;
  padding: var(--spacing-1) var(--spacing-2);
  font-weight: bold;
  font-size: var(--font-size-small);
  text-transform: uppercase;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.2s;

  /deep/ svg {
    color: var(--color, white);
    padding: 0;
    box-sizing: content-box;
    height: var(--font-size-large);
    width: var(--font-size-large);
    margin: -2px;

    &:not(:last-child) {
      margin-right: 4px;
    }
  }

  &:active {
    opacity: 0.7;
  }

  &::before {
    opacity: 0.15;
    z-index: 0;
  }

  &.button--text {
    background: none;
  }
  &.button--text::before {
    display: none;
  }
}
</style>
