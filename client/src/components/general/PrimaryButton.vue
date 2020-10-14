<template>
  <button class="primary-button">
      {{ text }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PrimaryButton',
  props: {
    text: String,
  }
});
</script>

<style lang="scss" scoped>
.primary-button {
  color: var(--color-text);
  background: var(--color-blue);
  border-radius: 100px;
  padding-top: var(--padding-vertical);
  padding-bottom: var(--padding-vertical);
  padding-left: var(--padding-horizontal);
  padding-right: var(--padding-horizontal);
  font-weight: bold;
  text-transform: uppercase;
  opacity: 0.7;
}
</style>
