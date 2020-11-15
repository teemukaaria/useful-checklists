import { ByIdMap, Content } from '../content/state';

export interface Suggestion {
  id: string;
  user: string;
  approver: string;
  count: number;
  checklist: { id: string; name: string; description: string };
  status?: 'rejected' | 'approved';
}

export interface DeleteChange {
  id: string;
  type: 'delete';
  new: undefined;
}
export interface UpdateChange {
  id: string;
  type: 'update';
  new: { name: string; description: string };
}
export interface CreateChange {
  id: string;
  type: 'create';
  new: { name: string; description: string };
}
export type SuggestionChange = DeleteChange | UpdateChange | CreateChange;

export interface State {
  suggestions: Content<Suggestion>;
  changesBySuggestion: Content<ByIdMap<SuggestionChange>>;
}

export default {
  suggestions: { byId: {}, numOfLoading: 0 },
  changesBySuggestion: { byId: {}, numOfLoading: 0 }
} as State;
