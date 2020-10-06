export interface User {
  id: string;
}

export interface State {
  user: User | undefined | null;
}

export default {
  user: undefined
} as State;
