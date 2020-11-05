<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div>Sign up</div>
          <div>
            <div v-if="error">{{ error.message }}</div>
            <form action="#" @submit.prevent="handleSignUpClick">
              <div>
                <label for="name">Name</label>

                <div>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    autofocus
                    v-model="signupForm.name"
                  />
                </div>
              </div>

              <div>
                <label for="username">Username</label>

                <div>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    v-model="signupForm.username"
                    required
                  />
                </div>
              </div>

              <div>
                <label for="email">Email</label>

                <div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    v-model="signupForm.email"
                    required
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
                    v-model="signupForm.password"
                    required
                  />
                </div>
              </div>

              <div>
                <label for="password2">Confirm Password</label>

                <div>
                  <input
                    id="password2"
                    type="password"
                    name="password2"
                    v-model="signupForm.password2"
                    required
                  />
                </div>
              </div>

              <div>
                <div>
                  <button type="submit">Sign up</button>
                </div>
              </div>
            </form>
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
import { convertUserIn } from '@/utils/store.utils';

export default defineComponent({
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
    const handleSignUpClick = () => {
      if (signupForm.password !== signupForm.password2) {
        error.message = 'Passwords mismatch.' as any;
      } else {
        firebase
          .auth()
          .createUserWithEmailAndPassword(signupForm.email, signupForm.password)
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
                  } as firebase.User)

                  firebase.firestore()
                    .collection('users')
                    .doc(user.id)
                    .set({
                      name: user.name,
                      username: signupForm.username,
                      liked: [],
                      registered: user.registered.getTime(),
                      image: data.user && data.user.photoURL,
                      notifications: {
                        suggestions: true
                      }
                    }).then(() => {
                      store.dispatch(UserActions.LOGIN, user);
                      router.replace('/');
                    });
                });
            }
          })
          .catch(err => {
            error.message = err.message;
          });
      }
    };

    return {
      signupForm,
      error,
      handleSignUpClick
    };
  }
});
</script>
