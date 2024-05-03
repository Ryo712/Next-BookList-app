import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';

const MyComponent = () => {
  const [sidenav, setSidenav] = useState(true);
  const [items, setItems] = useState<{ id: number; title: string; description: string; status: string }[]>([]);
  const [searchResult, setSearchResult] = useState<{ id: number; title: string; description: string; status: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/tasks?status=1');
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
        window.location.href = '/';
      } else {
        console.error('Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleSearch = async (result: { id: number; title: string; description: string; status: string } | null) => {
    try {
      setSearchResult(result);
    } catch (error) {
      console.error('Error searching tasks:', error);
    }
  };

  const handleCardDelete = async () => {
    // カードが削除された後に、再度データを取得して表示を更新する
    const response = await fetch('/api/tasks');
    const items = await response.json();
    setItems(items);
  };

  return (
    <div className="font-poppins antialiased h-full w-screen flex flex-row">
      <button
        onClick={() => setSidenav(true)}
        className="..."
      >
        {/* ここにSVGアイコンなどのコンテンツを挿入 */}
      </button>
      
      <Sidebar onSearchResult={handleSearch} />
      
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }} className="ml-60">
        <input type="text" name="title" placeholder="タイトル" />
        <input type="text" name="description" placeholder="説明" />
        <button type="submit">作成</button>
      </form>
      
      <div>
        <h1>アイテム一覧</h1>
        <div className="container mx-auto mt-10">
          {searchResult ? (
            <Card
              key={searchResult.id}
              id={searchResult.id}
              title={searchResult.title}
              description={searchResult.description}
              status={searchResult.status}
              onDelete={handleCardDelete} // カードが削除されたときに再レンダリングを行う関数を渡す
            />
          ) : (
            items.map((task) => (
              <Card
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                status={task.status}
                onDelete={handleCardDelete} // カードが削除されたときに再レンダリングを行う関数を渡す
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyComponent;
