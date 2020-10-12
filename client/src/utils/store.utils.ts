import { User } from '@/store/modules/app/state';

export const convertUserIn = (user: firebase.User) => {
  const {
    displayName,
    email,
    uid,
    metadata: { creationTime }
  } = user;
  return {
    id: uid,
    name: displayName || email,
    registered: creationTime && new Date(creationTime)
  } as User;
};
