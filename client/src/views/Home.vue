<template>
  <div class="home">
    <div class="section">
      <h2 v-if="inProgress.length > 0">In progress</h2>
      <in-progress-list :checklists="inProgress" />
    </div>
    <div class="section">
      <h2>Explore checklists</h2>
      <category-list :categories="categories" />
    </div>
    <router-link to="/profile">Account</router-link>
    <router-link to="/checklist/create">Create checklist</router-link>
    <ul>
      <li v-for="checklist in checklists" :key="checklist">
        <router-link :to="`/checklist/${checklist}`">
          Checklist {{ checklist }}
        </router-link>
      </li>
    </ul>
    <p v-if="user">Logged in as {{ user.name }}</p>
    <button v-if="user" @click="handleLogoutClick">Logout</button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import firebase from 'firebase';

import InProgressList from '@/components/home/InProgressList.vue';
import CategoryList from '@/components/home/CategoryList.vue';
import { useStore, UserActions, ContentActions } from '@/store';

export default defineComponent({
  name: 'Home',
  components: {
    CategoryList,
    InProgressList
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const user = computed(() => store.state.app.user);
    const categories = computed(() =>
      Object.values(store.state.content.categoriesById)
    );
    const inProgress = computed(() =>
      Object.values(store.state.content.inProgressById)
    );

    onMounted(() => {
      if (user.value) {
        store.dispatch(ContentActions.FETCH_CATEGORIES, undefined);
        store.dispatch(ContentActions.FETCH_IN_PROGRESS, undefined);
      }
    });

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

    const handleLoginClick = () => {
      router.push('/login');
    };

    const handleSignUpClick = () => {
      router.push('/register');
    };

    return {
      user,
      handleLogoutClick,
      handleLoginClick,
      handleSignUpClick,
      categories,
      inProgress,
      checklists: [1, 2, 3]
    };
  }
});
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
}

h2 {
  margin-bottom: 8px;
}

.section {
  &:not(:last-child) {
    margin-bottom: 16px;
  }
}

button,
a {
  display: block;
  margin: auto;
  margin-top: 16px;
}

ul {
  padding-inline-start: 0;

  li {
    display: inline-block;

    &:not(:last-child) {
      margin-right: 8px;
    }
  }
}
</style>
