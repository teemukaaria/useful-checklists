<template>
  <div
    class="skeleton"
    :style="{
      height: height ? `${height}px` : '100%',
      width: width ? `${width}px` : '100%'
    }"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
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
.skeleton {
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--color-background-card);
  border-radius: var(--border-radius-card);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(
      60deg,
      transparent 45%,
      #ffffff11,
      transparent 55%
    );
    background-size: 300%;
    border-radius: var(--border-radius-card);
    animation: slide infinite 2s;
  }
}
</style>
