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
  privat: boolean;
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
  categoriesById: { [id: string]: Category };
  inProgressById: { [id: string]: InProgress };
  currentCategory: Category;
  checklistsById: { [id: string]: Checklist };
}

export default {
  categoriesById: {},
  inProgressById: {},
  currentCategory: {},
  checklistsById: {}
} as State;
