import {
  createStore,
  useStore as useVuexStore,
  Store as VuexStore,
  DispatchOptions,
  createLogger
} from 'vuex';

import app, { State as AppState } from './modules/app';
import { ActionsInterface as AppActionsInterface } from './modules/app/actions';
export { Actions as UserActions } from './modules/app/actions';

import content, { State as ContentState } from './modules/content';
import { ActionsInterface as ContentActionsInterface } from './modules/content/actions';
export { Actions as ContentActions } from './modules/content/actions';

export type RootState = {};

export type CombinedState = RootState & {
  app: AppState;
  content: ContentState;
};

type CombinedActions = AppActionsInterface & ContentActionsInterface;

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
    app,
    content
  },
  plugins: [createLogger()]
}) as Store;

export const useStore = () => useVuexStore<CombinedState>() as Store;
