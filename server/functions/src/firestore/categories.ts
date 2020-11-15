import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const handleChecklistCreate = functions.firestore
  .document('/checklists/{checklistId}')
  .onCreate(async (change, context) => {
    const { category } = change.data();
    if (!category) return;
    const categoryRef = db.doc(`/categories/${category}`);
    const lists = await db
      .collection('checklists')
      .where('category', '==', category)
      .get()
      .then((snap) => snap.docs.map((doc) => doc.data().private as boolean));
    const publicCount = lists.filter((x) => !x).length;
    await categoryRef.update({
      list_count: publicCount
    });
  });
