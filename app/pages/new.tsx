import React, { useState } from 'react';
import { useRouter } from 'next/router';
import storage from "../firebaseConfig"

const NewBook = () => {
  const [newBook, setNewBook] = useState<{ title: string; description: string; author: string; url: string; coverImage: File | null }>({ title: '', description: '', author: '', url: '', coverImage: null });
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewBook({ ...newBook, coverImage: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleAddBook = async () => {
    try {
      const formData = new FormData();
      formData.append('title', newBook.title);
      formData.append('author', newBook.author);
      formData.append('description', newBook.description);
      formData.append('url', newBook.url);
      if (newBook.coverImage) {
        formData.append('coverImage', newBook.coverImage);
      }

      const res = await fetch('/api/tasks', {
        method: 'POST',
        body: formData,
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
            placeholder="Title"
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="author"
            value={newBook.author}
            onChange={handleInputChange}
            placeholder="Author"
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="description"
            value={newBook.description}
            onChange={handleInputChange}
            placeholder="Description"
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
            type="file"
            name="coverImage"
            onChange={handleFileChange}
            className="border p-2 w-full"
          />
        </div>
        {preview && <img src={preview} alt="カバー画像のプレビュー" className="mb-4 w-full h-auto"/>}
        <button onClick={handleAddBook} className="bg-blue-500 text-white px-4 py-2 rounded">
          追加
        </button>
      </div>
    </div>
  );
};

export default NewBook;
