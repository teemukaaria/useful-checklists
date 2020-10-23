export const createModuleActions = <T>(base: string, actions: T) =>
  Object.values(actions).reduce(
    (a, c) => ({ ...a, [c]: `${base}/${c}` }),
    {}
  ) as T;

export const convertDocIn = <T = any>(
  doc: firebase.firestore.DocumentSnapshot
) => {
  return ({ ...doc.data(), id: doc.id } as unknown) as T;
};

export const convertListToByIdMap = <T extends { id: string }>(list: T[]) => {
  return list.reduce((a, c) => ({ ...a, [c.id]: c }), {}) as {
    [key: string]: T;
  };
};
