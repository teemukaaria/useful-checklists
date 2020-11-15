<template>
  <div class="page register">
    <div class="content">
      <h2>Join Useful Checklist</h2>
      <p class="info typography--body">
        Useful Checklist is a website created by Young Adults for other Young
        Adults to assist them in daily file situations and take the most out of
        it!
      </p>
      <p class="error" v-if="error">{{ error.message }}</p>
      <form action="#" @submit.prevent="handleSignUpClick">
        <text-input
          id="name"
          label="Name"
          v-model="signupForm.name"
          required
          autofocus
        />

        <text-input
          id="username"
          label="Username"
          v-model="signupForm.username"
          required
        />

        <text-input
          id="email"
          label="Email"
          v-model="signupForm.email"
          type="email"
          required
        />

        <text-input
          id="password"
          label="Password"
          v-model="signupForm.password"
          type="password"
          required
        />

        <text-input
          id="password2"
          label="Confirm Password"
          v-model="signupForm.password2"
          type="password"
          required
        />

        <div class="button-bar">
          <primary-button>Sign up</primary-button>
          <primary-button @click.prevent="handleCancel" variant="text">
            Cancel
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
import { convertUserIn } from '@/utils/store.utils';
import TextInput from '@/components/general/TextInput.vue';
import PrimaryButton from '@/components/general/PrimaryButton.vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  components: {
    TextInput,
    PrimaryButton
  },
  setup() {
    const signupForm = reactive({
      name: '',
      username: '',
      email: '',
      password: '',
      password2: ''
    });
    const error = reactive({ message: null });
    const store = useStore();
    const router = useRouter();

    const handleCancel = () => {
      router.replace('/login');
    };

    const handleSignUpClick = () => {
      console.log('signupForm: ', signupForm);
      if (signupForm.password !== signupForm.password2) {
        error.message = 'Passwords mismatch.' as any;
      } else {
        firebase
          .auth()
          .createUserWithEmailAndPassword(signupForm.email, signupForm.password)
          .catch(err => {
            console.log('err: ', err);
            error.message = err.message;
          })
          .then(data => {
            if (data != null && data.user != null) {
              data.user
                .updateProfile({
                  displayName: signupForm.name
                })
                .then(() => {
                  const user = convertUserIn({
                    ...data.user,
                    displayName: signupForm.name
                  } as firebase.User);

                  firebase
                    .firestore()
                    .collection('users')
                    .doc(user.id)
                    .set({
                      name: user.name,
                      username: signupForm.username,
                      liked: [],
                      registered: user.registered.getTime(),
                      image:
                        (data.user && data.user.photoURL) ||
                        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
                      notifications: {
                        suggestions: true
                      }
                    })
                    .then(() => {
                      store.dispatch(UserActions.LOGIN, user);
                      router.replace('/');
                    });
                });
            }
          });
      }
    };

    return {
      signupForm,
      error,
      handleSignUpClick,
      handleCancel
    };
  }
});
</script>

<style lang="scss" scoped>
.register {
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
