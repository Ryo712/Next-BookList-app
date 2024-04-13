//pages/api/tasks.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../firebaseConfig'; // firebaseConfig.ts をインポート
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore'; // Firestore モジュールから必要なメソッドをインポート

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { title, description, status } = req.body;

      const data = {
        title,
        description,
        status: 1,
      };

      await addDoc(collection(db, 'tasks'), data); 

      res.status(201).json({ message: 'Data saved successfully' });
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ error: 'Failed to save data' });
    }
  } else if (req.method === 'GET') {
    try {
      let tasksSnapshot;
      if (req.url === '/unread') {
        // ステータスが1のタスクのみをクエリ
        const q = query(collection(db, 'tasks'), where('status', '==', 1));
        tasksSnapshot = await getDocs(q);
      } else if (req.url === '/reading') {
        // ステータスが2のタスクのみをクエリ
        const q = query(collection(db, 'tasks'), where('status', '==', 2));
        tasksSnapshot = await getDocs(q);
      } else if (req.url === '/read') {
        // ステータスが3のタスクのみをクエリ
        const q = query(collection(db, 'tasks'), where('status', '==', 3));
        tasksSnapshot = await getDocs(q);
      } else {
        // それ以外の場合はすべてのタスクを取得
        tasksSnapshot = await getDocs(collection(db, 'tasks'));
      }

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
