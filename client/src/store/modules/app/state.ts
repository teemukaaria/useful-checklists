export interface User {
  id: string;
  name: string;
  registered: Date;
}

export interface State {
  user: User | undefined | null;
}

export default {
  user: undefined
} as State;
