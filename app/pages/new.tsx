import React, { useState } from 'react';
import { useRouter } from 'next/router';

const NewBook = () => {
  const [newBook, setNewBook] = useState({ title: '', description: '', author: '', url: '', coverImage: '' });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const handleAddBook = async () => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      });

      if (res.ok) {
        router.push('/');
      } else {
        console.error('Failed to save data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Add New Book</h2>
        <div className="mb-4">
          <input
            type="text"
            name="title"
            value={newBook.title}
            onChange={handleInputChange}
            placeholder="title"
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="author"
            value={newBook.author}
            onChange={handleInputChange}
            placeholder="author"
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="description"
            value={newBook.description}
            onChange={handleInputChange}
            placeholder="description"
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="url"
            value={newBook.url}
            onChange={handleInputChange}
            placeholder="URL"
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="coverImage"
            value={newBook.coverImage}
            onChange={handleInputChange}
            placeholder="image"
            className="border p-2 w-full"
          />
        </div>
        <button onClick={handleAddBook} className="bg-blue-500 text-white px-4 py-2 rounded">
          追加
        </button>
      </div>
    </div>
  );
};

export default NewBook;
