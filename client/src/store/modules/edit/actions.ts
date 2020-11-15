import { ActionTree, ActionContext } from 'vuex';
import firebase from 'firebase';

import { createModuleActions } from '@/store/utils';
import { State, EditItem } from './state';
import { CombinedState } from '@/store';
import { Mutations } from './mutations';
import { SuggestionChange } from '../suggestions/state';

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
  SET_ORIGINAL = 'SET_ORIGINAL',
  PUBLISH = 'PUBLISH',
  SUGGEST_EDIT = 'SUGGEST_EDIT'
}

export const Actions = createModuleActions('EDIT', ActionTypes);

export interface ActionsInterface {
  [Actions.ADD_ITEM](context: AugmentedActionContext, item: EditItem): void;
  [Actions.EDIT_TITLE](
    context: AugmentedActionContext,
    payload: { item: EditItem; title: string }
  ): void;
  [Actions.EDIT_DESCRIPTION](
    context: AugmentedActionContext,
    payload: { item: EditItem; description: string }
  ): void;
  [Actions.REMOVE_ITEM](context: AugmentedActionContext, item: EditItem): void;
  [Actions.SET_TITLE](context: AugmentedActionContext, payload: string): void;
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
  [Actions.PUBLISH](context: AugmentedActionContext): Promise<string>;
  [Actions.SUGGEST_EDIT](
    context: AugmentedActionContext,
    originalId: string
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
  },

  async [Actions.PUBLISH]({ state, rootState }) {
    const items = Object.values(state.editItemsById);
    const user = rootState.app.user;
    if (!user) return;

    const doc = await firebase
      .firestore()
      .collection('checklists')
      .add({
        name: state.title,
        category: state.category,
        description: state.description,
        item_count: items.length,
        owner: user.id,
        collaborators: [],
        likes: 0,
        private: state.private,
        original: state.original ? state.original : ''
      });

    const batch = firebase.firestore().batch();
    items.forEach(item =>
      batch.set(doc.collection('items').doc(), {
        name: item.name ? item.name : '',
        description: item.description ? item.description : '',
        order: item.order || 999
      })
    );

    await batch.commit();
    return doc.id;
  },

  [Actions.SUGGEST_EDIT]: async ({ state, rootState }, originalId) => {
    const checklist = rootState.content.checklists.byId[originalId];
    const items = rootState.content.itemsByChecklist.byId[originalId];
    const user = rootState.app.user;
    if (!checklist || !items || !user) return;

    const changes = [] as SuggestionChange[];
    // Checklist name or description changed
    if (
      state.title !== checklist.name ||
      state.description !== checklist.description
    )
      changes.push({
        id: checklist.id,
        type: 'update',
        new: { name: state.title, description: state.description }
      });

    // Find removed items
    for (const item of Object.values(items)) {
      if (!Object.keys(state.editItemsById).includes(item.id))
        changes.push({ type: 'delete', id: item.id, new: undefined });
    }
    // Find new items
    for (const item of Object.values(state.editItemsById)) {
      if (
        !Object.keys(items).includes(item.id) &&
        (item.name || item.description)
      )
        changes.push({
          id: '',
          type: 'create',
          new: { name: item.name, description: item.description }
        });
    }
    // Find modified items
    for (const item of Object.values(state.editItemsById)) {
      const oldItem = items[item.id];
      if (!oldItem) continue;
      if (
        oldItem.name !== item.name ||
        oldItem.description !== item.description
      )
        changes.push({
          type: 'update',
          id: oldItem.id,
          new: { name: item.name, description: item.description }
        });
    }

    const db = firebase.firestore();
    const suggestionRef = await db.collection('suggestions').add({
      user: user.id,
      checklist: {
        id: checklist.id,
        description: checklist.description,
        name: checklist.name
      },
      count: changes.length,
      approver: checklist.owner
    });
    const batch = db.batch();
    const changesRef = suggestionRef.collection('changes');
    for (const change of changes) {
      const { id, type, new: item } = change;
      if (type === 'delete') batch.set(changesRef.doc(id), { type });
      if (type === 'update') batch.set(changesRef.doc(id), { type, new: item });
      if (type === 'create') batch.set(changesRef.doc(), { type, new: item });
    }
    await batch.commit();
  }
} as ActionTree<State, CombinedState> & ActionsInterface;
