import { ActionTree, ActionContext } from 'vuex';
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
  LOGIN = 'LOGIN'
}

export const Actions = createModuleActions('APP', ActionTypes);

export interface ActionsInterface {
  [Actions.LOGOUT](context: AugmentedActionContext): void;
  [Actions.LOGIN](context: AugmentedActionContext, user: User): void;
}

export default {
  [Actions.LOGOUT]({ commit }) {
    commit(Mutations.SET_USER, null);
  },
  [Actions.LOGIN]({ commit }, user: User) {
    commit(Mutations.SET_USER, user);
  }
} as ActionTree<State, CombinedState> & ActionsInterface;
