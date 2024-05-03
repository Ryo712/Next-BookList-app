import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, doc, deleteDoc, addDoc, getDoc, getDocs, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Card from '../components/Card';

const ReadPage = () => {
  const [readTasks, setReadTasks] = useState<{ id: string; title: string; description: string; status: string; }[]>([]);

  useEffect(() => {
    const readTasksRef = collection(db, 'readTasks');
    const q = query(readTasksRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        description: doc.data().description,
        status: doc.data().status,
      }));
      setReadTasks(tasks);
    });

    return () => unsubscribe();
  }, []);

  const handleCheckboxChange = async (taskId: string) => {
    try {
      const taskDocRef = doc(db, 'readTasks', taskId);
      const taskDocSnapshot = await getDoc(taskDocRef);
  
      if (taskDocSnapshot.exists()) {
        await deleteDoc(taskDocRef);
  
        const unreadTasksRef = collection(db, 'unreadTasks');
        const taskData = taskDocSnapshot.data();
        await addDoc(unreadTasksRef, {
          id: taskId,
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
        });
      }
    } catch (error) {
      console.error('Error moving task to unread:', error);
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
                  onCheckboxChange={() => handleCheckboxChange(task.id)} // チェックボックスの状態変更を検知する関数を渡す
                />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default ReadPage;
