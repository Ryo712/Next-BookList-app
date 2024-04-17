import React, { useEffect, useState } from 'react';
import { getStatusTwoData } from '../lib/firebase/apis/firestore'; // firestore.tsのパスを正しく指定

const ReadingPage = () => {
    const [readingTasks, setReadingTasks] = useState<{ id: string; title: string; description: string; status: string; }[]>([]); // 読書中のタスクの状態を管理

    useEffect(() => {
        const fetchReadingTasks = async () => {
            try {
                const data = await getStatusTwoData(); // getStatusTwoData関数を使って読書中のタスクを取得
                setReadingTasks(data);
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
            <div className="w-1/4"> {/* サイドバー */}
                {/* サイドバーの内容をここに追加 */}
            </div>
            <div className="w-3/4"> {/* データ表示部分 */}
                <h1>Reading Books</h1>
                <ul>
                    {readingTasks.length > 0 && // readingTasksが空でないことを確認
                        readingTasks.map((task) => (
                            <li key={task.id}>
                                <p>Title: {task.title}</p>
                                <p>Description: {task.description}</p>
                                <p>Status: {task.status}</p>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default ReadingPage;
