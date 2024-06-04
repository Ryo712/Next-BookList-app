import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';

const MyComponent = () => {
  const [sidenav, setSidenav] = useState(true);
  const [items, setItems] = useState<{ id: string; title: string; description: string; status: number; author: string; url: string }[]>([]);
  const [searchResult, setSearchResult] = useState<{ id: string; title: string; description: string; status: number; author: string; url: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/tasks?status=all');
        const items = await response.json();
        setItems(items);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (result: { id: string; title: string; description: string; status: number; author: string; url: string; } | null): Promise<void> => {
    try {
      setSearchResult(result);
    } catch (error) {
      console.error('Error searching tasks:', error);
    }
  };

  const handleCheckboxChange = async (id: string, newStatus: number) => {
    try {
      // ステータスの更新ロジックをここに追加
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="font-poppins antialiased h-full w-screen flex flex-row">
      <button
        onClick={() => setSidenav(true)}
        className="..."
      >
        {/* ここにSVGアイコンなどのコンテンツを挿入 */}
      </button>
      
      <Sidebar onSearchResult={handleSearch} />
      
      <div className="ml-60 flex-1">
        <div className="flex justify-end p-6">
          <Link href="/new">
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              新しい本を追加する
            </button>
          </Link>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold mb-4">アイテム一覧</h1>
          <div className="container mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResult ? (
              <Card books={[searchResult]} onCheckboxChange={handleCheckboxChange} />
            ) : (
              <Card books={items} onCheckboxChange={handleCheckboxChange} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyComponent;
