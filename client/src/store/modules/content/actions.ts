import { ActionTree, ActionContext } from 'vuex';
import firebase from 'firebase';

import { createModuleActions } from '@/store/utils';
import { State, Category, InProgress } from './state';
import { CombinedState } from '@/store';
import { Mutations } from './mutations';

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, CombinedState>, 'commit'>;

enum ActionTypes {
  FETCH_CATEGORIES = 'FETCH_CATEGORIES',
  FETCH_IN_PROGRESS = 'FETCH_IN_PROGRESS'
}

export const Actions = createModuleActions('CONTENT', ActionTypes);

export interface ActionsInterface {
  [Actions.FETCH_CATEGORIES](context: AugmentedActionContext): void;
  [Actions.FETCH_IN_PROGRESS](context: AugmentedActionContext): void;
}

export default {
  async [Actions.FETCH_CATEGORIES]({ commit }) {
    const categories = {} as { [id: string]: Category };
    await firebase
      .firestore()
      .collection('categories')
      .get()
      .then(snapshot =>
        snapshot.forEach(
          doc =>
            (categories[doc.id] = { ...doc.data(), id: doc.id } as Category)
        )
      );
    commit(Mutations.SET_CATEGORIES, categories);
  },
  async [Actions.FETCH_IN_PROGRESS]({ commit, rootState }) {
    const { user } = rootState.app;
    const inProgress = {} as { [id: string]: InProgress };
    await firebase
      .firestore()
      .collection('in_progress')
      .where('user', '==', user && user.id)
      .get()
      .then(snap =>
        snap.forEach(
          doc =>
            (inProgress[doc.id] = { ...doc.data(), id: doc.id } as InProgress)
        )
      );
    commit(Mutations.SET_IN_PROGRESS, inProgress);
  }
} as ActionTree<State, CombinedState> & ActionsInterface;
