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

import edit, { State as EditState } from './modules/edit';
import { ActionsInterface as EditActionsInterface } from './modules/edit/actions';
export { Actions as EditActions } from './modules/edit/actions';

import suggestions, { State as SuggestionState } from './modules/suggestions';
import { ActionsInterface as SuggestionActionsInterface } from './modules/suggestions/actions';
export { Actions as SuggestionActions } from './modules/suggestions/actions';

export type RootState = {};

export type CombinedState = RootState & {
  app: AppState;
  content: ContentState;
  edit: EditState;
  suggestions: SuggestionState;
};

type CombinedActions = AppActionsInterface &
  ContentActionsInterface &
  EditActionsInterface &
  SuggestionActionsInterface;

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
    content,
    edit,
    suggestions
  },
  plugins: [createLogger()]
}) as Store;

export const useStore = () => useVuexStore<CombinedState>() as Store;
