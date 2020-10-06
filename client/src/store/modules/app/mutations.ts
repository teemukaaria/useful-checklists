import { createModuleActions } from '@/store/utils';
import { State, User } from './state';

enum MutationTypes {
  SET_USER = 'SET_USER'
}

export const Mutations = createModuleActions('APP', MutationTypes);

export type Mutations<S = State> = {
  [Mutations.SET_USER](state: S, payload: User | null): void;
};

export default {
  [Mutations.SET_USER]: (state, payload) => {
    state.user = payload;
  }
} as Mutations;
