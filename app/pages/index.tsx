import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { UserContext } from './_app';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';

const MyComponent = () => {
  const user = useContext(UserContext);
  const [items, setItems] = useState<{ id: string; title: string; description: string; status: number; author: string; url: string; coverImage: string, createdAt: any }[]>([]);
  const [searchResults, setSearchResults] = useState<{ id: string; title: string; description: string; status: number; author: string; url: string; coverImage: string, createdAt: any }[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const tasksCollection = collection(db, 'tasks');
          const q = query(tasksCollection, where('userId', '==', user.uid), orderBy('createdAt', 'asc'));
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
            createdAt: any;
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

  const handleSearch = (results: { id: string; title: string; description: string; status: number; author: string; url: string; coverImage: string, createdAt: any }[]) => {
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
      <div className="w-1/6">
        <Sidebar onSearchResult={handleSearch} />
      </div>
      
      <div className="w-3/4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">All Books</h1>
          <Link href="/new">
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black font-medium border border-gray-300 rounded-md shadow-sm">
              New
            </button>
          </Link>
        </div>

        <div className="w-full grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
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
