import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const NewTask = () => {
  const [newTask, setNewTask] = useState<{ title: string; description: string; author: string; url: string; coverImage: File | null }>({
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
    setNewTask({ ...newTask, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const fileType = file.type;
      if (fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'image/jpg') {
        setNewTask({ ...newTask, coverImage: file });
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setNewTask({ ...newTask, coverImage: null });
        setPreview(null);
      }
    } else {
      setNewTask({ ...newTask, coverImage: null });
      setPreview(null);
    }
  };

  const handleAddTask = async () => {
    try {
      let coverImageUrl = '';
      if (newTask.coverImage) {
        const storageRef = ref(storage, `images/${newTask.coverImage.name}`);
        await uploadBytes(storageRef, newTask.coverImage);
        coverImageUrl = await getDownloadURL(storageRef);
      }

      const formData = {
        title: newTask.title,
        author: newTask.author,
        description: newTask.description,
        url: newTask.url,
        coverImage: coverImageUrl,
        status: 1, // ステータスの初期値を1に設定
      };

      // Firestoreのtasksコレクションにデータを追加
      await addDoc(collection(db, 'tasks'), formData);

      router.push('/');
    } catch (error) {
      console.error('Error uploading cover image or saving data:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
        <div className="mb-4">
          <input
            type="text"
            name="title"
            value={newTask.title}
            onChange={handleInputChange}
            placeholder="Title"
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="author"
            value={newTask.author}
            onChange={handleInputChange}
            placeholder="Author"
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="description"
            value={newTask.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="url"
            value={newTask.url}
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
            accept=".png, .jpeg, .jpg"
          />
        </div>
        {preview && <img src={preview} alt="カバー画像のプレビュー" className="mb-4 w-full h-auto"/>}
        <button onClick={handleAddTask} className="bg-blue-500 text-white px-4 py-2 rounded">
          追加
        </button>
      </div>
    </div>
  );
};

export default NewTask;
