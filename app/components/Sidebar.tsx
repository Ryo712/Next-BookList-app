import React, { useState, useEffect, createContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBookOpen, faCheckDouble, faSearch } from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs, query, where, DocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const SearchResultsContext = createContext<{
  searchResults: DocumentSnapshot<DocumentData>[];
  setSearchResults: React.Dispatch<React.SetStateAction<DocumentSnapshot<DocumentData>[]>>;
} | null>(null);

const Sidebar = () => {
  const router = useRouter();
  const navigation = [
    { name: 'Unread', icon: faBook },
    { name: 'Reading', icon: faBookOpen },
    { name: 'Read', icon: faCheckDouble },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<DocumentSnapshot<DocumentData>[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksCollectionRef = collection(db, 'tasks');
      const querySnapshot = await getDocs(tasksCollectionRef);
      setSearchResults(querySnapshot.docs);
    };

    fetchTasks();
  }, []);

  const handleSearch = async () => {
    const tasksCollectionRef = collection(db, 'tasks');
    let q;

    if (searchTerm.trim() === '') {
      q = query(tasksCollectionRef);
    } else {
      q = query(
        tasksCollectionRef,
        where('title', '>=', searchTerm),
        where('title', '<=', `${searchTerm}\uf8ff`)
      );
    }

    try {
      const querySnapshot = await getDocs(q);
      setSearchResults(querySnapshot.docs);
    } catch (error) {
      console.error('Error searching tasks:', error);
    }
  };

  return (
    <SearchResultsContext.Provider value={{ searchResults, setSearchResults }}>
      {/* Sidebar 内容 */}
    </SearchResultsContext.Provider>
  );
};

export default Sidebar;