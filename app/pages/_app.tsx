// pages/_app.tsx
import React from 'react';
import { AppProps } from 'next/app';
import Sidebar from '../components/Sidebar';
import { useRouter } from 'next/router';
import 'tailwindcss/tailwind.css';
import { app, auth, db } from '../firebaseConfig'; // firebaseConfig.ts をインポート

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter(); // router をここで取得する

  return (
    <div className="flex min-h-screen">
      {!['/login', '/register'].includes(router.pathname) && <Sidebar />}
      <div className="flex-1 flex flex-col">
        {/* MyApp コンポーネント内で app、auth、db にアクセスできる */}
        <Component {...pageProps} app={app} auth={auth} db={db} />
      </div>
    </div>
  );
}

export default MyApp;
