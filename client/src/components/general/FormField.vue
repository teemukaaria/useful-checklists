<template>
  <div class="form__field-wrapper">
    <label v-if="label" :for="id">{{ label }}</label>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    label: String,
    id: {
      type: String,
      required: true
    }
  }
});
</script>

<style lang="scss" scoped>
.form__field-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-2);

  label {
    transition: opacity 0.2s;
    color: var(--color-text);
    font-size: var(--font-size-xsmall);
    opacity: 0.5;
    margin-bottom: var(--spacing-0-5);
  }

  &:focus-within label {
    opacity: 1;
  }
}
</style>
