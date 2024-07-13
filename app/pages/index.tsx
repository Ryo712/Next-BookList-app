import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { UserContext } from './_app';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';

const MyComponent = () => {
  const user = useContext(UserContext);
  const [items, setItems] = useState<{ id: string; title: string; description: string; status: number; author: string; url: string; coverImage: string }[]>([]);
  const [searchResults, setSearchResults] = useState<{ id: string; title: string; description: string; status: number; author: string; url: string; coverImage: string }[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const tasksCollection = collection(db, 'users', user.uid, 'tasks');
          const q = query(tasksCollection);
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

          setItems(tasksData);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (router.query.searchResults) {
      setSearchResults(JSON.parse(router.query.searchResults as string));
    }
  }, [router.query.searchResults]);

  const handleSearch = (results: { id: string; title: string; description: string; status: number; author: string; url: string; coverImage: string }[]) => {
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
        
        <h1 className="text-2xl font-bold mb-4">All Books</h1>
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
