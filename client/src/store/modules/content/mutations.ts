import { createModuleActions } from '@/store/utils';
import { getContentfulMutations } from './utils';
import { State } from './state';

const contentfulMutations = getContentfulMutations<State>('CONTENT');

enum MutationTypes {}

const innerMutations = createModuleActions('CONTENT', MutationTypes);
export const Mutations = { ...contentfulMutations.types, ...innerMutations };

export type Mutations = {} & typeof contentfulMutations.mutations;

export default {
  ...contentfulMutations.mutations
} as Mutations;
