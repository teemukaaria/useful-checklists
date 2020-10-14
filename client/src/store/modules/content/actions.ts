import { ActionTree, ActionContext } from 'vuex';
import firebase from 'firebase';

import { createModuleActions } from '@/store/utils';
import { State, Category, InProgress, Checklist } from './state';
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
  FETCH_IN_PROGRESS = 'FETCH_IN_PROGRESS',
  FETCH_CATEGORY_BY_ID = 'FETCH_CATEGORY_BY_ID',
  FETCH_CHECKLISTS_FOR_CATEGORY = 'FETCH_CHECKLISTS_FOR_CATEGORY'
}

export const Actions = createModuleActions('CONTENT', ActionTypes);

export interface ActionsInterface {
  [Actions.FETCH_CATEGORIES](context: AugmentedActionContext): void;
  [Actions.FETCH_IN_PROGRESS](context: AugmentedActionContext): void;
  [Actions.FETCH_CATEGORY_BY_ID](
    context: AugmentedActionContext,
    id: string
  ): void;
  [Actions.FETCH_CHECKLISTS_FOR_CATEGORY](
    context: AugmentedActionContext,
    category: string
  ): void;
}

export default {
  async [Actions.FETCH_CATEGORIES]({ commit }) {
    commit(Mutations.SET_LOADING, 'categories');
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
    commit(Mutations.SET_CONTENT, { key: 'categories', content: categories });
  },
  async [Actions.FETCH_IN_PROGRESS]({ commit, rootState }) {
    commit(Mutations.SET_LOADING, 'inProgress');
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
    commit(Mutations.SET_CONTENT, { key: 'inProgress', content: inProgress });
  },
  async [Actions.FETCH_CATEGORY_BY_ID]({ commit }, id: string) {
    await firebase
      .firestore()
      .collection('categories')
      .doc(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          commit(Mutations.ADD_CONTENT, {
            key: 'categories',
            content: { [doc.id]: doc.data() as Category }
          });
        } else {
          console.log('Could not find category for id: ' + id);
        }
      });
  },
  async [Actions.FETCH_CHECKLISTS_FOR_CATEGORY]({ commit }, category: string) {
    commit(Mutations.SET_LOADING, 'checklists');
    const checklists = {} as { [id: string]: Checklist };
    await firebase
      .firestore()
      .collection('checklists')
      .where('category', '==', category)
      .get()
      .then(snapshot =>
        snapshot.forEach(
          doc =>
            (checklists[doc.id] = { ...doc.data(), id: doc.id } as Checklist)
        )
      );
    commit(Mutations.SET_CONTENT, { key: 'checklists', content: checklists });
  }
} as ActionTree<State, CombinedState> & ActionsInterface;
