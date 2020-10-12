<template>
  <router-view v-if="user !== undefined" />
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import firebase from 'firebase';

import { useStore, UserActions } from './store';
import { convertUserIn } from './utils/store.utils';

export default defineComponent({
  setup() {
    const store = useStore();
    const user = computed(() => store.state.app.user);

    onMounted(() => {
      // Check if the user is already logged in
      const unsub = firebase.auth().onAuthStateChanged(user => {
        if (user) store.dispatch(UserActions.LOGIN, convertUserIn(user));
        else store.dispatch(UserActions.LOGOUT, undefined);
        unsub();
      });
    });

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
