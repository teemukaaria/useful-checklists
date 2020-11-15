import { createModuleActions } from '@/store/utils';
import { State, User } from './state';

enum MutationTypes {
  SET_USER = 'SET_USER',
  LIKE_CHECKLIST = 'LIKE_CHECKLIST'
}

export const Mutations = createModuleActions('APP', MutationTypes);

export type Mutations = {
  [Mutations.SET_USER](state: State, payload: User | null): void;
  [Mutations.LIKE_CHECKLIST](
    state: State,
    payload: { checklistId: string; like: boolean }
  ): void;
};

export default {
  [Mutations.SET_USER]: (state, payload) => {
    state.user = payload && { ...(state.user || {}), ...payload };
  },
  [Mutations.LIKE_CHECKLIST]: (state, { checklistId, like }) => {
    const list = state.user?.liked || [];
    state.user = {
      ...(state.user as User),
      liked: like ? [...list, checklistId] : list.filter(x => x !== checklistId)
    };
  }
} as Mutations;
