import { createModuleActions } from '@/store/utils';
import { State, Category, InProgress } from './state';

enum MutationTypes {
  SET_CATEGORIES = 'SET_CATEGORIES',
  SET_IN_PROGRESS = 'SET_IN_PROGRESS'
}

export const Mutations = createModuleActions('CONTENT', MutationTypes);

export type Mutations = {
  [Mutations.SET_CATEGORIES](
    state: State,
    payload: { [id: string]: Category }
  ): void;
  [Mutations.SET_IN_PROGRESS](
    state: State,
    payload: { [id: string]: InProgress }
  ): void;
};

export default {
  [Mutations.SET_CATEGORIES]: (state, payload) => {
    state.categoriesById = payload;
  },
  [Mutations.SET_IN_PROGRESS]: (state, payload) => {
    state.inProgressById = payload;
  }
} as Mutations;
