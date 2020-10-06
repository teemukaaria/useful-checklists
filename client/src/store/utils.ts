export const createModuleActions = <T>(base: string, actions: T) =>
  Object.values(actions).reduce(
    (a, c) => ({ ...a, [c]: `${base}/${c}` }),
    {}
  ) as T;
