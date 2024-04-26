import React, { useEffect, useState } from 'react';
import { getStatusTwoData } from '../lib/firebase/apis/firestore';
import Card from '../components/Card'; // Card コンポーネントのインポート

const ReadingPage = () => {
    const [readingTasks, setReadingTasks] = useState<{ id: string; title: string; description: string; status: string; }[]>([]);

    useEffect(() => {
        const fetchReadingTasks = async () => {
            try {
                const data = await getStatusTwoData();
                // Firestore から取得したデータを適切な形式に整形してセットする
                const formattedData = data.map((task: any) => ({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    status: task.status
                }));
                setReadingTasks(formattedData);
            } catch (error) {
                console.error('データの取得に失敗しました:', error);
            }
        };

        fetchReadingTasks();

        // cleanup function to unsubscribe from Firestore
        return () => {};
    }, []);

    return (
        <div className="flex">
            <div className="w-1/4">
                {/* サイドバーの内容をここに追加 */}
            </div>
            <div className="w-3/4">
                <h1 className="text-3xl font-bold">Reading Books</h1>
                <ul>
                    {readingTasks.length > 0 &&
                        readingTasks.map((task) => (
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

export default ReadingPage;
