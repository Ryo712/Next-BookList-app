import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, deleteDoc, addDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Card from '../components/Card';

const UnreadPage: React.FC = () => {
  const [unreadTasks, setUnreadTasks] = useState<{ id: string; title: string; description: string; status: string }[]>([]);

  useEffect(() => {
    const unreadTasksRef = collection(db, 'tasks');
    const q = query(unreadTasksRef, where('status', '==', '1')); // ステータスが '1' のデータのみを取得

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        description: doc.data().description,
        status: doc.data().status,
      }));
      setUnreadTasks(tasks);
    });

    return () => unsubscribe();
  }, []);

  const handleCheckboxChange = async (taskId: string) => {
    try {
      const taskDocRef = doc(db, 'tasks', taskId);
      const taskDocSnapshot = await getDoc(taskDocRef);

      if (taskDocSnapshot.exists()) {
        await deleteDoc(taskDocRef);

        const readTasksRef = collection(db, 'readTasks');
        const taskData = taskDocSnapshot.data();
        await addDoc(readTasksRef, {
          id: taskId,
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
        });
      }
    } catch (error) {
      console.error('Error moving task to read:', error);
    }
  };

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
                {/* Card コンポーネントに必要なプロパティを渡す */}
                <Card
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  status={task.status}
                  onCheckboxChange={() => handleCheckboxChange(task.id)} // チェックボックスの状態変更を検知する関数を渡す
                />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default UnreadPage;
