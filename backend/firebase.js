import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

// Load the Firebase Admin SDK service account key
const serviceAccount = JSON.parse(
    await readFile(new URL( './firebase.json' , import.meta.url))
);

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export default admin;