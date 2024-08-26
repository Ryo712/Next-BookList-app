import React from 'react';
import { useRouter } from 'next/router';

interface Book {
  id: string;
  title: string;
  description: string;
  status: number;
  author: string;
  url: string;
  coverImage: string;
}

interface CardProps {
  books: Book[];
  onCheckboxChange: (id: string, newStatus: number) => void;
}

const Card: React.FC<CardProps> = ({ books, onCheckboxChange }) => {
  const router = useRouter();

  const handleCardClick = (id: string, event: React.MouseEvent) => {
    // チェックボックスをクリックした場合は詳細画面に遷移しない
    if ((event.target as HTMLElement).tagName !== 'INPUT') {
      router.push(`/cards/${id}`);
    }
  };

  const handleChange = (id: string, checked: boolean) => {
    const newStatus = checked ? 3 : 2; // チェックが入っていればステータス3（完了）、外れていればステータス2に設定
    onCheckboxChange(id, newStatus);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {books.map((book: Book, index: number) => (
            <div
              key={index}
              className="bg-white shadow rounded-lg overflow-hidden min-w-[250px] cursor-pointer"
              onClick={(event) => handleCardClick(book.id, event)}
            >
              <img
                alt="Book Cover"
                className="w-full h-48 object-cover"
                height="200"
                src={book.coverImage} // coverImageを使用
                width="300"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold">{book.title}</h3>
                <p className="text-gray-600">{book.author}</p>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={book.status === 3}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleChange(book.id, e.target.checked);
                    }}
                    className="mr-2"
                  />
                  <span>Read</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
