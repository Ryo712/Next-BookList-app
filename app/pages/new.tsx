import React, { useState, useRef } from 'react';
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
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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

  const handleAddFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={styles.content}>
      <div style={styles.titleContainer}>
        {isEditingTitle ? (
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            onBlur={() => setIsEditingTitle(false)}
            style={styles.titleInput}
            autoFocus
          />
        ) : (
          <div
            style={{ ...styles.title, color: newTask.title ? '#000' : '#bbb' }}
            onClick={() => setIsEditingTitle(true)}
          >
            {newTask.title || 'Untitled'}
          </div>
        )}
      </div>
      <div style={styles.property}>
        <span style={styles.propertyLabel}>著者</span>
        <input
          type="text"
          name="author"
          value={newTask.author}
          onChange={handleInputChange}
          placeholder="著者名を入力"
          style={styles.input}
        />
      </div>
      <div style={styles.property}>
        <span style={styles.propertyLabel}>カバー画像</span>
        <div style={styles.coverImageContainer}>
          {preview && <img src={preview} alt="カバー画像のプレビュー" style={styles.preview} />}
          <div style={styles.addFileContainer} onClick={handleAddFileClick}>
            Add a file or image
          </div>
          <input
            type="file"
            name="coverImage"
            onChange={handleFileChange}
            accept=".png, .jpeg, .jpg"
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
        </div>
      </div>
      <div style={styles.property}>
        <span style={styles.propertyLabel}>URL</span>
        <input
          type="text"
          name="url"
          value={newTask.url}
          onChange={handleInputChange}
          placeholder="URLを入力"
          style={styles.input}
        />
      </div>
      <div style={styles.property}>
        <span style={styles.propertyLabel}>説明</span>
        <input
          type="text"
          name="description"
          value={newTask.description}
          onChange={handleInputChange}
          placeholder="説明を入力"
          style={styles.input}
        />
      </div>
      
      <div style={styles.footer}>
        Enterキーを押して空のページで続行するか、<a href="#">テンプレートを作成</a>してください。
      </div>
      <button style={styles.saveButton} onClick={handleAddTask}>
        Save
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  content: {
    width: '80%',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    width: '100%',
  },
  title: {
    fontSize: '2rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  },
  titleInput: {
    fontSize: '2rem',
    color: '#000',
    border: 'none',
    outline: 'none',
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  property: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  propertyLabel: {
    minWidth: '100px',
    color: '#666',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginLeft: '10px',
  },
  value: {
    flex: 1,
    color: '#000',
    marginLeft: '10px',
  },
  coverImageContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  addFileContainer: {
    marginLeft: '10px',
    color: '#007bff',
    cursor: 'pointer',
  },
  preview: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  footer: {
    color: '#666',
    marginTop: '20px',
  },
  saveButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

export default NewsTask;