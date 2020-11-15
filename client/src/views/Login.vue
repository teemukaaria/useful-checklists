<template>
  <div class="page login">
    <div class="content">
      <h2>Login</h2>
      <p class="info typography--body">
        Useful Checklist is a website created by Young Adults for other Young
        Adults to assist them in daily file situations and take the most out of
        it!
      </p>
      <p class="error" v-if="error">{{ error.message }}</p>
      <form action="#" @submit.prevent="handleLoginClick">
        <text-input
          id="email"
          label="Email"
          type="email"
          v-model="form.email"
          required
          autofocus
        />
        <text-input
          id="password"
          label="Password"
          type="password"
          v-model="form.password"
          required
        />
        <div class="button-bar">
          <primary-button>Login</primary-button>
          <primary-button @click.prevent="handleSignUpClick" variant="text">
            Sign up
          </primary-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import firebase from 'firebase';
import { defineComponent, reactive } from 'vue';
import { useStore, UserActions } from '@/store';
import { useRouter } from 'vue-router';
import { convertUserIn } from '@/utils/store.utils';
import TextInput from '@/components/general/TextInput.vue';
import PrimaryButton from '@/components/general/PrimaryButton.vue';

export default defineComponent({
  components: {
    TextInput,
    PrimaryButton
  },
  setup() {
    const form = reactive({
      email: '',
      password: ''
    });
    const error = reactive({ message: null });
    const store = useStore();
    const router = useRouter();
    const handleLoginClick = () =>
      firebase
        .auth()
        .signInWithEmailAndPassword(form.email, form.password)
        .then(data => {
          if (data == null || data.user == null) {
            return;
          }

          store.dispatch(UserActions.LOGIN, convertUserIn(data.user));
          router.replace('/');
        })
        .catch(err => {
          error.message = err.message;
        });
    const handleSignUpClick = () => {
      router.replace('/register');
    };

    return {
      form,
      error,
      handleLoginClick,
      handleSignUpClick
    };
  }
});
</script>

<style lang="scss" scoped>
.login {
  --color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: center;

  .content {
    flex: 0;

    .error {
      color: red;
      font-size: 14px;
      text-align: center;
      position: relative;
      bottom: 50px;
      margin: 0 -40px;
      height: 0;
    }

    h2 {
      text-align: center;
      margin-bottom: var(--spacing-1-5);
    }
    .info {
      margin: 0 -20px;
      text-align: center;
      line-height: 24px;
      margin-bottom: var(--spacing-7);
    }

    .button-bar {
      margin-top: var(--spacing-4);
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
      margin-left: calc(-1 * var(--spacing-2));
    }
  }
}
</style>
