import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
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
  const [isEditingAuthor, setIsEditingAuthor] = useState(false);
  const [isEditingURL, setIsEditingURL] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
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
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
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

        // Firestoreのユーザーサブコレクションにデータを追加
        await addDoc(collection(db, 'users', user.uid, 'tasks'), formData);

        router.push('/');
      } catch (error) {
        console.error('Error uploading cover image or saving data:', error);
      }
    } else {
      console.error('User not authenticated');
    }
  };

  const handleAddFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={styles.container}>
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
          {isEditingAuthor ? (
            <input
              type="text"
              name="author"
              value={newTask.author}
              onChange={handleInputChange}
              onBlur={() => setIsEditingAuthor(false)}
              style={styles.input}
              autoFocus
            />
          ) : (
            <div
              style={{ ...styles.value, color: newTask.author ? '#000' : '#bbb' }}
              onClick={() => setIsEditingAuthor(true)}
            >
              {newTask.author || 'Empty'}
            </div>
          )}
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
          {isEditingURL ? (
            <input
              type="text"
              name="url"
              value={newTask.url}
              onChange={handleInputChange}
              onBlur={() => setIsEditingURL(false)}
              style={styles.input}
              autoFocus
            />
          ) : (
            <div
              style={{ ...styles.value, color: newTask.url ? '#000' : '#bbb' }}
              onClick={() => setIsEditingURL(true)}
            >
              {newTask.url || 'Empty'}
            </div>
          )}
        </div>
        <div style={styles.property}>
          <span style={styles.propertyLabel}>説明</span>
          {isEditingDescription ? (
            <input
              type="text"
              name="description"
              value={newTask.description}
              onChange={handleInputChange}
              onBlur={() => setIsEditingDescription(false)}
              style={styles.input}
              autoFocus
            />
          ) : (
            <div
              style={{ ...styles.value, color: newTask.description ? '#000' : '#bbb' }}
              onClick={() => setIsEditingDescription(true)}
            >
              {newTask.description || 'Add a comment...'}
            </div>
          )}
        </div>
        
        <button style={styles.saveButton} onClick={handleAddTask}>
          Save
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  content: {
    width: '80%',
    maxWidth: '800px',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: 'transparent',
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
    backgroundColor: '#f0f0f0',
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
    backgroundColor: '#f0f0f0',
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
    cursor: 'pointer',
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
    marginRight: '10px',
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
