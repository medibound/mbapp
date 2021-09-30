import admin from 'firebase-admin';
import serviceAccount from '../medibound-87c8a-firebase-adminsdk-gql11-520ff159b3.json';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://medibound-87c8a-default-rtdb.firebaseio.com"
    });
  } catch (error) {
    console.log('Firebase admin initialization error', error.stack);
  }
}
export default admin.firestore();

export const firestore = admin.firestore;