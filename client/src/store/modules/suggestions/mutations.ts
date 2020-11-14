import { createModuleActions } from '@/store/utils';
import { getContentfulMutations } from '../content/utils';
import { State } from './state';

const contentfulMutations = getContentfulMutations<State>('SUGGESTIONS');

enum MutationTypes {}

const innerMutations = createModuleActions('SUGGESTIONS', MutationTypes);
export const Mutations = { ...contentfulMutations.types, ...innerMutations };

export type Mutations = {} & typeof contentfulMutations.mutations;

export default {
  ...contentfulMutations.mutations
} as Mutations;
