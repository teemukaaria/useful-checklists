import { createModuleActions } from '@/store/utils';
import { State } from './state';

enum MutationTypes {
  SET_CONTENT = 'SET_CONTENT',
  SET_ERROR = 'SET_ERROR',
  SET_LOADING = 'SET_LOADING',
  ADD_CONTENT = 'ADD_CONTENT'
}

export const Mutations = createModuleActions('CONTENT', MutationTypes);

export type Mutations = {
  [Mutations.SET_LOADING](state: State, key: keyof State): void;
  [Mutations.SET_ERROR]<T extends keyof State>(
    state: State,
    payload: { key: T; error?: string }
  ): void;
  [Mutations.SET_CONTENT]<T extends keyof State>(
    state: State,
    payload: { key: T; content: State[T]['byId'] }
  ): void;
  [Mutations.ADD_CONTENT]<T extends keyof State>(
    state: State,
    payload: { key: T; content: State[T]['byId'] }
  ): void;
};

export default {
  [Mutations.SET_LOADING]: (state, key) => {
    state[key].status = 'loading';
  },
  [Mutations.SET_ERROR]: (state, payload) => {
    state[payload.key] = {
      ...state[payload.key],
      status: 'error',
      error: payload.error
    };
  },
  [Mutations.SET_CONTENT]: (state, { key, content }) => {
    state[key] = {
      ...state[key], // needed for typing
      byId: content,
      status: 'done',
      error: undefined
    };
  },
  [Mutations.ADD_CONTENT]: (state, { key, content }) => {
    state[key] = {
      ...state[key], // needed for typing
      byId: { ...state[key].byId, ...content }
    };
  }
} as Mutations;
