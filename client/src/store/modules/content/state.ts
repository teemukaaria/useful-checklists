export interface Category {
  id: string;
  name: string;
  color: string;
  description?: string;
  list_count: number;
  highlights: string[];
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
}

export default {
  categoriesById: {},
  inProgressById: {}
} as State;
