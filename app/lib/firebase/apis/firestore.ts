import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

// statusが1のデータを取得する関数
export const getStatusOneData = async () => {
  try {
    // 'tasks'コレクション内のデータをクエリする
    const q = query(collection(db, 'tasks'), where('status', '==', 1));
    const querySnapshot = await getDocs(q);

    // クエリ結果を配列に変換して返す
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      description: doc.data().description,
      status: doc.data().status,
      author: doc.data().author,
      coverImage: doc.data().coverImage, // 画像URLを追加
    }));

    return data;
  } catch (error) {
    console.error('Error getting documents: ', error);
    throw error;
  }
};

// statusが2のデータを取得する関数
export const getStatusTwoData = async () => {
  try {
    // 'tasks'コレクション内のデータをクエリする
    const q = query(collection(db, 'tasks'), where('status', '==', 2));
    const querySnapshot = await getDocs(q);

    // クエリ結果を配列に変換して返す
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      description: doc.data().description,
      status: doc.data().status,
      author: doc.data().author,
      coverImage: doc.data().coverImage, // 画像URLを追加
    }));

    return data;
  } catch (error) {
    console.error('Error getting documents: ', error);
    throw error;
  }
};

// statusが3のデータを取得する関数
export const getStatusThreeData = async () => {
  try {
    // 'tasks'コレクション内のデータをクエリする
    const q = query(collection(db, 'tasks'), where('status', '==', 3));
    const querySnapshot = await getDocs(q);

    // クエリ結果を配列に変換して返す
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      description: doc.data().description,
      status: doc.data().status,
      author: doc.data().author,
      coverImage: doc.data().coverImage, // 画像URLを追加
    }));

    return data;
  } catch (error) {
    console.error('Error getting documents: ', error);
    throw error;
  }
};

// タスクのステータスを更新する関数を追加
export const updateTaskStatus = async (id: string, newStatus: number) => {
  try {
    const taskRef = doc(db, 'tasks', id);
    await updateDoc(taskRef, { status: newStatus });
  } catch (error) {
    console.error('ステータスの更新に失敗しました:', error);
    throw error;
  }
};

// tasksコレクションからデータを取得する関数を追加
export const getTasks = async () => {
  try {
    const tasksCollection = collection(db, 'tasks');
    const tasksSnapshot = await getDocs(tasksCollection);
    const tasksList = tasksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return tasksList;
  } catch (error) {
    console.error('Error getting tasks: ', error);
    throw error;
  }
};
