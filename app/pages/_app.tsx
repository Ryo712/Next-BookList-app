import React, { useState, useEffect, createContext } from 'react';
import { AppProps } from 'next/app';
import Sidebar from '../components/Sidebar';
import { useRouter } from 'next/router';
import 'tailwindcss/tailwind.css';
import { app, db } from '../firebaseConfig';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// ユーザーコンテキストの作成
export const UserContext = createContext<any>(null);

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const hideSidebarPaths = ['/login', '/register', '/new', '/cards/[id]', '/profile'];
  const showSidebar = !hideSidebarPaths.some((path) => router.pathname.startsWith(path));

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser({ ...user, ...userDoc.data() });
        } else {
          setUser(user); // Firestoreドキュメントが存在しない場合もセット
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSearchResult = (results: any[]) => {
    setSearchResults(results);
  };

  return (
    <UserContext.Provider value={user}>
      <div className="flex min-h-screen">
        {showSidebar && <Sidebar onSearchResult={handleSearchResult} />}
        <div className={`flex-1 flex flex-col ${!showSidebar ? 'w-full' : ''}`}>
          <Component 
            {...pageProps} 
            app={app} 
            auth={getAuth} 
            db={db} 
            searchResults={searchResults} 
          />
        </div>
      </div>
    </UserContext.Provider>
  );
}

export default MyApp;
