import { createModuleActions } from '@/store/utils';
import { State, Category, InProgress, Checklist } from './state';

enum MutationTypes {
  SET_CATEGORIES = 'SET_CATEGORIES',
  SET_IN_PROGRESS = 'SET_IN_PROGRESS',
  SET_CURRENT_CATEGORY = 'SET_CURRENT_CATEGORY',
  SET_CHECKLISTS_FOR_CATEGORY = 'SET_CHECKLISTS_FOR_CATEGORY'
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
  [Mutations.SET_CURRENT_CATEGORY](
    state: State,
    payload: Category
  ): void;
  [Mutations.SET_CHECKLISTS_FOR_CATEGORY](
    state: State,
    payload: { [id: string]: Checklist }
  ): void;
};

export default {
  [Mutations.SET_CATEGORIES]: (state, payload) => {
    state.categoriesById = payload;
  },
  [Mutations.SET_IN_PROGRESS]: (state, payload) => {
    state.inProgressById = payload;
  },
  [Mutations.SET_CURRENT_CATEGORY]: (state, payload) => {
    state.currentCategory = payload;
  },
  [Mutations.SET_CHECKLISTS_FOR_CATEGORY]: (state, payload) => {
    state.checklistsById = payload;
  }
} as Mutations;
