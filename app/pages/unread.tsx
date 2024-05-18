// unread.tsx
import React, { useEffect, useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { getStatusOneData } from '../lib/firebase/apis/firestore';
import { db } from '../firebaseConfig';
import Card from '../components/Card';

const UnreadPage: React.FC = () => {
  const [unreadTasks, setUnreadTasks] = useState<{ id: string; title: string; description: string; status: number; author: string; url: string }[]>([]);

  const fetchUnreadTasks = async () => {
    try {
      const data = await getStatusOneData(); // ステータスが1のデータを取得
      const formattedData = data.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: Number(task.status), // statusを数値型に変換
        author: task.author,  
        url: task.url         
      }));
      setUnreadTasks(formattedData);
    } catch (error) {
      console.error('データの取得に失敗しました:', error);
    }
  };

  useEffect(() => {
    fetchUnreadTasks();
  }, []);

  // ステータスを更新する関数
  const handleCheckboxChange = async (taskId: string) => {
    try {
      // Firestore のドキュメントを更新
      const taskDocRef = doc(db, 'tasks', taskId);
      await updateDoc(taskDocRef, { status: 3 }); // ステータスを3に変更
      fetchUnreadTasks(); // データを再取得
    } catch (error) {
      console.error('ステータスの更新に失敗しました:', error);
    }
  };

  return (
    <div className="flex">
      <div className="w-1/4">
        {/* サイドバーの内容をここに追加 */}
      </div>
      <div className="w-3/4">
        <h1 className="text-3xl font-bold">Unread Books</h1>
        <ul>
          {unreadTasks.length > 0 &&
            unreadTasks.map((task) => (
              <li key={task.id}>
                {/* Card コンポーネントに必要なプロパティを渡す */}
                <Card
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    status={task.status}
                    author={task.author}  // author プロパティを渡す
                    url={task.url}        // url プロパティを渡す
                    onCheckboxChange={() => handleCheckboxChange(task.id)} // チェックボックスの状態変更を検知する関数を渡す
                />

              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default UnreadPage;
