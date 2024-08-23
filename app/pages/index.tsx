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
  const [items, setItems] = useState<
    {
      id: string;
      title: string;
      description: string;
      status: number;
      author: string;
      url: string;
      coverImage: string;
      createdAt: any;
    }[]
  >([]);
  const [searchResults, setSearchResults] = useState<
    {
      id: string;
      title: string;
      description: string;
      status: number;
      author: string;
      url: string;
      coverImage: string;
      createdAt: any;
    }[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const tasksCollection = collection(db, 'tasks');
          const q = query(
            tasksCollection,
            where('userId', '==', user.uid),
            orderBy('createdAt', 'asc')
          );
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
          setSearchResults(tasksData); // 初期表示は全タスク
        } catch (error) {
          console.error('タスクの取得中にエラーが発生しました:', error);
        }
      }
    };

    fetchData();
  }, [user]);

  const handleSearchResults = (results: any[]) => {
    setSearchResults(results);
  };

  const handleCheckboxChange = async (id: string, newStatus: number) => {
    try {
      // ステータス更新の処理
    } catch (error) {
      console.error('ステータス更新中にエラーが発生しました:', error);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/6">
        <Sidebar onSearchResult={handleSearchResults} />
      </div>

      <div className="w-2/3 p-6 ml-0">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">All Books</h1>
          <Link href="/new">
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black font-medium border border-gray-300 rounded-md shadow-sm">
              New
            </button>
          </Link>
        </div>

        <div
          className="w-full grid gap-8"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          }}
        >
          <Card
            books={searchResults.length > 0 ? searchResults : items}
            onCheckboxChange={handleCheckboxChange}
          />
        </div>
      </div>
    </div>
  );
};

export default MyComponent;
