import React, { useState, CSSProperties } from 'react';
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
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [isAuthorEditing, setIsAuthorEditing] = useState(false);
  const [isURLEditing, setIsURLEditing] = useState(false);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
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

  const handleTitleClick = () => {
    setIsTitleEditing(true);
  };

  const handleTitleBlur = () => {
    setIsTitleEditing(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask({ ...newTask, title: e.target.value });
  };

  const handleAuthorClick = () => {
    setIsAuthorEditing(true);
  };

  const handleAuthorBlur = () => {
    setIsAuthorEditing(false);
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask({ ...newTask, author: e.target.value });
  };

  const handleURLClick = () => {
    setIsURLEditing(true);
  };

  const handleURLBlur = () => {
    setIsURLEditing(false);
  };

  const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask({ ...newTask, url: e.target.value });
  };

  const handleDescriptionClick = () => {
    setIsDescriptionEditing(true);
  };

  const handleDescriptionBlur = () => {
    setIsDescriptionEditing(false);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask({ ...newTask, description: e.target.value });
  };

  return (
    <div style={styles.content}>
      <div style={styles.titleContainer}>
        {isTitleEditing || newTask.title ? (
          <input
            type="text"
            name="title"
            value={newTask.title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            autoFocus
            style={styles.titleInput}
            placeholder="Untitled"
          />
        ) : (
          <span style={styles.title} onClick={handleTitleClick}>
            Untitled
          </span>
        )}
      </div>
      <div style={styles.property}>
        <span style={styles.label}>著者</span>
        {isAuthorEditing ? (
          <input
            type="text"
            name="author"
            value={newTask.author}
            onChange={handleAuthorChange}
            onBlur={handleAuthorBlur}
            autoFocus
            style={styles.inputEditing}
          />
        ) : (
          <div style={newTask.author ? styles.valueFilled : styles.value} onClick={handleAuthorClick}>
            {newTask.author || 'Empty'}
          </div>
        )}
      </div>
      <div style={styles.property}>
        <span style={styles.label}>カバー画像</span>
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
        <span style={styles.label}>URL</span>
        {isURLEditing ? (
          <input
            type="text"
            name="url"
            value={newTask.url}
            onChange={handleURLChange}
            onBlur={handleURLBlur}
            autoFocus
            style={styles.inputEditing}
          />
        ) : (
          <div style={newTask.url ? styles.valueFilled : styles.value} onClick={handleURLClick}>
            {newTask.url || 'Empty'}
          </div>
        )}
      </div>
      <div style={styles.property}>
        <span style={styles.label}>説明</span>
        {isDescriptionEditing ? (
          <input
            type="text"
            name="description"
            value={newTask.description}
            onChange={handleDescriptionChange}
            onBlur={handleDescriptionBlur}
            autoFocus
            style={styles.inputEditing}
          />
        ) : (
          <div style={newTask.description ? styles.valueFilled : styles.value} onClick={handleDescriptionClick}>
            {newTask.description || 'Empty'}
          </div>
        )}
      </div>
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
      <button style={styles.saveButton} onClick={handleAddTask}>Save</button>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  content: {
    width: '80%',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
  },
  titleContainer: {
    marginBottom: '20px',
  },
  title: {
    fontSize: '2rem',
    color: '#bbb',
    cursor: 'pointer',
  },
  titleInput: {
    width: '100%',
    fontSize: '2rem',
    color: '#333',
    border: 'none',
    outline: 'none',
  },
  property: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    position: 'relative',
  },
  label: {
    width: '100px', // ラベルの幅を固定
    color: '#666',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginLeft: '10px',
  },
  inputEditing: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginLeft: '10px',
    color: '#000',
  },
  value: {
    flex: 1,
    color: '#bbb',
    cursor: 'pointer',
    marginLeft: '10px', // インプットと同じマージンを適用
  },
  valueFilled: {
    flex: 1,
    color: '#000',
    cursor: 'pointer',
    marginLeft: '10px', // インプットと同じマージンを適用
  },
  commentSection: {
    marginTop: '20px',
  },
  commentInput: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '10px',
  },
  preview: {
    width: '100%',
    height: 'auto',
    marginBottom: '10px',
  },
  footer: {
    color: '#666',
    marginTop: '20px',
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px',
    display: 'block',
    width: '100%',
  },
};

export default NewsTask;
