import React, { useEffect, useState } from 'react';
import { getStatusOneData } from '../lib/firebase/apis/firestore';
import Card from '../components/Card'; // Card コンポーネントのインポート

const ReadPage = () => {
    const [readTasks, setReadTasks] = useState<{ id: string; title: string; description: string; status: string; }[]>([]);

    useEffect(() => {
        const fetchReadTasks = async () => {
            try {
                const data = await getStatusOneData();
                // Firestore から取得したデータを適切な形式に整形してセットする
                const formattedData = data.map((task: any) => ({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    status: task.status
                }));
                setReadTasks(formattedData);
            } catch (error) {
                console.error('データの取得に失敗しました:', error);
            }
        };

        fetchReadTasks();

        // cleanup function to unsubscribe from Firestore
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
                    {readTasks.length > 0 &&
                        readTasks.map((task) => (
                            <li key={task.id}>
                                {/* Card コンポーネントに必要なプロパティを渡す */}
                                <Card id={task.id} title={task.title} description={task.description} status={task.status} />
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default ReadPage;
