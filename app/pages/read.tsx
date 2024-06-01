import React, { useEffect, useState } from 'react';
import { getStatusThreeData, updateTaskStatus } from '../lib/firebase/apis/firestore'; // updateTaskStatus をインポート
import Card from '../components/Card';

const ReadPage: React.FC = () => {
  const [readTasks, setReadTasks] = useState<{ id: string; title: string; description: string; status: number; author: string; url: string }[]>([]);

  useEffect(() => {
    const fetchReadTasks = async () => {
      try {
        const data = await getStatusThreeData(); // ステータスが3のデータを取得
        const formattedData = data.map((task: any) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: Number(task.status),
          author: task.author,
          url: task.url
        }));
        setReadTasks(formattedData);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      }
    };

    fetchReadTasks();

    // クリーンアップ関数
    return () => {};
  }, []);

  const handleCheckboxChange = async (id: string, newStatus: number) => {
    try {
      await updateTaskStatus(id, newStatus);
      setReadTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
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
        <h1 className="text-3xl font-bold">Read Books</h1>
        <ul>
          {readTasks.length > 0 &&
            readTasks.map((task) => (
              <li key={task.id}>
                <Card
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  status={task.status}
                  author={task.author}
                  url={task.url}
                  checked={task.status === 3} // 値を数値型に変換しその結果が数値の3と等しいかどうかを比較
                  onCheckboxChange={(newStatus: number) => handleCheckboxChange(task.id, newStatus)} // 新しいプロパティを追加
                />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default ReadPage;
