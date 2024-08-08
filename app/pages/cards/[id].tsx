import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../../firebaseConfig';
import { doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

const EditTask: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [editTask, setEditTask] = useState<{ title: string; description: string; author: string; url: string; coverImage: File | null }>({
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

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchData(user);
      } else {
        toast.error('User not authenticated');
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [id]);

  const fetchData = async (user: User) => {
    if (id) {
      try {
        const docRef = doc(db, 'tasks', id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEditTask({
            title: data.title || '',
            description: data.description || '',
            author: data.author || '',
            url: data.url || '',
            coverImage: null
          });
          setPreview(data.coverImage || null);
        } else {
          toast.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching task:', error);
        toast.error('Failed to fetch task.');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditTask({ ...editTask, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const fileType = file.type;
      if (fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'image/jpg') {
        setEditTask({ ...editTask, coverImage: file });
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setEditTask({ ...editTask, coverImage: null });
        setPreview(null);
      }
    } else {
      setEditTask({ ...editTask, coverImage: null });
      setPreview(null);
    }
  };

  const handleSaveTask = async () => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    try {
      let coverImageUrl = preview;
      if (editTask.coverImage) {
        const storageRef = ref(storage, `images/${editTask.coverImage.name}`);
        await uploadBytes(storageRef, editTask.coverImage);
        coverImageUrl = await getDownloadURL(storageRef);
      }

      const formData = {
        title: editTask.title,
        author: editTask.author,
        description: editTask.description,
        url: editTask.url,
        coverImage: coverImageUrl,
        status: 1,
        updatedAt: new Date(),
      };

      const docRef = doc(db, 'tasks', id as string);
      await updateDoc(docRef, formData);

      toast.success('Task updated successfully!');
      router.push('/');
    } catch (error) {
      console.error('Error uploading cover image or saving data:', error);
      toast.error('Failed to update task.');
    }
  };

  const handleDeleteTask = async () => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const docRef = doc(db, 'tasks', id as string);
      await deleteDoc(docRef);

      toast.success('Task deleted successfully!');
      router.push('/');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task.');
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
              value={editTask.title}
              onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
              onBlur={() => setIsEditingTitle(false)}
              style={styles.titleInput}
              autoFocus
            />
          ) : (
            <h1
              style={{ ...styles.title, color: editTask.title ? '#000' : '#bbb' }}
              onClick={() => setIsEditingTitle(true)}
            >
              {editTask.title || 'Untitled'}
            </h1>
          )}
        </div>
        <div style={styles.property}>
          <span style={styles.propertyLabel}>Author</span>
          {isEditingAuthor ? (
            <input
              type="text"
              name="author"
              value={editTask.author}
              onChange={handleInputChange}
              onBlur={() => setIsEditingAuthor(false)}
              style={styles.input}
              autoFocus
            />
          ) : (
            <div
              style={{ ...styles.value, color: editTask.author ? '#000' : '#bbb' }}
              onClick={() => setIsEditingAuthor(true)}
            >
              {editTask.author || 'Empty'}
            </div>
          )}
        </div>
        <div style={styles.property}>
          <span style={styles.propertyLabel}>Cover Image</span>
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
              value={editTask.url}
              onChange={handleInputChange}
              onBlur={() => setIsEditingURL(false)}
              style={styles.input}
              autoFocus
            />
          ) : (
            <div
              style={{ ...styles.value, color: editTask.url ? '#000' : '#bbb' }}
              onClick={() => setIsEditingURL(true)}
            >
              {editTask.url || 'Empty'}
            </div>
          )}
        </div>
        <div style={styles.property}>
          <span style={styles.propertyLabel}>Description</span>
          {isEditingDescription ? (
            <input
              type="text"
              name="description"
              value={editTask.description}
              onChange={handleInputChange}
              onBlur={() => setIsEditingDescription(false)}
              style={styles.input}
              autoFocus
            />
          ) : (
            <div
              style={{ ...styles.value, color: editTask.description ? '#000' : '#bbb' }}
              onClick={() => setIsEditingDescription(true)}
            >
              {editTask.description || 'Add a comment...'}
            </div>
          )}
        </div>
        
        <div style={styles.buttonContainer}>
          <button style={styles.saveButton} onClick={handleSaveTask}>
            Save
          </button>
          <button style={styles.deleteButton} onClick={handleDeleteTask}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    overflowY: 'auto',
    backgroundColor: '#f7f8fa',
    height: '100vh',
    width: '100vw',
  },
  content: {
    width: '100%',
    maxWidth: '800px',
    padding: '40px',
    fontFamily: 'sans-serif',
    backgroundColor: 'transparent',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    width: '100%',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    borderBottom: '1px solid #ddd',
    paddingBottom: '5px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
  },
  titleInput: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#000',
    border: 'none',
    outline: 'none',
    width: '100%',
    borderBottom: '1px solid #ddd',
    paddingBottom: '5px',
    backgroundColor: 'transparent',
  },
  property: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    minHeight: '40px',  // 高さを固定
  },
  propertyLabel: {
    minWidth: '80px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginLeft: '10px',
    height: '40px',  // 高さを固定
  },
  value: {
    flex: 1,
    color: '#000',
    marginLeft: '10px',
    cursor: 'pointer',
    height: '40px',  // 高さを固定
    display: 'flex',
    alignItems: 'center',  // テキストを中央に配置
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
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginRight: '10px',
  },
  footer: {
    color: '#666',
    marginTop: '20px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end', 
    gap: '10px', 
    marginTop: '20px',
  },
  saveButton: {
    padding: '8px 16px',
    backgroundColor: '#f5f5f5',
    color: '#333',
    border: '1px solid #ccc',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s',
  },
  saveButtonHover: {
    backgroundColor: '#e0e0e0',
  },
  deleteButton: {
    padding: '8px 16px',
    backgroundColor: '#f5f5f5',
    color: '#d32f2f',
    border: '1px solid #ccc',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s',
  },
  deleteButtonHover: {
    backgroundColor: '#e0e0e0',
  },
};

export default EditTask;
