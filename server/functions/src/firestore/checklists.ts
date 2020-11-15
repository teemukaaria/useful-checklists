import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

const updateItemCount = async (
  change: any,
  context: functions.EventContext
) => {
  const { checklistId } = context.params;
  const checklistRef = db.doc(`/checklists/${checklistId}`);
  const itemCount = await checklistRef
    .collection('items')
    .get()
    .then((snap) => snap.size);
  await checklistRef.update({
    item_count: itemCount
  });
};

export const handleItemCreate = functions.firestore
  .document('/checklists/{checklistId}/items/{itemId}')
  .onCreate(updateItemCount);

export const handleItemDelete = functions.firestore
  .document('/checklists/{checklistId}/items/{itemId}')
  .onDelete(updateItemCount);
