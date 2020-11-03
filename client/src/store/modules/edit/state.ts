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
  editItemsById: { [id: string]: EditItem };
}

export default {
  title: "",
  category: "",
  description: "",
  private: false,
  editItemsById: {}
} as State;
