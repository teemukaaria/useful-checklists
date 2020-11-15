import { SuggestionChange } from './state';

export const convertChangeIn = (change: SuggestionChange) =>
  change.type !== 'create' ? change : { ...change, id: `create_${change.id}` };
