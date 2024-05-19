import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBookOpen, faCheckDouble, faSearch } from '@fortawesome/free-solid-svg-icons';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore'; // DocumentDataをインポート
import { db } from '../firebaseConfig';

interface SidebarProps {
  onSearchResult: (result: { id: string; title: string; description: string; status: number } | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSearchResult }) => {
  const navigation = [
    { name: 'Unread', icon: faBook },
    { name: 'Reading', icon: faBookOpen },
    { name: 'Read', icon: faCheckDouble },
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    const q = query(collection(db, 'tasks'), where('title', '==', searchTerm));
    const querySnapshot = await getDocs(q);
    const result = querySnapshot.docs.map(doc => doc.data()) as Array<{ id: string; title: string; description: string; status: number }>; // 型を修正
    onSearchResult(result.length > 0 ? result[0] : null); // 修正
  };

  return (
    <aside className="sidebar flex-shrink-0 w-60 h-screen bg-white text-grey-800 flex flex-col shadow-2xl fixed left-0 top-0 bottom-0 z-10">
      <div className="px-4 py-6">
        <Link href="/">
          <div className="text-xl font-semibold text-gray-800 text-center cursor-pointer">Book List</div>
        </Link>
        <div className="flex flex-col items-center mt-6">
          <img
            className="h-16 w-16 rounded-full object-cover"
            src="onepiece01_luffy.png"
            alt="User profile"
          />
          <div className="text-center mt-4 mb-4">
            <p className="text-sm font-semibold text-gray-800">Michael Jackson</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
          <div className="relative w-full mb-6">
            <input
              type="search"
              className="w-full pl-3 pr-10 py-2 bg-white text-gray-800 rounded-md focus:outline-none focus:ring focus:border-blue-300 border border-gray-300"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-gray-500" />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-blue-600"
          >
            Search
          </button>
        </div>
        <nav className="flex flex-col mt-2">
          {navigation.map((item) => (
            <Link href={item.name === 'Unread' ? '/unread' : item.name === 'Reading' ? '/reading' : '/read'} key={item.name}>
              <div className={`flex items-center px-4 py-2 mt-2 text-sm font-semibold rounded-lg ${
                item.name === 'Dashboard' ? 'bg-gray-700 text-white' : 'hover:bg-gray-100'
              }`}>
                <FontAwesomeIcon icon={item.icon} className="text-3xl mr-3" />
                {item.name}
              </div>
            </Link>
          ))}
        </nav>
      </div>
      <footer className="w-full bg-gray-800 text-gray-100 p-4 text-sm text-center fixed bottom-0 left-0">
        This is a Dashboard Sidebar Navigation by pantazisoftware.
      </footer>
    </aside>
  );
};

export default Sidebar;
