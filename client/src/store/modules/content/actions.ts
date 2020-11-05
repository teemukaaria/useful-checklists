import { ActionTree, ActionContext } from 'vuex';
import firebase from 'firebase';

import {
  convertDocIn,
  convertListToByIdMap,
  createModuleActions
} from '@/store/utils';
import { State, Category, InProgress, Checklist, ChecklistItem } from './state';
import { CombinedState } from '@/store';
import { Mutations } from './mutations';

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, CombinedState>, 'commit'>;

enum ActionTypes {
  FETCH_CATEGORIES = 'FETCH_CATEGORIES',
  FETCH_IN_PROGRESS = 'FETCH_IN_PROGRESS',
  FETCH_CATEGORY_BY_ID = 'FETCH_CATEGORY_BY_ID',
  FETCH_CHECKLISTS_FOR_CATEGORY = 'FETCH_CHECKLISTS_FOR_CATEGORY',
  FETCH_CHECKLIST = 'FETCH_CHECKLIST'
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
    checklistId: string
  ): void;
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
      const isPublic = checklistsRef.where('category', '==', category).where('private', '==', false).get();
      const isUser = checklistsRef.where('category', '==', category).where('owner', '==', user?.uid || "").get();

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

  async [Actions.FETCH_CHECKLIST]({ commit }, checklistId: string) {
    commit(Mutations.SET_LOADING, 'checklists');

    const user = firebase.auth().currentUser;
    const checklistsRef = firebase.firestore().collection('checklists');

    async function getLists() {
      const publicChecklist = checklistsRef.where(firebase.firestore.FieldPath.documentId(), '==', checklistId).where('private', '==', false).get();
      const userChecklist = checklistsRef.where(firebase.firestore.FieldPath.documentId(), '==', checklistId).where('owner', '==', user?.uid || "").get();
      
      const [publicChecklists, userChecklists] = await Promise.all([
        publicChecklist,
        userChecklist
      ]);
      
      const publicChecklistsArray = publicChecklists.docs;
      const userChecklistsArray = userChecklists.docs;
  
      return publicChecklistsArray.concat(userChecklistsArray);
    }
    
    const lists = await getLists();
    const list = lists && lists[0];
    const checklist: Checklist = convertDocIn(list);
    const checklistRef = list?.ref;

    const checklistItems: ChecklistItem[] | undefined = checklistRef && await checklistRef
      .collection('items')
      .orderBy('order')
      .get()
      .then(snap => snap.docs.map(convertDocIn));
    checklist.items = checklistItems;
    commit(Mutations.ADD_CONTENT, {
      key: 'checklists',
      content: { [checklist.id]: checklist }
    });
  }
} as ActionTree<State, CombinedState> & ActionsInterface;
