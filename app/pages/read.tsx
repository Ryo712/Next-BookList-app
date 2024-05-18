import React, { useEffect, useState } from 'react';
import { getStatusThreeData } from '../lib/firebase/apis/firestore'; // getStatusThreeData をインポート
import Card from '../components/Card';

const ReadPage: React.FC = () => {
  const [readTasks, setReadTasks] = useState<{ id: string; title: string; description: string; status: number; author: string; url: string  }[]>([]);

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
                  checked={Number(task.status) === 3} //値を数値型に変換しその結果が数値の3と等しいかどうかを比較
                />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default ReadPage;
