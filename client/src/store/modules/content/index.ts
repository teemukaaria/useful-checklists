import { Module } from 'vuex';
import state, { State } from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';
import { CombinedState } from '@/store';

export { State } from './state';

export default {
  state,
  mutations,
  actions,
  getters
} as Module<State, CombinedState>;
