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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      title: { value: string };
      description: { value: string };
    };
  
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: target.title.value,
          description: target.description.value,
        }),
      });
      if (response.ok) {
        console.log('Task created successfully');
        window.location.href = '/'; // リダイレクトを行う
      } else {
        console.error('Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

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
      <form onSubmit={handleSubmit}>
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
