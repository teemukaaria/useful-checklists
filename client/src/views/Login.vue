<template>
  <div class="container">
    <div>
      <div>
        <div>
          <div>Login</div>
          <div>
            <div v-if="error">{{error.message}}</div>
            <form action="#" @submit.prevent="handleLoginClick">
              <div>
                <label for="email">Email</label>

                <div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    autofocus
                    v-model="form.email"
                  />
                </div>
              </div>

              <div>
                <label for="password">Password</label>

                <div>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    v-model="form.password"
                    required
                  />
                </div>
              </div>

              <div>
                <div>
                  <button type="submit">Login</button>
                </div>
              </div>
            </form>
            <button v-on:click="handleSignUpClick">Sign up</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import firebase from 'firebase';
import { defineComponent, reactive } from 'vue';
import { useStore, UserActions } from '@/store';
import router from '../router';

export default defineComponent({
  
  setup() {
    const form = reactive({
      email: "",
      password: ""
    });
    const signupForm = reactive({
      name: "",
      username: "",
      email: "",
      password: "",
      password2: ""
    });
    const error = reactive({ message: null });
    const store = useStore();
    const handleLoginClick = () => firebase
      .auth()
      .signInWithEmailAndPassword(form.email, form.password)
      .then(data => {
        
        if (data == null || data.user == null) {
          return;
        }

        const name = data.user.displayName != null ? data.user.displayName : data.user.email;

        store.dispatch(UserActions.LOGIN, name);
        router.replace('/')
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
      handleSignUpClick,
    };
  }
});

</script>