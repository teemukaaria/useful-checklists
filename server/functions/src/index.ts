import * as admin from 'firebase-admin';

admin.initializeApp();

export * from './firestore/inProgress';
export * from './firestore/checklists';
export * from './firestore/categories';
export * from './actions/checklists';


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
