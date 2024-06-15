import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';

const MyComponent = () => {
  const [items, setItems] = useState<{ id: string; title: string; description: string; status: number; author: string; url: string }[]>([]);
  const [searchResults, setSearchResults] = useState<{ id: string; title: string; description: string; status: number; author: string; url: string }[]>([]);
  const router = useRouter();

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

  useEffect(() => {
    if (router.query.searchResults) {
      setSearchResults(JSON.parse(router.query.searchResults as string));
    }
  }, [router.query.searchResults]);

  const handleSearch = (results: { id: string; title: string; description: string; status: number; author: string; url: string }[]) => {
    setSearchResults(results);
  };

  const handleCheckboxChange = async (id: string, newStatus: number) => {
    try {
      // ステータスの更新ロジックをここに追加
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4">
        <Sidebar onSearchResult={handleSearch} />
      </div>
      
      <div className="w-3/4 p-6">
        <div className="flex justify-end mb-4">
          <Link href="/new">
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              New
            </button>
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">アイテム一覧</h1>
        <div className="w-full grid grid-cols-custom-layout gap-6">
          {searchResults.length > 0 ? (
            <Card books={searchResults} onCheckboxChange={handleCheckboxChange} />
          ) : (
            <Card books={items} onCheckboxChange={handleCheckboxChange} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyComponent;
