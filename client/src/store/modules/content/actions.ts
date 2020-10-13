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
  [Actions.FETCH_CATEGORY_BY_ID](context: AugmentedActionContext, id: string): void;
  [Actions.FETCH_CHECKLISTS_FOR_CATEGORY](context: AugmentedActionContext, category: string): void;
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
  },
  async [Actions.FETCH_CATEGORY_BY_ID]({ commit }, id: string) {
    console.log('>>>>> ' + id);
    await firebase
      .firestore()
      .collection('categories')
      .doc(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          console.log(doc.data());
          commit(Mutations.SET_CURRENT_CATEGORY, doc.data() as Category);
        } else {
          console.log("Could not find category for id: " + id);
        }
      });
  },
  async [Actions.FETCH_CHECKLISTS_FOR_CATEGORY]({ commit }, category: string) {
    console.log('<<<<<< ' + category);
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
    console.log(checklists);
    commit(Mutations.SET_CHECKLISTS_FOR_CATEGORY, checklists);
  },

} as ActionTree<State, CombinedState> & ActionsInterface;