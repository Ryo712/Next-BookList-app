import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Item } from '../models/item';

const ItemList = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await axios.get('/api/items');
      console.log("response", response);
      setItems(response.data);
    };
    fetchItems();
  }, []);

  return (
    <div>
      リスト
      {items.map(item => (
        <div key={item.id} className="border p-4">
          <h2>{item.name}</h2>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ItemList;
