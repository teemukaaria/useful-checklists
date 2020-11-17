import { createModuleActions } from '@/store/utils';
import { ByIdMap, Checklist, Content } from './state';

export const convertChecklistToInProgress = (
  { name, id, category, item_count }: Checklist,
  userId: string
) => ({
  name,
  checklist: id,
  category,
  item_count,
  user: userId
});

export const getContentfulMutations = <S>(base: string) => {
  enum MutationTypes {
    SET_CONTENT = 'SET_CONTENT',
    SET_ERROR = 'SET_ERROR',
    SET_LOADING = 'SET_LOADING',
    ADD_CONTENT = 'ADD_CONTENT',
    ADD_INNER_CONTENT = 'ADD_INNER_CONTENT',
    REMOVE_CONTENT = 'REMOVE_CONTENT',
    RESET = 'RESET'
  }

  const Mutations = createModuleActions(base, MutationTypes);

  type State = {
    [K in keyof S]: S[K] extends Content<infer R> ? S[K] : never;
  };
  type StateKeyWithInnerContent = {
    [K in keyof State]: State[K]['byId'] extends ByIdMap<ByIdMap<infer R>>
      ? K
      : never;
  }[keyof State];
  type InnerContent<
    T extends StateKeyWithInnerContent
  > = State[T]['byId'] extends ByIdMap<infer R> ? R : never;

  type IMutations = {
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
    [Mutations.ADD_INNER_CONTENT]<T extends StateKeyWithInnerContent>(
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
    [Mutations.RESET](state: State, key: keyof State): void;
  };

  const mutations = {
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
    [Mutations.ADD_INNER_CONTENT]: (
      state,
      { key, contentId, innerContent }
    ) => {
      state[key] = {
        ...state[key],
        byId: {
          ...state[key].byId,
          [contentId]: {
            ...(state[key].byId[contentId] as ByIdMap<any>),
            ...(innerContent as ByIdMap<any>)
          }
        }
      };
    },
    [Mutations.REMOVE_CONTENT]: (state, { key, contentId }) => {
      state[key] = {
        ...state[key],
        byId: { ...state[key].byId, [contentId]: undefined }
      };
    },
    [Mutations.RESET]: (state, key) => {
      state[key] = { byId: {}, numOfLoading: 0 } as any
    }
  } as IMutations;

  return {
    mutations,
    types: Mutations
  };
};
