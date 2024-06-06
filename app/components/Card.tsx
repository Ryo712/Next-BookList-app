// Card.tsx
import React from 'react';

interface Book {
  id: string;
  title: string;
  description: string;
  status: number;
  author: string;
  url: string;
}

interface CardProps {
  books: Book[];
  onCheckboxChange: (id: string, newStatus: number) => void;
}

const Card: React.FC<CardProps> = ({ books, onCheckboxChange }) => {
  const handleChange = (id: string, checked: boolean) => {
    const newStatus = checked ? 3 : 0; // 例として、チェックが入っていればステータス3（完了）に、外れていれば0（未完了）に設定
    onCheckboxChange(id, newStatus);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="p-6">
          <div className="relative">
            <img
              alt="Books Banner"
              className="w-full h-64 object-cover"
              height="300"
              src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-ZqcV705IiqEeKO3U3m103x0t/user-WDNcSG8LmgWQjn5cbQzPzQJ0/img-y08NV0KlfFMR9nS3F4da3eK9.png?st=2024-06-02T07%3A58%3A30Z&se=2024-06-02T09%3A58%3A30Z&sp=r&sv=2023-11-03&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-06-01T23%3A39%3A09Z&ske=2024-06-02T23%3A39%3A09Z&sks=b&skv=2023-11-03&sig=u1DR8cgMzBxk68m9wvFV1SrR5P4SuELN9PYska76V4U%3D"
              width="1200"
            />
          </div>
          <h2 className="text-2xl font-bold flex items-center mt-4">
            <i className="fas fa-book mr-2"></i>
            Book List
          </h2>
          <p className="text-gray-600 mt-2">
            2023年に読みたい本やメディアをリストアップしましょう。完了したものを簡単に確認することができます。
          </p>
          
          {/* Book List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {books.map((book: Book, index: number) => (
              <div key={index} className="bg-white shadow rounded-lg overflow-hidden">
                <img
                  alt="Book Cover"
                  className="w-full h-48 object-cover"
                  height="200"
                  src={book.url}
                  width="300"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold">{book.title}</h3>
                  <p className="text-gray-600">{book.author}</p>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={book.status === 3}
                      onChange={(e) => handleChange(book.id, e.target.checked)}
                      className="mr-2"
                    />
                    <span>読了</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;