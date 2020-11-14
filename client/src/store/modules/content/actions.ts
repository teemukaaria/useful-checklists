import { ActionTree, ActionContext, DispatchOptions } from 'vuex';
import firebase from 'firebase';

import {
  convertDocIn,
  convertListToByIdMap,
  createModuleActions
} from '@/store/utils';
import { State, Category, InProgress, Checklist, ChecklistItem } from './state';
import { CombinedState } from '@/store';
import { Mutations } from './mutations';
import { convertChecklistToInProgress } from './utils';

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
  dispatch<K extends keyof ActionsInterface>(
    key: K,
    payload: Parameters<ActionsInterface[K]>[1],
    options?: DispatchOptions
  ): ReturnType<ActionsInterface[K]>;
} & Omit<ActionContext<State, CombinedState>, 'commit' | 'dispatch'>;

export const TEMP_IN_PROGRESS_ID = 'temp';

enum ActionTypes {
  FETCH_CATEGORIES = 'FETCH_CATEGORIES',
  FETCH_IN_PROGRESS = 'FETCH_IN_PROGRESS',
  FETCH_CATEGORY_BY_ID = 'FETCH_CATEGORY_BY_ID',
  FETCH_CHECKLISTS_FOR_CATEGORY = 'FETCH_CHECKLISTS_FOR_CATEGORY',
  FETCH_CHECKLIST = 'FETCH_CHECKLIST',
  START_CHECKLIST = 'START_CHECKLIST',
  MARK_ITEM = 'MARK_ITEM'
}

export const Actions = createModuleActions('CONTENT', ActionTypes);

export interface ActionsInterface {
  [Actions.FETCH_CATEGORIES](context: AugmentedActionContext): void;
  [Actions.FETCH_IN_PROGRESS](context: AugmentedActionContext): void;
  [Actions.FETCH_CATEGORY_BY_ID](
    context: AugmentedActionContext,
    id: string
  ): void;
  [Actions.FETCH_CHECKLISTS_FOR_CATEGORY](
    context: AugmentedActionContext,
    category: string
  ): void;
  [Actions.FETCH_CHECKLIST](
    context: AugmentedActionContext,
    payload: { checklistId: string; collection?: 'checklists' | 'in_progress' }
  ): void;
  [Actions.START_CHECKLIST](
    context: AugmentedActionContext,
    checklistId: string
  ): Promise<string>;
  [Actions.MARK_ITEM](
    context: AugmentedActionContext,
    payload: {
      inProgressId?: string;
      checklistId: string;
      itemId: string;
      done: boolean;
    }
  ): Promise<string>;
}

