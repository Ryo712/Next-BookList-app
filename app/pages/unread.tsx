import React, { useEffect, useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { getStatusOneData } from '../lib/firebase/apis/firestore';
import { db } from '../firebaseConfig';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { useRouter } from 'next/router';

const UnreadPage: React.FC = () => {
  const [unreadTasks, setUnreadTasks] = useState<{
    id: string;
    title: string;
    description: string;
    status: number;
    author: string;
    url: string;
    coverImage: string; // coverImageを追加
  }[]>([]);
  const router = useRouter();

  const fetchUnreadTasks = async () => {
    try {
      const data = await getStatusOneData();
      const formattedData = data.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: Number(task.status),
        author: task.author,
        url: task.url,
        coverImage: task.coverImage, // coverImageを追加
      }));
      setUnreadTasks(formattedData);
    } catch (error) {
      console.error('データの取得に失敗しました:', error);
    }
  };

  useEffect(() => {
    fetchUnreadTasks();
  }, []);

  const handleCheckboxChange = async (taskId: string, newStatus: number) => {
    try {
      const taskDocRef = doc(db, 'tasks', taskId);
      await updateDoc(taskDocRef, { status: newStatus });
      fetchUnreadTasks();
    } catch (error) {
      console.error('ステータスの更新に失敗しました:', error);
    }
  };

  const handleSearch = (results: {
    id: string;
    title: string;
    description: string;
    status: number;
    author: string;
    url: string;
    coverImage: string; // coverImageを追加
  }[]) => {
    router.push({
      pathname: '/',
      query: { searchResults: JSON.stringify(results) }
    });
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4">
        <Sidebar onSearchResult={handleSearch} />
      </div>
      <div className="w-3/4 p-6">
        <h1 className="text-3xl font-bold mb-4">Unread Books</h1>
        <Card books={unreadTasks} onCheckboxChange={handleCheckboxChange} />
      </div>
    </div>
  );
};

export default UnreadPage;
