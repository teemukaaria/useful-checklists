import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const likeChecklist = functions.https.onCall(async (data, context) => {
  const { checklistId, like } = data;
  if (!checklistId || like === undefined) return;
  await db
    .collection('checklists')
    .doc(checklistId)
    .update({
      likes: admin.firestore.FieldValue.increment(like ? 1 : -1)
    });
});
