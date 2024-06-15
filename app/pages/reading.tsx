import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getStatusTwoData } from '../lib/firebase/apis/firestore';
import Card from '../components/Card';
import Sidebar from '../components/Sidebar';

const ReadingPage = () => {
  const [readingTasks, setReadingTasks] = useState<{ id: string; title: string; description: string; status: number; author: string; url: string }[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchReadingTasks = async () => {
      try {
        const data = await getStatusTwoData();
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

    return () => {};
  }, []);

  const handleCheckboxChange = async (id: string, newStatus: number) => {
    try {
      // ステータスの更新ロジックをここに追加
    } catch (error) {
      console.error('ステータスの更新に失敗しました:', error);
    }
  };

  const handleSearch = (results: { id: string; title: string; description: string; status: number; author: string; url: string }[]) => {
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
        <h1 className="text-3xl font-bold mb-4">Reading Books</h1>
        <Card books={readingTasks} onCheckboxChange={handleCheckboxChange} />
      </div>
    </div>
  );
};

export default ReadingPage;
