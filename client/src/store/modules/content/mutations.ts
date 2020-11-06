import { createModuleActions } from '@/store/utils';
import { State } from './state';

enum MutationTypes {
  SET_CONTENT = 'SET_CONTENT',
  SET_ERROR = 'SET_ERROR',
  SET_LOADING = 'SET_LOADING',
  ADD_CONTENT = 'ADD_CONTENT',
  ADD_INNER_CONTENT = 'ADD_INNER_CONTENT',
  REMOVE_CONTENT = 'REMOVE_CONTENT'
}

export const Mutations = createModuleActions('CONTENT', MutationTypes);

type StateWithInnerContent = Pick<State, 'itemsByChecklist'>;
type ContentIds = keyof StateWithInnerContent[keyof StateWithInnerContent]['byId'];
type InnerContent<
  T extends keyof StateWithInnerContent
> = StateWithInnerContent[T]['byId'][ContentIds];

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
  [Mutations.ADD_INNER_CONTENT]<T extends keyof StateWithInnerContent>(
    state: State,
    payload: {
      key: T;
      contentId: string;
      innerContent: InnerContent<T>;
    }
  ): void;
  [Mutations.REMOVE_CONTENT]<T extends keyof State>(
    state: State,
    payload: { key: T; contentId: string }
  ): void;
};

export default {
  [Mutations.SET_LOADING]: (state, key) => {
    state[key].status = 'loading';
    state[key].numOfLoading++;
  },
  [Mutations.SET_ERROR]: (state, payload) => {
    state[payload.key] = {
      ...state[payload.key],
      status: 'error',
      error: payload.error
    };
  },
  [Mutations.SET_CONTENT]: (state, { key, content }) => {
    const { status, numOfLoading } = state[key];
    state[key] = {
      ...state[key], // needed for typing
      byId: content,
      numOfLoading: Math.max(0, numOfLoading - 1),
      status: numOfLoading <= 1 ? 'done' : status,
      error: undefined
    };
  },
  [Mutations.ADD_CONTENT]: (state, { key, content }) => {
    const { status, numOfLoading } = state[key];
    state[key] = {
      ...state[key], // needed for typing
      numOfLoading: Math.max(0, numOfLoading - 1),
      status: numOfLoading <= 1 ? 'done' : status,
      byId: { ...state[key].byId, ...content }
    };
  },
  [Mutations.ADD_INNER_CONTENT]: (state, { key, contentId, innerContent }) => {
    state[key] = {
      ...state[key],
      byId: {
        ...state[key].byId,
        [contentId]: {
          ...state[key].byId[contentId],
          ...innerContent
        }
      }
    };
  },
  [Mutations.REMOVE_CONTENT]: (state, { key, contentId }) => {
    state[key] = {
      ...state[key],
      byId: { ...state[key].byId, [contentId]: undefined }
    };
  }
} as Mutations;
