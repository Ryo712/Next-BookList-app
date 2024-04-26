import React from 'react';

type CardProps = {
  id: string | number;
  title: string;
  description: string;
  status: string;
};

const Card: React.FC<CardProps> = ({ id, title, description, status }) => {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4">
      <div className="p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{description}</p>
        <p>Status: {status}</p> {/* status を表示 */}
      </div>
    </div>
  );
};

export default Card;
