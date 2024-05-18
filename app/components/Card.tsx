import React, { useState, useEffect } from 'react';
import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

type CardProps = {
  id: string;
  title: string;
  description: string;
  status: number;
  author: string;
  url: string;
  onDelete?: () => void;
  onCheckboxChange?: () => void;
  checked?: boolean;
};

const Card: React.FC<CardProps> = ({ id, title, description, status, author, url, onCheckboxChange }) => {
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [editStatus, setEditStatus] = useState(status);
  const [editAuthor, setEditAuthor] = useState(author);
  const [editUrl, setEditUrl] = useState(url);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'tasks', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEditTitle(data.title);
          setEditDescription(data.description);
          setEditStatus(data.status);
          setEditAuthor(data.author);
          setEditUrl(data.url);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditDescription(e.target.value);
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditAuthor(e.target.value);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditUrl(e.target.value);
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'tasks', id);
      await updateDoc(docRef, { title: editTitle, description: editDescription, status: editStatus, author: editAuthor, url: editUrl });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const docRef = doc(db, 'tasks', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleCheckboxChange = async () => {
    const newStatus = editStatus === 1 ? 3 : 1; // 数値型として比較する
    setEditStatus(newStatus);
    if (onCheckboxChange) {
      onCheckboxChange();
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
        <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-400">Author</label>
        <input
          type="text"
          value={editAuthor}
          onChange={handleAuthorChange}
          className="mb-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white"
        />
        <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-400">URL</label>
        <input
          type="text"
          value={editUrl}
          onChange={handleUrlChange}
          className="mb-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white"
        />
        <p>Status: {editStatus}</p>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={editStatus === 3}
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
