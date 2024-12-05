import React, { useState } from 'react';
import axios from 'axios';

const ItemForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/items', { name, description });
    setName('');
    setDescription('');
    // リストを更新する処理を追加
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="border p-2"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="border p-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2">
        Add Item
      </button>
    </form>
  );
};

export default ItemForm;
