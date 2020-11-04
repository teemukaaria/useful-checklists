import { ActionTree, ActionContext } from 'vuex';
import firebase from 'firebase';

import {
  createModuleActions
} from '@/store/utils';
import { State, EditItem } from './state';
import { CombinedState } from '@/store';
import { Mutations } from './mutations';

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, CombinedState>, 'commit'>;

enum ActionTypes {
  ADD_ITEM = 'ADD_ITEM',
  EDIT_TITLE = 'EDIT_TITLE',
  EDIT_DESCRIPTION = 'EDIT_DESCRIPTION',
  REMOVE_ITEM = 'REMOVE_ITEM',
  SET_TITLE = 'SET_TITLE',
  SET_DESCRIPTION = 'SET_DESCRIPTION',
  SET_CATEGORY = 'SET_CATEGORY',
  SET_PRIVATE = 'SET_PRIVATE',
  SET_ITEMS = 'SET_ITEMS',
  SET_ORIGINAL = 'SET_ORIGINAL'
}

export const Actions = createModuleActions('EDIT', ActionTypes);

export interface ActionsInterface {
  [Actions.ADD_ITEM](
    context: AugmentedActionContext,
    item: EditItem
  ): void;
  [Actions.EDIT_TITLE](
    context: AugmentedActionContext,
    payload: { item: EditItem; title?: string }
  ): void;
  [Actions.EDIT_DESCRIPTION](
    context: AugmentedActionContext,
    payload: { item: EditItem; description?: string }
  ): void;
  [Actions.REMOVE_ITEM](
    context: AugmentedActionContext,
    item: EditItem
  ): void;
  [Actions.SET_TITLE](
    context: AugmentedActionContext,
    payload: string
  ): void;
  [Actions.SET_DESCRIPTION](
    context: AugmentedActionContext,
    payload: string
  ): void;
  [Actions.SET_CATEGORY](
    context: AugmentedActionContext,
    payload: string
  ): void;
  [Actions.SET_PRIVATE](
    context: AugmentedActionContext,
    payload: boolean
  ): void;
  [Actions.SET_ITEMS](
    context: AugmentedActionContext,
    payload: EditItem[]
  ): void;
  [Actions.SET_ORIGINAL](
    context: AugmentedActionContext,
    payload?: string 
  ): void;
}

export default {
  async [Actions.ADD_ITEM]({ commit }, item: EditItem) {
    commit(Mutations.NEW_ITEM, item);
  },
  async [Actions.EDIT_TITLE]({ commit }, payload) {
    commit(Mutations.EDIT_TITLE, payload);
  },
  async [Actions.EDIT_DESCRIPTION]({ commit }, payload) {
    commit(Mutations.EDIT_DESCRIPTION, payload);
  },
  async [Actions.REMOVE_ITEM]({ commit }, item: EditItem) {
    commit(Mutations.REMOVE_ITEM, item);
  },
  async [Actions.SET_TITLE]({ commit }, item: string) {
    commit(Mutations.SET_TITLE, item);
  },
  async [Actions.SET_DESCRIPTION]({ commit }, item: string) {
    commit(Mutations.SET_DESCRIPTION, item);
  },
  async [Actions.SET_CATEGORY]({ commit }, item: string) {
    commit(Mutations.SET_CATEGORY, item);
  },
  async [Actions.SET_PRIVATE]({ commit }, item: boolean) {
    commit(Mutations.SET_PRIVATE, item);
  },
  async [Actions.SET_ITEMS]({ commit }, items: EditItem[]) {
    commit(Mutations.SET_ITEMS, items);
  },
  async [Actions.SET_ORIGINAL]({ commit }, original) {
    commit(Mutations.SET_ORIGINAL, original);
  }
} as ActionTree<State, CombinedState> & ActionsInterface;
