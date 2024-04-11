import React, { useState, useEffect } from 'react';
import { db } from '../../app/firebaseConfig'; // firebaseConfig.ts から db をインポート

interface Task {
  id: string;
  title: string;
  description: string;
  status: number;
}

const UnreadPage = () => {
  const [unreadData, setUnreadData] = useState<Task[]>([]); // 未読データの状態を管理するステート

  useEffect(() => {
    const fetchUnreadData = async () => {
      try {
        // Firestore データベースから status: 1 のデータを取得
        const querySnapshot = await db.collection('tasks').where('status', '==', 1).get();
        const unreadData: Task[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const task: Task = {
            id: doc.id,
            title: data.title,
            description: data.description,
            status: data.status
          };
          unreadData.push(task);
        });
        setUnreadData(unreadData);
      } catch (error) {
        console.error('Error fetching unread data:', error);
      }
    };

    fetchUnreadData(); // fetchUnreadData 関数を実行して未読データを取得
  }, []); // マウント時の一度だけデータを取得するため、空の配列を依存リストに指定

  return (
    <div>
      <h1>Unread Page</h1>
      {/* 取得した未読データをマップして表示 */}
      {unreadData.map((item) => (
        <div key={item.id}>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default UnreadPage;
