// app/pages/unread.tsx

import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { db } from '../firebaseConfig'; // firebaseConfig.tsのパスを正しく指定してください
import { collection, query, where, getDocs } from 'firebase/firestore'; // 追加

const UnreadPage = () => {
  const [unreadTasks, setUnreadTasks] = useState<{ id: string; title: string }[]>([]);


  useEffect(() => {
    // Firestoreからstatusが1のデータを取得する
    const fetchUnreadTasks = async () => {
      try {
        const q = query(collection(db, 'tasks'), where('status', '==', 1)); // クエリを作成
        const querySnapshot = await getDocs(q); // クエリを実行
        const unreadTasksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
        }));
        setUnreadTasks(unreadTasksData);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      }
    };

    fetchUnreadTasks();

    // cleanup function to unsubscribe from Firestore
    return () => {};
  }, []);

  return (
    <div>
      <h1>未読タスク</h1>
      <ul>
        {unreadTasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default UnreadPage;
