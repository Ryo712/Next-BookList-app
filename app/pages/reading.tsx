// reading.tsx
import React, { useEffect, useState } from 'react';
import { getStatusTwoData } from '../lib/firebase/apis/firestore'; // firestore.tsのパスを正しく指定

const ReadingPage = () => {
    const [readingTasks, setReadingTasks] = useState<{ id: string; title: string; }[]>([]); // 読書中のタスクの状態を管理

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
        <div>
            <h1>Reading Books</h1>
            <ul>
                {readingTasks.length > 0 && // readingTasksが空でないことを確認
                    readingTasks.map((task) => (
                        <li key={task.id}>{task.title}</li>
                    ))}
            </ul>
        </div>
    );
};

export default ReadingPage;
