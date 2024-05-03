import React, { useEffect, useState } from 'react';
import { getStatusOneData } from '../lib/firebase/apis/firestore'; // getStatusOneData をインポート
import Card from '../components/Card';

const UnreadPage: React.FC = () => {
  const [unreadTasks, setUnreadTasks] = useState<{ id: string; title: string; description: string; status: string }[]>([]);

  useEffect(() => {
    const fetchUnreadTasks = async () => {
      try {
        const data = await getStatusOneData(); // ステータスが1のデータを取得
        const formattedData = data.map((task: any) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status
        }));
        setUnreadTasks(formattedData);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      }
    };

    fetchUnreadTasks();

    // クリーンアップ関数
    return () => {};
  }, []);

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
                <Card id={task.id} title={task.title} description={task.description} status={task.status} />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default UnreadPage;
