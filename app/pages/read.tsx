import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { UserContext } from './_app';
import Card from '../components/Card';
import Sidebar from '../components/Sidebar';

const ReadPage: React.FC = () => {
  const user = useContext(UserContext);
  const [readTasks, setReadTasks] = useState<{
    id: string;
    title: string;
    description: string;
    status: number;
    author: string;
    url: string;
    coverImage: string;
  }[]>([]);
  const router = useRouter();

  const fetchReadTasks = async () => {
    if (user) {
      try {
        const tasksCollection = collection(db, 'tasks');
        const q = query(tasksCollection, where('userId', '==', user.uid), where('status', '==', 3)); // ステータスが3のタスクを取得
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
        setReadTasks(tasksData);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      }
    }
  };

  useEffect(() => {
    fetchReadTasks();
  }, [user]);

  const handleCheckboxChange = async (taskId: string, newStatus: number) => {
    if (user) {
      try {
        const taskDocRef = doc(db, 'tasks', taskId);
        await updateDoc(taskDocRef, { status: newStatus });
        fetchReadTasks();
      } catch (error) {
        console.error('ステータスの更新に失敗しました:', error);
      }
    }
  };

  const handleSearch = (results: {
    id: string;
    title: string;
    description: string;
    status: number;
    author: string;
    url: string;
    coverImage: string;
  }[]) => {
    router.push({
      pathname: '/',
      query: { searchResults: JSON.stringify(results) },
    });
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/6">
        <Sidebar onSearchResult={handleSearch} />
      </div>
      <div className="w-3/4 p-6">
        <h1 className="text-3xl font-bold mb-4">Read Books</h1>
        <Card books={readTasks} onCheckboxChange={handleCheckboxChange} />
      </div>
    </div>
  );
};

export default ReadPage;
