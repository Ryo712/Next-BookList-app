// pages/_app.tsx
import React, { useState } from 'react';
import { AppProps } from 'next/app';
import Sidebar from '../components/Sidebar';
import { useRouter } from 'next/router';
import 'tailwindcss/tailwind.css';
import { app, getAuth, db } from '../firebaseConfig'; 

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<any[]>([]); // 検索結果の状態を追加
  const hideSidebarPaths = ['/login', '/register', '/new'];
  const showSidebar = !hideSidebarPaths.includes(router.pathname);

  // 検索結果を処理する関数
  const handleSearchResult = (results: any[]) => {
    setSearchResults(results);
    
  };

  return (
    <div className="flex min-h-screen">
      {showSidebar && <Sidebar onSearchResult={handleSearchResult} />}
      <div className={`flex-1 flex flex-col ${!showSidebar ? 'w-full' : ''}`}>
        {/* MyApp コンポーネント内で app、auth、db にアクセスできる */}
        <Component 
          {...pageProps} 
          app={app} 
          auth={getAuth} 
          db={db} 
          searchResults={searchResults} 
        />
      </div>
    </div>
  );
}

export default MyApp;