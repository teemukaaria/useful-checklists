export interface User {
  id: string;
  name: string;
  registered: Date;
  image?: string;
  username?: string;
  liked?: string[];
}

export interface State {
  user: User | undefined | null;
}

export default {
  user: undefined
} as State;
