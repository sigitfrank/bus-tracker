import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { env } from './env'

const firebaseConfig = {
    apiKey: env.firebaseApiKey,
    authDomain: env.firebaseAuthDomain,
    projectId: env.firebaseProjectId,
    storageBucket: env.firebaseStorageBucket,
    messagingSenderId: env.firebaseMessagingSenderId,
    appId: env.firebaseAppId,
    measurementId: env.firebaseMeasurementId,
}

const app = initializeApp(firebaseConfig)
export const firebaseDB = getFirestore(app)