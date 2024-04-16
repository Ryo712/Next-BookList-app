// read.tsx

import React, { useEffect, useState } from 'react';
import { getStatusOneData } from '../lib/firebase/apis/firestore'; // firestore.tsのパスを正しく指定

const ReadPage = () => {
    const [readTasks, setReadTasks] = useState<{ id: string; title: string; }[]>([]); // 読了したタスクの状態を管理

    useEffect(() => {
        const fetchReadTasks = async () => {
            try {
                const data = await getStatusOneData(); // getStatusThreeData関数を使って読了したタスクを取得
                setReadTasks(data);
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
        <div className="w-1/4"> {/* サイドバー */}
            {/* サイドバーの内容をここに追加 */}
        </div>
        <div className="w-3/4"> {/* データ表示部分 */}
            <h1>Reading Books</h1>
            <ul>
                {readTasks.length > 0 && // readingTasksが空でないことを確認
                    readTasks.map((task) => (
                        <li key={task.id}>{task.title}</li>
                    ))}
            </ul>
        </div>
    </div>
);
};

export default ReadPage;
