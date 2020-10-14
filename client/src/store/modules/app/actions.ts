import { ActionTree, ActionContext } from 'vuex';
import firebase from 'firebase';

import { createModuleActions } from '@/store/utils';
import { State, User } from './state';
import { CombinedState } from '@/store';
import { Mutations } from './mutations';

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, CombinedState>, 'commit'>;

enum ActionTypes {
  LOGOUT = 'LOGOUT',
  LOGIN = 'LOGIN',
  FETCH_USER = 'FETCH_USER'
}

export const Actions = createModuleActions('APP', ActionTypes);

export interface ActionsInterface {
  [Actions.LOGOUT](context: AugmentedActionContext): void;
  [Actions.LOGIN](context: AugmentedActionContext, user: User): void;
  [Actions.FETCH_USER](context: AugmentedActionContext, id: string): void;
}

export default {
  [Actions.LOGOUT]({ commit }) {
    commit(Mutations.SET_USER, null);
  },
  [Actions.LOGIN]({ commit, dispatch }, user: User) {
    dispatch(Actions.FETCH_USER, user.id);
    commit(Mutations.SET_USER, user);
  },
  async [Actions.FETCH_USER]({ commit }, id: string) {
    const snap = await firebase
      .firestore()
      .doc(`users/${id}`)
      .get();
    commit(Mutations.SET_USER, { ...snap.data(), id: snap.id } as User);
  }
} as ActionTree<State, CombinedState> & ActionsInterface;
