import { initializeApp } from 'firebase/app';
import { firebaseConfig as envConfig } from './appConfig';

const firebaseConfig = {
  apiKey: envConfig.apiKey,
  authDomain: envConfig.authDomain,
  projectId: envConfig.projectId,
  storageBucket: envConfig.storageBucket,
  messagingSenderId: envConfig.messagingSenderId,
  appId: envConfig.appId,
};

const app = initializeApp(firebaseConfig);
export default app;
