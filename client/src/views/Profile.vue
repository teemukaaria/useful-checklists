<template>
  <div>
    <profile-icon class="center" style="width: 40%; margin-top: var(--spacing-4);" :image="user.image" />
    <p v-if="user" class="center name">{{ user.name }}</p>
    <p v-if="date" class="center date">Member since {{ date }}</p>
    <div class="action-buttons">
      <primary-button class="center spacing" @click="handleMyChecklistsClick" :style="{ '--color': 'var(--color-orange)' }" type="contained">
        <user-icon />
        <span>My Checklists</span>
      </primary-button>
      <primary-button class="center spacing" @click="handleSuggestionsClick" :style="{ '--color': 'var(--color-green)' }" type="contained">
        <eye-icon />
        <span>Suggestions</span>
      </primary-button>
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
import EyeIcon from '@/assets/icons/EyeIcon.vue';
import UserIcon from '@/assets/icons/UserIcon.vue';

import { useStore, UserActions, ContentActions, EditActions, SuggestionActions } from '@/store';

export default defineComponent({
  components: {
    ProfileIcon,
    PrimaryButton,
    EyeIcon,
    UserIcon
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const user = computed(() => store.state.app.user);
    const date = computed(() => {
        return store.state.app.user && new Date(store.state.app.user.registered).getFullYear();
      });

    const handleLogoutClick = () => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          store.dispatch(UserActions.LOGOUT, undefined);
          store.dispatch(ContentActions.RESET, undefined);
          store.dispatch(EditActions.RESET, undefined);
          store.dispatch(SuggestionActions.RESET, undefined);
          router.replace('/login');
        })
        .catch(() => {});
    };

    const handleMyChecklistsClick = () => {
      router.replace('/mylists');
    };

    const handleSuggestionsClick = () => {
      router.replace('/review');
    };

    const handleSignUpClick = () => {
      router.push('/register');
    };

    return {
      handleLogoutClick,
      handleSignUpClick,
      user,
      date,
      handleMyChecklistsClick,
      handleSuggestionsClick
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
    margin-top: 80px;
  }

  .spacing {
    margin-top: var(--spacing-1-5);
  }

  .action-buttons {
    width: fit-content;
    margin: auto;
  }

</style>
