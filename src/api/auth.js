import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

export const signUpWithEmailPassWord = async ({
  auth,
  email,
  password,
  name,
  first_name,
  last_name,
}) => {
  await createUserWithEmailAndPassword(auth, email, password);
  return await updateProfile(auth.currentUser, {
    displayName: name,
    first_name: first_name,
    last_name: last_name,
  });
};

export const loginWithEmailPassword = async ({ auth, email, password }) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return await signOut(auth);
};
