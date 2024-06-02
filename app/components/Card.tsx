import React from 'react';

const Card = () => {
  return (
    <div className="flex-1 p-6">
      <div className="relative mb-6">
        <img
          src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-ZqcV705IiqEeKO3U3m103x0t/user-WDNcSG8LmgWQjn5cbQzPzQJ0/img-4yLgZnLzHUupLqNNLoEnUPN0.png?st=2024-06-01T23%3A45%3A05Z&se=2024-06-02T01%3A45%3A05Z&sp=r&sv=2023-11-03&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-06-01T23%3A49%3A04Z&ske=2024-06-02T23%3A49%3A04Z&sks=b&skv=2023-11-03&sig=PSbIqIh7yTWIKHVbRz1NHV0%2B8I5FczFk6rC2K%2BVHhRI%3D"
          alt="Banner"
          className="w-full h-40 object-cover"
        />
        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-3xl font-bold">
            <i className="fas fa-book mr-2"></i>
            Book List
          </h1>
          <p className="text-lg">
            2023年に読みたい本やメディアをリストアップしましょう。完了したものを簡単に確認することができます。
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4 text-gray-600">
          <span>88 件</span>
          <span>▼</span>
          <span>未読</span>
          <span>▼</span>
          <span>読了</span>
          <span>▼</span>
          <span>進行中</span>
          <span>▼</span>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">New</button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {/* Book items */}
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="bg-white p-4 shadow-md">
            <img
              alt="Book cover"
              className="w-full h-32 object-cover"
              height="150"
              src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-ZqcV705IiqEeKO3U3m103x0t/user-WDNcSG8LmgWQjn5cbQzPzQJ0/img-Aw6z07u70elYkpyKOTx8QZO1.png?st=2024-06-01T23%3A45%3A05Z&se=2024-06-02T01%3A45%3A05Z&sp=r&sv=2023-11-03&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-06-01T23%3A49%3A04Z&ske=2024-06-02T23%3A49%3A04Z&sks=b&skv=2023-11-03&sig=HN8Rckuu9FurC8IxuKGL6UreFo8Q1WWosDCh4sLchBE%3D"
              width="200"
            />
            <h2 className="mt-2 text-lg font-bold">Book Title</h2>
            <p className="text-gray-600">Author Name</p>
            <div className="mt-2 text-gray-600">
              <i className="fas fa-check-square"></i>
              読了
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
