import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig'; // FirebaseのFirestoreの初期化済みインスタンスをインポート

// statusが1のデータを取得する関数
export const getStatusOneData = async () => {
  try {
    // 'tasks'コレクション内のデータをクエリする
    const q = query(collection(db, 'tasks'), where('status', '==', 1));
    const querySnapshot = await getDocs(q);

    // クエリ結果を配列に変換して返す
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
      description: doc.data().description, // descriptionを追加
      status: doc.data().status // statusを追加
    }));
    
    return data;
  } catch (error) {
    console.error("Error getting documents: ", error);
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
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
      description: doc.data().description,
      status: doc.data().status,
    }));
    
    return data;
  } catch (error) {
    console.error("Error getting documents: ", error);
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
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
      description: doc.data().description,
      status: doc.data().status,
    }));
    
    return data;
  } catch (error) {
    console.error("Error getting documents: ", error);
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
