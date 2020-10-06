<template>
  <div>
    <h1>This is a cateogry page for {{ id }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const {
      params: { id }
    } = useRoute();

    return {
      id
    };
  }
});
</script>
