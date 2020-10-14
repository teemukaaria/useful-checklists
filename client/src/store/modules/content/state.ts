export type Content<T> = {
  status?: 'loading' | 'done' | 'error';
  error?: string;
  byId: { [id: string]: T };
};

export interface Category {
  id: string;
  name: string;
  color: string;
  description?: string;
  list_count: number;
  highlights: string[];
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
  // currentCategory: Category;
  checklists: Content<Checklist>;
}

export default {
  categories: { byId: {} },
  inProgress: { byId: {} },
  // currentCategory: {},
  checklists: { byId: {} }
} as State;
