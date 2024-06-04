import React, { useEffect, useState } from 'react';
import { getStatusTwoData } from '../lib/firebase/apis/firestore';
import Card from '../components/Card'; // Card コンポーネントのインポート

const ReadingPage = () => {
    const [readingTasks, setReadingTasks] = useState<{ id: string; title: string; description: string; status: number; author: string; url: string }[]>([]);

    useEffect(() => {
        const fetchReadingTasks = async () => {
            try {
                const data = await getStatusTwoData();
                // Firestore から取得したデータを適切な形式に整形してセットする
                const formattedData = data.map((task: any) => ({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    status: Number(task.status),
                    author: task.author,  
                    url: task.url 
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

    const handleCheckboxChange = async (id: string, newStatus: number) => {
        try {
            // ステータスの更新ロジックをここに追加
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
                <h1 className="text-3xl font-bold">Reading Books</h1>
                <Card books={readingTasks} onCheckboxChange={handleCheckboxChange} />
            </div>
        </div>
    );
};

export default ReadingPage;
