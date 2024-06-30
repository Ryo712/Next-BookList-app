import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getStatusThreeData, updateTaskStatus } from '../lib/firebase/apis/firestore';
import Card from '../components/Card';
import Sidebar from '../components/Sidebar';

const ReadPage: React.FC = () => {
  const [readTasks, setReadTasks] = useState<{
    id: string;
    title: string;
    description: string;
    status: number;
    author: string;
    url: string;
    coverImage: string; // coverImageを追加
  }[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchReadTasks = async () => {
      try {
        const data = await getStatusThreeData();
        const formattedData = data.map((task: any) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: Number(task.status),
          author: task.author,
          url: task.url,
          coverImage: task.coverImage, // coverImageを追加
        }));
        setReadTasks(formattedData);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      }
    };

    fetchReadTasks();
  }, []);

  const handleCheckboxChange = async (id: string, newStatus: number) => {
    try {
      await updateTaskStatus(id, newStatus);
      setReadTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
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
      query: { searchResults: JSON.stringify(results) },
    });
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4">
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
