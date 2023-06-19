import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import { readFileSync } from 'fs';

const firebaseConf = readFileSync('firebase.json').toString()

initializeApp({
  credential: cert(JSON.parse(firebaseConf))
});

const fireStore = getFirestore();

export default fireStore