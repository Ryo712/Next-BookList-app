import React from 'react';
import { useRouter } from 'next/router';

type CardProps = {
  id: string;
  title: string;
  description: string;
  status: number;
};

const Card: React.FC<CardProps> = ({ id, title, description, status }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/cards/${id}`); // 詳細ページに遷移
  };

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
      </div>
    </div>
  );
};

export default Card;
