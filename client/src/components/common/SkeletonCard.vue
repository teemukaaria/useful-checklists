<template>
  <skeleton-wrapper class="skeleton-wrapper">
    <div
      class="skeleton-card"
      :style="{
        height: height ? `${height}px` : '100%',
        width: width ? `${width}px` : '100%'
      }"
    />
  </skeleton-wrapper>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import SkeletonWrapper from './SkeletonWrapper.vue';

export default defineComponent({
  components: {
    SkeletonWrapper
  },
  props: {
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 }
  }
});
</script>

<style lang="scss" scoped>
@keyframes slide {
  0% {
    background-position: 100%;
  }
  33% {
    background-position: 0%;
  }
  100% {
    background-position: 0%;
  }
}
.skeleton-card {
  background: var(--color-background-card);
  border-radius: var(--border-radius-card);
}
.skeleton-wrapper::after {
  border-radius: var(--border-radius-card);
}
</style>
