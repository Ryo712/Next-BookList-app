// next/pages/index.tsx
import React, { useState, useEffect } from 'react';

const MyComponent = () => {
  const [sidenav, setSidenav] = useState(true);
  const [items, setItems] = useState<{ id: number; title: string; description: string }[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/tasks');
        const items = await response.json();
        setItems(items);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="font-poppins antialiased h-full w-screen flex flex-row">
      <button
        onClick={() => setSidenav(true)}
        className="..." // ここに適切なクラス名を設定してください
      >
        {/* ここにSVGアイコンなどのコンテンツを挿入 */}
      </button>
      
      <div
        id="sidebar"
        className={`bg-white h-screen ${sidenav ? '' : 'hidden'}`}
        onClick={() => setSidenav(false)}
      >
        {/* サイドバーの内容 */}
      </div>
      
      {/* 追加：フォームの部分 */}
      <form action="/api/tasks" method="post">
        <input type="text" name="title" placeholder="タイトル" />
        <input type="text" name="description" placeholder="説明" />
        <button type="submit">作成</button>
      </form>
      
      <div>
        <h1>アイテム一覧</h1>
        <ul>
          {items.map((task) => (
            <li key={task.id}>
              {task.title} - {task.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyComponent;
