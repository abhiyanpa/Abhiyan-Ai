
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy, 
  Timestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import { Chat, Message } from "../types";

const USERS_COLLECTION = "users";
const CHATS_SUBCOLLECTION = "chats";

export const saveChat = async (userId: string, chat: Chat) => {
  const chatRef = doc(db, USERS_COLLECTION, userId, CHATS_SUBCOLLECTION, chat.id);
  await setDoc(chatRef, {
    ...chat,
    updatedAt: Timestamp.now()
  }, { merge: true });
};

export const updateChatMessages = async (userId: string, chatId: string, messages: Message[]) => {
  const chatRef = doc(db, USERS_COLLECTION, userId, CHATS_SUBCOLLECTION, chatId);
  // Using setDoc with merge: true is more robust than updateDoc as it won't fail if the document is missing.
  await setDoc(chatRef, {
    messages,
    updatedAt: Timestamp.now()
  }, { merge: true });
};

export const updateChatTitle = async (userId: string, chatId: string, title: string) => {
  const chatRef = doc(db, USERS_COLLECTION, userId, CHATS_SUBCOLLECTION, chatId);
  await setDoc(chatRef, {
    title,
    updatedAt: Timestamp.now()
  }, { merge: true });
};

export const deleteChatFromDb = async (userId: string, chatId: string) => {
  const chatRef = doc(db, USERS_COLLECTION, userId, CHATS_SUBCOLLECTION, chatId);
  await deleteDoc(chatRef);
};

export const fetchUserChats = async (userId: string): Promise<Chat[]> => {
  const chatsRef = collection(db, USERS_COLLECTION, userId, CHATS_SUBCOLLECTION);
  const q = query(chatsRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => doc.data() as Chat);
};
