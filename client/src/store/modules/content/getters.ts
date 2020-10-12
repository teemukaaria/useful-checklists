import { GetterTree } from 'vuex';
import { CombinedState } from '@/store';
import { State } from './state';

export type Getters = {};

export default {} as GetterTree<State, CombinedState> & Getters;
