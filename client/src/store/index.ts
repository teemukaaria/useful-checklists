import {
  createStore,
  useStore as useVuexStore,
  Store as VuexStore,
  DispatchOptions
} from 'vuex';

import app, { State as AppState } from './modules/app';
import { ActionsInterface as AppActionsInterface } from './modules/app/actions';
export { Actions as UserActions } from './modules/app/actions';

export type RootState = {};

type CombinedState = RootState & { app: AppState };

type CombinedActions = AppActionsInterface;

// NOTE: Commits shoudn't be used outside of actions -> type error if tryig to commit
export type Store = Omit<VuexStore<CombinedState>, 'dispatch' | 'commit'> & {
  dispatch<K extends keyof CombinedActions>(
    key: K,
    payload: Parameters<CombinedActions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<CombinedActions[K]>;
} & { commit(): void };

export default createStore<CombinedState>({
  modules: {
    app
  }
}) as Store;

export const useStore = () => useVuexStore<CombinedState>() as Store;
