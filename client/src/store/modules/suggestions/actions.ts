import { ActionTree, ActionContext, DispatchOptions } from 'vuex';
import firebase from 'firebase';

import {
  convertDocIn,
  convertListToByIdMap,
  createModuleActions
} from '@/store/utils';
import { State, Suggestion, SuggestionChange } from './state';
import { CombinedState, ContentActions } from '@/store';
import { Mutations } from './mutations';
import { Mutations as AppMutations } from '../app/mutations';
import { convertChangeIn } from './utils';

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

enum ActionTypes {
  FETCH_SUGGESTIONS = 'FETCH_SUGGESTIONS',
  FETCH_SUGGESTION = 'FETCH_SUGGESTION',
  REJECT = 'REJECT',
  VALIDATE_ALL = 'VALIDATE_ALL',
  LIKE_CHECKLIST = 'LIKE_CHECKLIST',
  RESET = 'RESET'
}

export const Actions = createModuleActions('SUGGESTIONS', ActionTypes);

export interface ActionsInterface {
  [Actions.FETCH_SUGGESTIONS](
    context: AugmentedActionContext,
    type: 'received' | 'send'
  ): void;
  [Actions.FETCH_SUGGESTION](context: AugmentedActionContext, id: string): void;
  [Actions.REJECT](context: AugmentedActionContext, id: string): void;
  [Actions.VALIDATE_ALL](context: AugmentedActionContext, id: string): void;
  [Actions.LIKE_CHECKLIST](
    context: AugmentedActionContext,
    payload: { checklistId: string; like: boolean }
  ): void;
  [Actions.RESET](context: AugmentedActionContext): void;
}

export default {
  async [Actions.FETCH_SUGGESTIONS]({ commit, rootState }, type) {
    commit(Mutations.SET_LOADING, 'suggestions');

    const user = rootState.app.user;
    if (!user) return;
    const suggestions: Suggestion[] = await firebase
      .firestore()
      .collection('suggestions')
      .where(type === 'received' ? 'approver' : 'user', '==', user.id)
      .get()
      .then(snap => snap.docs.map(convertDocIn));

    commit(Mutations.ADD_CONTENT, {
      key: 'suggestions',
      content: convertListToByIdMap(suggestions)
    });
  },

  async [Actions.FETCH_SUGGESTION]({ commit }, id) {
    commit(Mutations.SET_LOADING, 'suggestions');
    commit(Mutations.SET_LOADING, 'changesBySuggestion');

    const suggestionRef = firebase
      .firestore()
      .collection('suggestions')
      .doc(id);
    const suggestion: Suggestion = await suggestionRef.get().then(convertDocIn);
    const changes: SuggestionChange[] = await suggestionRef
      .collection('changes')
      .get()
      .then(snap => snap.docs.map(doc => convertChangeIn(convertDocIn(doc))));

    commit(Mutations.ADD_CONTENT, {
      key: 'suggestions',
      content: { [suggestion.id]: suggestion }
    });
    commit(Mutations.ADD_CONTENT, {
      key: 'changesBySuggestion',
      content: { [suggestion.id]: convertListToByIdMap(changes) }
    });
  },

  async [Actions.REJECT]({ commit, state }, id) {
    commit(Mutations.ADD_CONTENT, {
      key: 'suggestions',
      content: { [id]: { ...state.suggestions.byId[id], status: 'rejected' } }
    });
    await firebase
      .firestore()
      .collection('suggestions')
      .doc(id)
      .update({ status: 'rejected' });
  },

  async [Actions.VALIDATE_ALL]({ commit, dispatch, state }, id) {
    const suggestion = state.suggestions.byId[id];
    const changes = Object.values(state.changesBySuggestion.byId[id]);
    const db = firebase.firestore();

    // Mark suggestion approved
    commit(Mutations.ADD_CONTENT, {
      key: 'suggestions',
      content: { [id]: { ...state.suggestions.byId[id], status: 'approved' } }
    });
    await db
      .collection('suggestions')
      .doc(id)
      .update({ status: 'approved' });

    // Make changes to the checklist
    const checklistRef = db.doc(`checklists/${suggestion.checklist.id}`);
    checklistRef.update({
      collaborators: firebase.firestore.FieldValue.arrayUnion(suggestion.user)
    });
    const batch = db.batch();
    changes.forEach(change => {
      if (change.id === suggestion.checklist.id)
        change.type === 'update' && batch.update(checklistRef, change.new);
      else {
        const itemRef = checklistRef.collection('items').doc(change.id);
        if (change.type === 'delete') batch.delete(itemRef);
        if (change.type === 'create')
          batch.set(checklistRef.collection('items').doc(), change.new);
        if (change.type === 'update') batch.update(itemRef, change.new);
      }
    });
    await batch.commit();
    (dispatch as any)(ContentActions.FETCH_CHECKLIST, {
      checklistId: suggestion.checklist.id
    });
  },

  [Actions.LIKE_CHECKLIST]: async (
    { commit, rootState, dispatch },
    { checklistId, like }
  ) => {
    const user = rootState.app.user;
    const checklist = rootState.content.checklists.byId[checklistId];
    if (!user || !checklist) return;

    const db = firebase.firestore();
    (commit as any)(AppMutations.LIKE_CHECKLIST, { checklistId, like });
    db.collection('users')
      .doc(user.id)
      .update({
        liked: like
          ? firebase.firestore.FieldValue.arrayUnion(checklistId)
          : firebase.firestore.FieldValue.arrayRemove(checklistId)
      });

    await firebase.functions().httpsCallable('likeChecklist')({
      checklistId,
      like
    });

    (dispatch as any)(ContentActions.FETCH_CHECKLIST, {
      checklistId: checklistId
    });
  },
  async [Actions.RESET]({ commit }) {
    commit(Mutations.RESET, 'suggestions');
    commit(Mutations.RESET, 'changesBySuggestion');
  }
} as ActionTree<State, CombinedState> & ActionsInterface;
