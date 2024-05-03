import React, { useState } from 'react';
import { doc, updateDoc, deleteDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

type CardProps = {
  id: string | number;
  title: string;
  description: string;
  status: string;
  onDelete?: () => void; // onDeleteプロパティを任意にする
  onCheckboxChange?: () => void; // チェックボックスの状態変更を検知する関数を任意にする
};

const Card: React.FC<CardProps> = ({ id, title, description, status, onCheckboxChange }) => {
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [editStatus, setEditStatus] = useState(status);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditDescription(e.target.value);
  };

  const handleSave = async () => {
    const docRef = doc(db, 'readTasks', id.toString());
    await updateDoc(docRef, { title: editTitle, description: editDescription, status: editStatus });
  };

  const handleDelete = async () => {
    const docRef = doc(db, 'readTasks', id.toString());
    await deleteDoc(docRef);
  };

  const handleCheckboxChange = async () => {
    const newStatus = editStatus === '1' ? '3' : '1';
    setEditStatus(newStatus);
    if (onCheckboxChange) {
      onCheckboxChange(); // チェックボックスの状態変更を検知する関数を呼び出す
    }
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
        <p>Status: {editStatus}</p>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={editStatus === '3'}
            onChange={handleCheckboxChange}
            className="form-checkbox h-5 w-5 text-blue-500"
          />
          <span className="ml-2 text-gray-700 dark:text-gray-400">読了</span>
        </label>
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Save
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Card;
