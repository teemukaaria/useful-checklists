<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <CategoryList :categories="categories" />
    <router-link to="/profile">Account</router-link>
    <router-link to="/checklist/create">Create checklist</router-link>
    <ul>
      <li v-for="checklist in checklists" :key="checklist">
        <router-link :to="`/checklist/${checklist}`">
          Checklist {{ checklist }}
        </router-link>
      </li>
    </ul>
    <p v-if="user">Logged in as {{ user.id }}</p>
    <button v-if="user" @click="handleLogoutClick">Logout</button>
    <button v-if="!user" @click="handleLoginClick">Login</button>
    <button v-if="!user" @click="handleSignUpClick">Sign Up</button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import CategoryList from '@/components/home/CategoryList.vue'; // @ is an alias to /src
import { useStore, UserActions } from '@/store';
import router from '../router';
import firebase from 'firebase';

export default defineComponent({
  name: 'Home',
  components: {
    CategoryList
  },
  setup() {
    const store = useStore();

    const handleLogoutClick = () => {
      firebase
        .auth()
        .signOut()
        .then(() => store.dispatch(UserActions.LOGOUT))
        .catch(() => {});
    }

    const user = computed(() => store.state.app.user);

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
      categories: [1, 2, 3],
      checklists: [1, 2, 3]
    };
  }
});
</script>

<style lang="scss" scoped>
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
