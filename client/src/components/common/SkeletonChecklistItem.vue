<template>
  <skeleton-wrapper class="skeleton-wrapper">
    <div class="checkbox" />
    <div class="text-wrapper">
      <div class="heading" />
      <div class="text" />
    </div>
  </skeleton-wrapper>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import SkeletonWrapper from '@/components/common/SkeletonWrapper.vue';

export default defineComponent({
  components: {
    SkeletonWrapper
  }
});
</script>

<style lang="scss" scoped>
.skeleton-wrapper {
  display: flex;
  opacity: 0.1;

  .checkbox {
    width: 24px;
    height: 24px;
    background: white;
    border-radius: 100%;
    flex-shrink: 0;
    margin: var(--spacing-1) var(--spacing-1-5) var(--spacing-1) 0;
  }

  .text-wrapper {
    flex: 1;

    .heading {
      height: var(--font-size-large);
      width: 70%;
      background: white;
      border-radius: 4px;
      margin-bottom: var(--spacing-1);
    }

    .text {
      height: calc(var(--font-size-small) * 2 + 2px);
      width: 93%;
      background: white;
      opacity: 0.75;
      border-radius: 4px;
    }
  }
}
</style>
