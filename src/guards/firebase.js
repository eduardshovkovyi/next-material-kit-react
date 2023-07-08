import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "src/utils/variables/s-variables";

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
