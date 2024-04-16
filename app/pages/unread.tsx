import { useEffect, useState } from 'react';
import { getStatusOneData } from '../lib/firebase/apis/firestore'; // firestore.tsのパスを正しく指定

const UnreadPage = () => {
  const [unreadTasks, setUnreadTasks] = useState<{ id: string; title: string; }[]>([]); // 初期値の型を修正

  useEffect(() => {
    const fetchUnreadTasks = async () => {
      try {
        const data = await getStatusOneData(); // getStatusOneData関数を使って未読タスクを取得
        setUnreadTasks(data);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      }
    };

    fetchUnreadTasks();

    // cleanup function to unsubscribe from Firestore
    return () => {};
  }, []);

  return (
    <div className="flex">
    <div className="w-1/4"> {/* サイドバー */}
      {/* サイドバーの内容をここに追加 */}
    </div>
    <div className="w-3/4"> {/* データ表示部分 */}
      <h1>Unread Books</h1>
      <ul>
        {unreadTasks.length > 0 && // unreadTasksが空でないことを確認
          unreadTasks.map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
      </ul>
    </div>
  </div>
);
};

export default UnreadPage;
