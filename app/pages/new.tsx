import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';

const NewBook = () => {
  const [newBook, setNewBook] = useState<{ title: string; description: string; author: string; url: string; coverImage: File | null }>({
    title: '',
    description: '',
    author: '',
    url: '',
    coverImage: null
  });
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
      let coverImageUrl = '';
      if (newBook.coverImage) {
        console.log('Cover image:', newBook.coverImage);
        console.log('Storage:', storage);

        if (!storage) {
          throw new Error('Firebase Storage is not initialized.');
        }

        const storageRef = ref(storage, `covers/${newBook.coverImage.name}`);
        console.log('Storage ref:', storageRef);
        await uploadBytes(storageRef, newBook.coverImage);
        coverImageUrl = await getDownloadURL(storageRef);
        console.log('Cover image URL:', coverImageUrl);
      }

      const formData = {
        title: newBook.title,
        author: newBook.author,
        description: newBook.description,
        url: newBook.url,
        coverImage: coverImageUrl,
      };

      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/');
      } else {
        console.error('Failed to save data:', res.statusText);
      }
    } catch (error) {
      console.error('Error uploading cover image or saving data:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">新しい本を追加する</h2>
        <div className="mb-4">
          <input
            type="text"
            name="title"
            value={newBook.title}
            onChange={handleInputChange}
            placeholder="タイトル"
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="author"
            value={newBook.author}
            onChange={handleInputChange}
            placeholder="著者"
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="description"
            value={newBook.description}
            onChange={handleInputChange}
            placeholder="説明"
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="url"
            value={newBook.url}
            onChange={handleInputChange}
            placeholder="画像URL"
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
