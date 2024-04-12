import { collection, query, where, getDocs } from 'firebase/firestore';
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
      ...doc.data()
    }));
    
    return data;
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};
