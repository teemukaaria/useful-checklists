import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import * as firebase from 'firebase';
import config from './firebase.json';

firebase.initializeApp(config);

createApp(App)
  .use(store)
  .use(router)
  .mount('#app');
