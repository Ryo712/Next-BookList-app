import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { signUpWithEmail } from '../lib/firebase/apis/auth';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Registers: React.FC = () => {
  const { handleSubmit, register } = useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const router = useRouter();
  const auth = getAuth();

  const onSubmit = handleSubmit(async (data) => {
    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Firestoreにユーザー情報を保存
      await setDoc(doc(db, 'users', user.uid), {
        username: data.username,
        email: data.email,
        profileImage: '', // 初期値として空のプロフィール画像URL
        createdAt: new Date(),
      });

      console.log('新規登録成功');
      router.push('/');
    } catch (error) {
      console.log('新規登録失敗', error);
    }
  });

  const togglePasswordVisibility = (id: string) => {
    if (id === 'password') {
      setPasswordVisible(!passwordVisible);
    } else if (id === 'confirmPassword') {
      setConfirmVisible(!confirmVisible);
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.title}>Think it. Make it.</h1>
        <h2 style={styles.subtitle}>Create your Book-List account</h2>
        <form onSubmit={onSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email address..."
              {...register('email')}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username..."
              {...register('username')}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              placeholder="Enter your password..."
              {...register('password')}
              style={styles.input}
            />
            <img
              src={
                passwordVisible
                  ? 'https://img.icons8.com/ios-filled/16/000000/visible.png'
                  : 'https://img.icons8.com/ios-filled/16/000000/invisible.png'
              }
              alt="toggle visibility"
              style={styles.togglePassword}
              onClick={() => togglePasswordVisibility('password')}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type={confirmVisible ? 'text' : 'password'}
              id="confirmPassword"
              placeholder="Confirm your password..."
              {...register('confirmPassword')}
              style={styles.input}
            />
            <img
              src={
                confirmVisible
                  ? 'https://img.icons8.com/ios-filled/16/000000/visible.png'
                  : 'https://img.icons8.com/ios-filled/16/000000/invisible.png'
              }
              alt="toggle visibility"
              style={styles.togglePassword}
              onClick={() => togglePasswordVisibility('confirmPassword')}
            />
          </div>
          <button type="submit" style={styles.continueButton}>
            Continue
          </button>
        </form>
        <div style={styles.footer}>
          Your name and photo are displayed to users who invite you to a workspace using your email. By continuing, you acknowledge that you understand and agree to the{' '}
          <a href="#" style={styles.footerLink}>
            Terms & Conditions
          </a>{' '}
          and{' '}
          <a href="#" style={styles.footerLink}>
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  );
};

const styles = {
  body: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    color: '#333',
  },
  container: {
    textAlign: 'center' as const,
    maxWidth: '400px',
    width: '100%',
    padding: '20px',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 700,
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#888',
    fontWeight: 'normal' as const,
    marginTop: '5px',
    marginBottom: '20px',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    textAlign: 'left' as const,
    marginTop: '20px',
    position: 'relative' as const,
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box' as const,
    marginBottom: '10px',
  },
  togglePassword: {
    position: 'absolute' as const,
    top: '36px',
    right: '10px',
    cursor: 'pointer',
  },
  continueButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '10px',
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%',
    marginTop: '20px',
  },
  footer: {
    fontSize: '0.75rem',
    color: '#888',
    marginTop: '20px',
  },
  footerLink: {
    color: '#007bff',
    textDecoration: 'none' as const,
  },
};

export default Registers;
