<template>
  <div class="skeleton-wrapper">
    <slot />
  </div>
</template>

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
.skeleton-wrapper {
  position: relative;
  width: 100%;
  height: 100%;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    /* background: linear-gradient(
      -60deg,
      transparent 45%,
      #ffffff11,
      transparent 55%
    ); */
    background: linear-gradient(
      -60deg,
      transparent 45%,
      var(--color-background),
      transparent 55%
    );
    opacity: 0.2;
    background-size: 300%;
    animation: slide infinite 2s;
    animation-delay: 0.2s;
  }
}
</style>
