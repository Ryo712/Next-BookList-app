import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

type CardProps = {
  id: string;
  title: string;
  description: string;
  status: number;
  author: string;
  url: string;
  checked?: boolean;
  onCheckboxChange?: (value: string) => void; // onCheckboxChangeプロパティを追加
};

const Card: React.FC<CardProps> = ({
  id,
  title,
  description,
  status,
  author,
  url,
  onCheckboxChange, // onCheckboxChangeプロパティを受け取る
}) => {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(status === 3);

  const handleCardClick = () => {
    router.push(`/cards/${id}`); // 詳細ページに遷移
  };

  const handleCheckboxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent card click event
    const newStatus = e.target.checked ? 3 : status;
    setIsChecked(e.target.checked);
    try {
      const docRef = doc(db, 'tasks', id);
      await updateDoc(docRef, { status: newStatus });
      onCheckboxChange?.(id); // onCheckboxChangeプロパティを呼び出す
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    setIsChecked(status === 3);
  }, [status]); //statusが変更された時のみuseEffectの関数が実行される

  return (
    <div
      className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="p-5">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {description}
        </p>
        <p>Status: {status}</p>
        <p>Author: {author}</p>
        <p>URL: {url}</p>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          Mark as Done
        </label>
      </div>
    </div>
  );
};

export default Card;