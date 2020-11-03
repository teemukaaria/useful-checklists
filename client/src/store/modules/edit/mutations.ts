import { createModuleActions } from '@/store/utils';
import { EditItem, State } from './state';

enum MutationTypes {
  NEW_ITEM = 'NEW_ITEM',
  EDIT_TITLE = 'EDIT_TITLE',
  EDIT_DESCRIPTION = 'EDIT_DESCRIPTION',
  REMOVE_ITEM = 'REMOVE_ITEM',
  SET_TITLE = 'SET_TITLE',
  SET_DESCRIPTION = 'SET_DESCRIPTION',
  SET_CATEGORY = 'SET_CATEGORY',
  SET_PRIVATE = 'SET_PRIVATE'
}

export const Mutations = createModuleActions('EDIT', MutationTypes);

export type Mutations = {
  [Mutations.NEW_ITEM](
    state: State,
    payload: EditItem
  ): void;
  [Mutations.EDIT_TITLE](
    state: State,
    payload: { item: EditItem; title?: string }
  ): void;
  [Mutations.EDIT_DESCRIPTION](
    state: State,
    payload: { item: EditItem; description?: string }
  ): void;
  [Mutations.REMOVE_ITEM](
    state: State,
    payload: EditItem
  ): void;
  [Mutations.SET_TITLE](
    state: State,
    payload: string
  ): void;
  [Mutations.SET_DESCRIPTION](
    state: State,
    payload: string
  ): void;
  [Mutations.SET_CATEGORY](
    state: State,
    payload: string
  ): void;
  [Mutations.SET_PRIVATE](
    state: State,
    payload: boolean
  ): void;
};

export default {
  [Mutations.NEW_ITEM]: (state, payload) => {
    state.editItemsById[payload.id] = payload;
  },
  [Mutations.EDIT_TITLE]: (state, payload) => {
    state.editItemsById[payload.item.id].name = payload.title;
  },
  [Mutations.EDIT_DESCRIPTION]: (state, payload) => {
    state.editItemsById[payload.item.id].description = payload.description;
  },
  [Mutations.REMOVE_ITEM]: (state, payload) => {
    delete state.editItemsById[payload.id];
    for (let item of Object.values(state.editItemsById)) {
      if (item.order > payload.order) {
        item.order--;
      }
    }
  },
  [Mutations.SET_TITLE]: (state, payload) => {
    state.title = payload;
  },
  [Mutations.SET_DESCRIPTION]: (state, payload) => {
    state.description = payload;
  },
  [Mutations.SET_CATEGORY]: (state, payload) => {
    state.category = payload;
  },
  [Mutations.SET_PRIVATE]: (state, payload) => {
    state.private = payload;
  }
} as Mutations;
