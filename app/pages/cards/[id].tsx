import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const CardDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // URLからIDを取得

  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('未読');
  const [editAuthor, setEditAuthor] = useState('');
  const [editUrl, setEditUrl] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const docRef = doc(db, 'tasks', id as string);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setEditTitle(data.title || '');
            setEditDescription(data.description || '');
            setEditStatus(data.status || '未読');
            setEditAuthor(data.author || '');
            setEditUrl(data.url || '');
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching task:', error);
        }
      }
    };

    fetchData();
  }, [id]);

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'tasks', id as string);
      await updateDoc(docRef, {
        title: editTitle || '',
        description: editDescription || '',
        status: editStatus,
        author: editAuthor || '',
        url: editUrl || ''
      });
      // 更新が成功したら、必要に応じてメッセージを表示するか、リダイレクトするかなどの処理を追加
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const docRef = doc(db, 'tasks', id as string);
      await deleteDoc(docRef);
      router.push('/'); // 削除後にホームページにリダイレクト（必要に応じて調整）
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (!id) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-5" style={{ maxWidth: '800px', marginLeft: '250px' }}>
      <h1 className="text-3xl font-bold mb-5">Task Detail</h1>
      <div className="mb-5">
        <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-400">Title</label>
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full border rounded py-2 px-3 text-gray-700 mb-3"
        />
      </div>
      <div className="mb-5">
        <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-400">Description</label>
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full border rounded py-2 px-3 text-gray-700 mb-3"
        />
      </div>
      <div className="mb-5">
        <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-400">Status</label>
        <select
          value={editStatus}
          onChange={(e) => setEditStatus(e.target.value)}
          className="w-full border rounded py-2 px-3 text-gray-700 mb-3"
        >
          <option value="未読">未読</option>
          <option value="読了">読了</option>
        </select>
      </div>
      <div className="mb-5">
        <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-400">Author</label>
        <input
          type="text"
          value={editAuthor}
          onChange={(e) => setEditAuthor(e.target.value)}
          className="w-full border rounded py-2 px-3 text-gray-700 mb-3"
        />
      </div>
      <div className="mb-5">
        <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-400">URL</label>
        <input
          type="text"
          value={editUrl}
          onChange={(e) => setEditUrl(e.target.value)}
          className="w-full border rounded py-2 px-3 text-gray-700 mb-3"
        />
      </div>
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
  );
};

export default CardDetails;
