export type ByIdMap<T> = {
  [id: string]: T;
};

export type Content<T> = {
  status?: 'loading' | 'done' | 'error';
  numOfLoading: number;
  error?: string;
  byId: ByIdMap<T>;
};

export interface Category {
  id: string;
  name: string;
  color: string;
  description?: string;
  list_count: number;
  highlights: string[];
}

export interface ChecklistItem {
  id: string;
  name: string;
  description: string;
  order: number;
  done?: boolean;
}

export interface Checklist {
  id: string;
  category: string;
  collaborators: string[];
  description: string;
  item_count: number;
  likes: number;
  name: string;
  original: string;
  owner: string;
  private: boolean;
}

export interface InProgress {
  id: string;
  user: string;
  checklist: string;
  name: string;
  category: string;
  description: string;
  item_count: number;
  completed_count: number;
}

export interface State {
  categories: Content<Category>;
  inProgress: Content<InProgress>;
  checklists: Content<Checklist>;
  checklistsByCategory: Content<string[]>;
  itemsByChecklist: Content<ByIdMap<ChecklistItem>>;
  checklistsForCurrentUser: Content<Checklist>;
}

export default {
  categories: { byId: {}, numOfLoading: 0 },
  inProgress: { byId: {}, numOfLoading: 0 },
  checklists: { byId: {}, numOfLoading: 0 },
  checklistsByCategory: { byId: {}, numOfLoading: 0 },
  itemsByChecklist: { byId: {}, numOfLoading: 0 },
  checklistsForCurrentUser: { byId: {}, numOfLoading: 0 }
} as State;