export default {
  async [Actions.FETCH_CATEGORIES]({ commit }) {
    commit(Mutations.SET_LOADING, 'categories');
    const categories = await firebase
      .firestore()
      .collection('categories')
      .get()
      .then(snap => snap.docs.map(convertDocIn) as Category[])
      .then(convertListToByIdMap);
    commit(Mutations.SET_CONTENT, { key: 'categories', content: categories });
  },

  async [Actions.FETCH_IN_PROGRESS]({ commit, rootState }) {
    commit(Mutations.SET_LOADING, 'inProgress');
    const { user } = rootState.app;
    const inProgress = await firebase
      .firestore()
      .collection('in_progress')
      .where('user', '==', user && user.id)
      .get()
      .then(snap => snap.docs.map(convertDocIn) as InProgress[])
      .then(convertListToByIdMap);
    commit(Mutations.SET_CONTENT, { key: 'inProgress', content: inProgress });
  },

  async [Actions.FETCH_CATEGORY_BY_ID]({ commit }, id: string) {
    commit(Mutations.SET_LOADING, 'categories');
    await firebase
      .firestore()
      .collection('categories')
      .doc(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          commit(Mutations.ADD_CONTENT, {
            key: 'categories',
            content: { [doc.id]: convertDocIn<Category>(doc) }
          });
        } else {
          console.log('Could not find category for id: ' + id);
        }
      });
  },

  async [Actions.FETCH_CHECKLISTS_FOR_CATEGORY]({ commit }, category: string) {
    commit(Mutations.SET_LOADING, 'checklists');
    commit(Mutations.SET_LOADING, 'checklistsByCategory');

    const user = firebase.auth().currentUser;
    const checklistsRef = firebase.firestore().collection('checklists');

    async function getAvailableChecklists() {
      const isPublic = checklistsRef
        .where('category', '==', category)
        .where('private', '==', false)
        .get();
      const isUser = checklistsRef
        .where('category', '==', category)
        .where('owner', '==', user?.uid || '')
        .get();

      const [publicChecklists, userChecklists] = await Promise.all([
        isPublic,
        isUser
      ]);

      const publicChecklistsArray = publicChecklists.docs.map(convertDocIn);
      const userChecklistsArray = userChecklists.docs.map(convertDocIn);

      return publicChecklistsArray.concat(userChecklistsArray);
    }

    const checklists = await getAvailableChecklists()
      .then(snap => snap as Checklist[])
      .then(convertListToByIdMap);
    commit(Mutations.ADD_CONTENT, { key: 'checklists', content: checklists });
    commit(Mutations.ADD_CONTENT, {
      key: 'checklistsByCategory',
      content: { [category]: Object.keys(checklists) }
    });
  },

  async [Actions.FETCH_CHECKLIST](
    { commit },
    { checklistId, collection = 'checklists' }
  ) {
    if (!checklistId) return;
    commit(
      Mutations.SET_LOADING,
      collection === 'checklists' ? 'checklists' : 'inProgress'
    );
    commit(Mutations.SET_LOADING, 'itemsByChecklist');

    const checklistRef = firebase
      .firestore()
      .collection(collection)
      .doc(checklistId);
    const checklist: Checklist = await checklistRef.get().then(convertDocIn);
    const checklistItems: ChecklistItem[] = await checklistRef
      .collection('items')
      .get()
      .then(snap => snap.docs.map(convertDocIn));

    commit(Mutations.ADD_CONTENT, {
      key: 'itemsByChecklist',
      content: { [checklist.id]: convertListToByIdMap(checklistItems) }
    });
    commit(Mutations.ADD_CONTENT, {
      key: collection === 'checklists' ? 'checklists' : 'inProgress',
      content: { [checklist.id]: checklist }
    });
  },

  async [Actions.START_CHECKLIST](
    { commit, dispatch, state, rootState },
    checklistId
  ) {
    const checklist = state.checklists.byId[checklistId];
    const items = state.itemsByChecklist.byId[checklistId];
    const user = rootState.app.user;
    if (!user || !checklist || !items)
      throw Error('Not necessary data available');

    // Copy the checklist to in progress
    const createdRef = await firebase
      .firestore()
      .collection('in_progress')
      .add(convertChecklistToInProgress(checklist, user.id));
    await Promise.all(
      Object.values(items).map(item =>
        createdRef
          .collection('items')
          .doc(item.id)
          .set(item)
      )
    );
    commit(Mutations.ADD_CONTENT, {
      key: 'inProgress',
      content: {
        [createdRef.id]: convertDocIn<InProgress>(await createdRef.get())
      }
    });

    // Get items that have been checked while creating the in progress object
    const tempItems = state.itemsByChecklist.byId[TEMP_IN_PROGRESS_ID];
    // Update local state
    commit(Mutations.ADD_CONTENT, {
      key: 'itemsByChecklist',
      content: {
        [createdRef.id]: tempItems
      }
    });
    // Dispatch mark actions so that the server state will also be updated
    Object.values(tempItems).forEach(
      item =>
        item.done &&
        dispatch(Actions.MARK_ITEM, {
          inProgressId: createdRef.id,
          checklistId,
          itemId: item.id,
          done: item.done
        })
    );
    // Clean up the temp in progress
    commit(Mutations.REMOVE_CONTENT, {
      key: 'inProgress',
      contentId: TEMP_IN_PROGRESS_ID
    });
    commit(Mutations.REMOVE_CONTENT, {
      key: 'itemsByChecklist',
      contentId: TEMP_IN_PROGRESS_ID
    });
    return createdRef.id;
  },

  async [Actions.MARK_ITEM](
    { commit, dispatch, state },
    { checklistId, inProgressId, itemId, done }
  ) {
    // If we haven't yet created the in progress list, start creating and return
    // In progress creation will mark the checked items when completed
    if (!inProgressId) {
      // The temp in progress list contains the info of the list to be created
      // If it doesn't exist, create local temp object and dispatch creation, otherwise just update the local state
      // The temp object will be updated to the server once the object has been created
      if (!state.inProgress.byId[TEMP_IN_PROGRESS_ID]) {
        const checklist = state.checklists.byId[checklistId];
        const checklistItems = state.itemsByChecklist.byId[checklistId];
        commit(Mutations.ADD_CONTENT, {
          key: 'inProgress',
          content: {
            [TEMP_IN_PROGRESS_ID]: { ...checklist, id: TEMP_IN_PROGRESS_ID }
          }
        });
        commit(Mutations.ADD_CONTENT, {
          key: 'itemsByChecklist',
          content: {
            [TEMP_IN_PROGRESS_ID]: {
              ...checklistItems,
              [itemId]: { ...checklistItems[itemId], done }
            }
          }
        });
        return await dispatch(Actions.START_CHECKLIST, checklistId);
      } else {
        const tempItems = state.itemsByChecklist.byId[TEMP_IN_PROGRESS_ID];
        commit(Mutations.ADD_INNER_CONTENT, {
          key: 'itemsByChecklist',
          contentId: TEMP_IN_PROGRESS_ID,
          innerContent: { [itemId]: { ...tempItems[itemId], done } }
        });
      }
      return;
    }

    // We have the id of the in progress list so it has been already created locally and on the server
    const itemRef = firebase
      .firestore()
      .collection('in_progress')
      .doc(inProgressId)
      .collection('items')
      .doc(itemId);
    await itemRef.update({ done });
    commit(Mutations.ADD_INNER_CONTENT, {
      key: 'itemsByChecklist',
      contentId: inProgressId,
      innerContent: { [itemRef.id]: await itemRef.get().then(convertDocIn) }
    });
    return inProgressId;
  }
} as ActionTree<State, CombinedState> & ActionsInterface;
