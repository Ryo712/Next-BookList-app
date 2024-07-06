import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const NewsTask: React.FC = () => {
  const [newTask, setNewTask] = useState<{ title: string; description: string; author: string; url: string; coverImage: File | null }>({
    title: '',
    description: '',
    author: '',
    url: '',
    coverImage: null
  });
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const fileType = file.type;
      if (fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'image/jpg') {
        setNewTask({ ...newTask, coverImage: file });
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setNewTask({ ...newTask, coverImage: null });
        setPreview(null);
      }
    } else {
      setNewTask({ ...newTask, coverImage: null });
      setPreview(null);
    }
  };

  const handleAddTask = async () => {
    try {
      let coverImageUrl = '';
      if (newTask.coverImage) {
        const storageRef = ref(storage, `images/${newTask.coverImage.name}`);
        await uploadBytes(storageRef, newTask.coverImage);
        coverImageUrl = await getDownloadURL(storageRef);
      }

      const formData = {
        title: newTask.title,
        author: newTask.author,
        description: newTask.description,
        url: newTask.url,
        coverImage: coverImageUrl,
        status: 1, // ステータスの初期値を1に設定
      };

      // Firestoreのtasksコレクションにデータを追加
      await addDoc(collection(db, 'tasks'), formData);

      router.push('/');
    } catch (error) {
      console.error('Error uploading cover image or saving data:', error);
    }
  };

  return (
    <div style={styles.content}>
      <div style={styles.title}>Untitled</div>
      <div style={styles.property}>
        <span>著者</span>
        <input 
          type="text" 
          name="author" 
          value={newTask.author} 
          onChange={handleInputChange} 
          placeholder="Enter author"
          style={styles.input}
        />
      </div>
      <div style={styles.property}>
        <span>カバー画像</span>
        <input 
          type="file" 
          name="coverImage" 
          onChange={handleFileChange} 
          accept=".png, .jpeg, .jpg"
          style={styles.input}
        />
      </div>
      {preview && <img src={preview} alt="カバー画像のプレビュー" style={styles.preview} />}
      <div style={styles.property}>
        <span>URL</span>
        <input 
          type="text" 
          name="url" 
          value={newTask.url} 
          onChange={handleInputChange} 
          placeholder="Enter URL"
          style={styles.input}
        />
      </div>
      <div style={styles.property}>
        <span>ステータス</span>
        <div style={styles.value}>Empty</div>
      </div>
      <div style={styles.property}>
        <span>Finished</span>
        <div style={styles.value}>Empty</div>
      </div>
      <div style={styles.property}>
        <span>読了</span>
        <input type="checkbox" />
      </div>
      <div style={styles.addProperty} onClick={handleAddTask}>+ Add a property</div>
      <div style={styles.commentSection}>
        <input 
          type="text" 
          placeholder="Add a comment..."
          style={styles.commentInput}
        />
      </div>
      <div style={styles.footer}>
        Enterキーを押して空のページで続行するか、<a href="#">テンプレートを作成</a>してください。
      </div>
    </div>
  );
};

const styles = {
  content: {
    width: '80%',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: '2rem',
    color: '#bbb',
    marginBottom: '20px'
  },
  property: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px'
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginLeft: '10px'
  },
  value: {
    flex: 1,
    color: '#bbb'
  },
  addProperty: {
    color: '#666',
    marginBottom: '20px',
    cursor: 'pointer'
  },
  commentSection: {
    marginTop: '20px'
  },
  commentInput: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '10px'
  },
  preview: {
    width: '100%',
    height: 'auto',
    marginBottom: '10px'
  },
  footer: {
    color: '#666',
    marginTop: '20px'
  }
};

export default NewsTask;
