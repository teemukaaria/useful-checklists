export interface EditItem {
  id: string;
  name?: string;
  description?: string;
  order: number;
}

export interface State {
  title: string;
  category: string;
  description: string;
  private: boolean;
  original?: string;
  editItemsById: { [id: string]: EditItem };
}

export default {
  title: "",
  category: "",
  description: "",
  private: false,
  original: undefined,
  editItemsById: {}
} as State;
