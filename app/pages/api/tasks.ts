// next/pages/api/tasks.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../firebaseConfig'; // firebaseConfig.ts をインポート
import { collection, getDocs, addDoc } from 'firebase/firestore'; // Firestore モジュールから collection メソッドをインポート

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { title, description, status } = req.body;

      const data = {
        title,
        description,
        status: 1,
      };

      await addDoc(collection(db, 'tasks'), data); // Firestore の collection メソッドを使用してコレクションを参照

      res.status(201).json({ message: 'Data saved successfully' });
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ error: 'Failed to save data' });
    }
  } else if (req.method === 'GET') {
    try {
      const tasksSnapshot = await getDocs(collection(db, 'tasks')); // Firestore の collection メソッドを使用してコレクションを参照
      const data = tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
