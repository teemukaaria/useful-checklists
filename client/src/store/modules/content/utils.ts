import { Checklist } from './state';

export const convertChecklistToInProgress = (
  { name, id, category, item_count }: Checklist,
  userId: string
) => ({
  name,
  checklist: id,
  category,
  item_count,
  user: userId
});
