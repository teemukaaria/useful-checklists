<template>
  <div class="page">
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
    <profile-icon class="center" style="width: 40%; margin-top: var(--spacing-4);" :image="user.image" />
    <p v-if="user" class="center name">{{ user.name }}</p>
    <p v-if="date" class="center date">Member since {{ date }}</p>
    <div class="action-buttons">
      <span class="iconed-button">
        <primary-button class="pad" :style="{ '--color': 'var(--color-blue)' }" type="contained">
          <bookmark-icon />
        </primary-button>
        <span>Saved Checklists</span>
      </span>
      <span class="iconed-button">
        <primary-button class="pad" :style="{ '--color': 'var(--color-orange)' }" type="contained">
          <bookmark-icon />
        </primary-button>
        <span>My Checklists</span>
      </span>
      <span class="iconed-button">
        <primary-button class="pad" :style="{ '--color': 'var(--color-green)' }" type="contained">
          <bookmark-icon />
        </primary-button>
        <span>Suggestions to my Checklists</span>
      </span>
    </div>
    <primary-button v-if="user" class="center logout" @click="handleLogoutClick" :style="{ '--color': 'var(--color-orange)' }">Logout</primary-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue';
import firebase from 'firebase';
import { useRouter } from 'vue-router';
import ProfileIcon from '@/components/app/ProfileIcon.vue';
import PrimaryButton from '@/components/general/PrimaryButton.vue'
import BookmarkIcon from '@/assets/icons/BookmarkIcon.vue';

import { useStore, UserActions, SuggestionActions } from '@/store';

export default defineComponent({
  components: {
    ProfileIcon,
    PrimaryButton,
    BookmarkIcon
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const user = computed(() => store.state.app.user);
    const date = computed(() => store.state.app.user && store.state.app.user.registered.getFullYear());

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
      suggestions,
      date
    };
  }
});
</script>

<style lang="scss" scoped>
  
  .vertical-flex {
    display: flex;
    flex-direction: column;
  }

  .center {
    margin-left: auto; 
    margin-right: auto;
    width: fit-content;
  }

  .name {
    font-size: var(--font-size-large);
  }

  .date {
    font-size: var(--font-size-small);
    opacity: 50%;
  }

  .logout {
    margin-top: var(--spacing-4);
  }

  .iconed-button {
    display: flex;
    align-items: center;
    margin-top: var(--spacing-1-5);
  }

  .pad {
    padding-left: var(--spacing-1);
    padding-right: var(--spacing-1);
    margin-right: var(--spacing-1);
  }

  .action-buttons {
    width: fit-content;
    margin: auto;
  }

</style>
