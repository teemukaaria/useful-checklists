<template>
  <div>
    <h1>This is a profile/account page</h1>
    <p v-if="user">Logged in as {{ user.name }}</p>
    <button v-if="user" @click="handleLogoutClick">Logout</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import firebase from 'firebase';
import { useRouter } from 'vue-router';

import { useStore, UserActions } from '@/store';

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();

    const user = computed(() => store.state.app.user);

    const handleLogoutClick = () => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          store.dispatch(UserActions.LOGOUT, undefined);
          router.replace('/login');
        })
        .catch(() => {});
    };

    const handleSignUpClick = () => {
      router.push('/register');
    };

    return {
      handleLogoutClick,
      handleSignUpClick,
      user
    };
  }
});
</script>
