<template>
  <div>
    <h1>This is a login page</h1>
    <button @click="handleLoginClick">Login</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore, UserActions } from '@/store';

export default defineComponent({
  setup() {
    const store = useStore();

    const handleLoginClick = () => store.dispatch(UserActions.LOGIN);

    return {
      handleLoginClick
    };
  }
});
</script>
