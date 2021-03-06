<template>
  <template v-if="user !== undefined">
    <app-bar />
    <router-view />
  </template>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import firebase from 'firebase';
import AppBar from '@/components/app/AppBar.vue';
import { useStore, UserActions, ContentActions, EditActions, SuggestionActions } from './store';
import { convertUserIn } from './utils/store.utils';

export default defineComponent({
  components: {
    AppBar
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.app.user);

    onMounted(() => {
      // Check if the user is already logged in
      const unsub = firebase.auth().onAuthStateChanged(user => {
        if (user) {
          store.dispatch(UserActions.LOGIN, convertUserIn(user));
        }
        else {
          store.dispatch(UserActions.LOGOUT, undefined);
          store.dispatch(ContentActions.RESET, undefined);
          store.dispatch(EditActions.RESET, undefined);
          store.dispatch(SuggestionActions.RESET, undefined);
        }
        unsub();
      });

      store.dispatch(ContentActions.FETCH_CATEGORIES, undefined);
    });

    return {
      user
    };
  }
});
</script>

<style lang="scss">
#app {
  font-family: Asap, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--color-text);
  max-width: 420px;
  padding: 16px;
  padding-top: 0;
  margin: auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
