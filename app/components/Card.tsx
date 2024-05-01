import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Firebaseの設定ファイルからdbをインポート

type CardProps = {
  id: string | number; 
  title: string;
  description: string;
  status: string;
};

const Card: React.FC<CardProps> = ({ id, title, description, status }) => {
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditDescription(e.target.value);
  };

  const handleSave = async () => {
    const docRef = doc(db, 'tasks', id.toString()); // id を文字列に変換してパスに追加
    await updateDoc(docRef, { title: editTitle, description: editDescription });
  };

  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4">
      <div className="p-5">
        <input
          type="text"
          value={editTitle}
          onChange={handleTitleChange}
          className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        />
        <textarea
          value={editDescription}
          onChange={handleDescriptionChange}
          className="mb-3 font-normal text-gray-700 dark:text-gray-400"
        />
        <p>Status: {status}</p>
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Card;