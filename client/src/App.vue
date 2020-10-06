<template>
  <router-view v-if="user" />
  <LoginView v-else />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from './store';
import LoginView from './views/Login.vue';

export default defineComponent({
  components: {
    LoginView
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.app.user);

    return {
      user
    };
  }
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
