<template>
  <div class="wrapper">
    <img v-if="image" :src="image" aria-label="profile page" />
    <img v-else src="@/assets/user.png" aria-label="profile page" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    image: { type: String, default: null }
  }
});
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 2px;
  border-radius: 100%;

  img {
    border-radius: 100%;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
