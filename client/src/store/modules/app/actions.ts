import { ActionTree, ActionContext } from 'vuex';
import { createModuleActions } from '@/store/utils';
import { State } from './state';
import { RootState } from '@/store';
import { Mutations } from './mutations';

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>;

enum ActionTypes {
  LOGOUT = 'LOGOUT',
  LOGIN = 'LOGIN'
}

export const Actions = createModuleActions('APP', ActionTypes);

export interface Actions {
  [Actions.LOGOUT](context: AugmentedActionContext): void;
  [Actions.LOGIN](context: AugmentedActionContext): void;
}

export default {
  [Actions.LOGOUT]({ commit }) {
    commit(Mutations.SET_USER, null);
  },
  [Actions.LOGIN]({ commit }) {
    // TODO
    commit(Mutations.SET_USER, { id: '' });
  }
} as ActionTree<State, RootState> & Actions;
