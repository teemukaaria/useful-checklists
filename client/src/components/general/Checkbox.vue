<template>
  <div
    class="checkbox"
    @click="handleClick"
    @keyup.space="handleClick"
    role="checkbox"
    :aria-checked="modelValue"
    :tabindex="static ? null : 0"
  >
    <check-icon :class="{ icon: true, hidden: !modelValue }" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import CheckIcon from '@/assets/icons/CheckIcon.vue';

export default defineComponent({
  components: {
    CheckIcon
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    static: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const handleClick = () => {
      !props.static && emit('update:modelValue', !props.modelValue);
    };

    return {
      handleClick
    };
  }
});
</script>

<style lang="scss" scoped>
input[type='checkbox'] {
  width: 1px;
  height: 1px;
  opacity: 0;
}

input[type='checkbox']:checked .checkbox svg {
  display: block;
}

.checkbox {
  display: inline-block;
  border: 2px solid var(--color-text);
  border-radius: 100%;
  box-sizing: content-box;
  width: var(--font-size-large);
  height: var(--font-size-large);

  svg {
    width: 100%;
    height: 100%;
    color: var(--color, white);
    padding: 2px;
    opacity: 1;
    transform: scale(1);
    transition: all 0.2s;

    &.hidden {
      opacity: 0;
      transform: scale(0.7);
    }
  }
}
</style>
