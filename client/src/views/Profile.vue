<template>
  <div>
    <h1>This is a profile/account page</h1>
    <p v-if="user">Logged in as {{ user.name }}</p>
    <button v-if="user" @click="handleLogoutClick">Logout</button>
    <router-link
      v-for="suggestion in suggestions"
      :key="suggestion.id"
      :to="`/review/${suggestion.id}`"
    >
      {{ suggestion.checklist.name }}
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue';
import firebase from 'firebase';
import { useRouter } from 'vue-router';

import { useStore, UserActions, SuggestionActions } from '@/store';

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();

    const user = computed(() => store.state.app.user);

    watch(
      [user],
      () => {
        if (user.value)
          store.dispatch(SuggestionActions.FETCH_SUGGESTIONS, 'received');
      },
      { immediate: true }
    );
    const suggestions = computed(() =>
      Object.values(store.state.suggestions.suggestions.byId).filter(
        sugg => sugg.approver === user.value?.id && !sugg.status
      )
    );

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
      user,
      suggestions
    };
  }
});
</script>
