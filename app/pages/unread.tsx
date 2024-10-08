import React, { useEffect, useState, useContext } from 'react';
import {
  updateDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { UserContext } from './_app';

const UnreadPage: React.FC = () => {
  const user = useContext(UserContext);
  const [unreadTasks, setUnreadTasks] = useState<
    {
      id: string;
      title: string;
      description: string;
      status: number;
      author: string;
      url: string;
      coverImage: string;
    }[]
  >([]);

  const fetchUnreadTasks = async () => {
    if (user) {
      try {
        const tasksCollection = collection(db, 'tasks');
        const q = query(
          tasksCollection,
          where('userId', '==', user.uid),
          where('status', '==', 1)
        ); // ステータスが1のタスクを取得
        const querySnapshot = await getDocs(q);
        const tasksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as {
          id: string;
          title: string;
          description: string;
          status: number;
          author: string;
          url: string;
          coverImage: string;
        }[];
        setUnreadTasks(tasksData);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      }
    }
  };

  useEffect(() => {
    fetchUnreadTasks();
  }, [user]);

  const handleCheckboxChange = async (taskId: string, newStatus: number) => {
    if (user) {
      try {
        const taskDocRef = doc(db, 'tasks', taskId);
        await updateDoc(taskDocRef, { status: newStatus });

        // 状態を即座に更新
        setUnreadTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );

        // タスクを再取得して最新状態を反映
        await fetchUnreadTasks();
      } catch (error) {
        console.error('ステータスの更新に失敗しました:', error);
      }
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/6">
        <Sidebar />
      </div>
      <div className="w-3/4 p-6">
        <h1 className="text-3xl font-bold mb-4">Unread Books</h1>
        <Card books={unreadTasks} onCheckboxChange={handleCheckboxChange} />
      </div>
    </div>
  );
};

export default UnreadPage;
