import { db } from "@/firebase";
import {
  addDoc,
  deleteDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  setDoc,
} from "firebase/firestore";

export const addExpense = async ({
  uid,
  location_name,
  location_address,
  items,
  amount,
  time,
}) => {
  return await addDoc(collection(db, "expenses"), {
    uid,
    location_name,
    location_address,
    items,
    amount,
    time,
  });
};

export const getExpense = async (uid) => {
  const col = query(collection(db, "expenses"), where("uid", "==", uid));
  const querySnapShot = await getDocs(col);
  return querySnapShot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
};

export const updateExpense = async ({
  id,
  uid,
  location_name,
  location_address,
  items,
  amount,
  time,
}) => {
  return setDoc(doc(db, "expenses", id), {
    uid,
    location_name,
    location_address,
    items,
    amount,
    time,
  });
};

export const deleteExpense = async (id) => {
  return deleteDoc(doc(db, "expenses", id));
};
