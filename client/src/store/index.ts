import { createStore, useStore as useVuexStore } from 'vuex';

import app, { State as AppState } from './modules/app';
export { Actions as UserActions } from './modules/app/actions';

export type RootState = {};

type CombinedState = RootState & { app: AppState };

export default createStore<CombinedState>({
  modules: {
    app
  }
});

export const useStore = () => useVuexStore<CombinedState>();
