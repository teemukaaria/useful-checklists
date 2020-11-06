import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const handleItemCheck = functions.firestore
  .document('/in_progress/{inProgressId}/items/{itemId}')
  .onWrite(async (change, context) => {
    const { inProgressId } = context.params;
    const inProgressRef = db.doc(`/in_progress/${inProgressId}`);
    const itemDoneds = await inProgressRef
      .collection('items')
      .get()
      .then((snap) => snap.docs.map((doc) => doc.data().done as boolean));
    const totalItems = itemDoneds.length;
    const completedItems = itemDoneds.filter(x => x).length;
    await inProgressRef.update({
      completed_count: completedItems,
      completed: totalItems === completedItems
    });
  });
