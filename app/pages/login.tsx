import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase auth の関数をインポート
import { auth, signInWithEmail } from '../lib/firebase/apis/auth'; // 修正ポイント
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const Logins: React.FC = () => {
  const { handleSubmit, register } = useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
      const res = await signInWithEmail({ email, password });
      if (res) {
        console.log('ログイン成功');
        setErrorMessage(''); // 成功したらエラーメッセージをクリア
        router.push('/');
      } else {
        console.log('ログイン失敗');
        setErrorMessage('Login failed. Please check your email and password.');
      }
    } catch (error) {
      console.error('ログインエラー:', error);
      setErrorMessage('An error occurred during login. Please try again.'); // ネットワークエラー時のメッセージ
    }
  });

  const handleGuestLogin = async () => {
    try {
      const guestEmail = process.env.NEXT_PUBLIC_GUEST_ACCOUNT_EMAIL!;
      const guestPassword = process.env.NEXT_PUBLIC_GUEST_ACCOUNT_PASSWORD!;

      const res = await signInWithEmailAndPassword(
        auth,
        guestEmail,
        guestPassword
      ); // ここで signInWithEmailAndPassword と auth を使用
      if (res) {
        console.log('ゲストログイン成功');
        setErrorMessage(''); // 成功したらエラーメッセージをクリア
        router.push('/');
      } else {
        console.log('ゲストログイン失敗');
        setErrorMessage('Guest login failed.');
      }
    } catch (error) {
      console.error('ゲストログインエラー:', error);
      setErrorMessage(
        'An error occurred during guest login. Please try again.'
      ); // ネットワークエラー時のメッセージ
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Think it. Make it.</h1>
      <h2 style={styles.subtitle}>Log in to your Book List account</h2>
      <form onSubmit={onSubmit} style={styles.form}>
        {errorMessage && <div style={styles.error}>{errorMessage}</div>}
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="email">
            Email
          </label>
          <input
            style={styles.input}
            type="email"
            id="email"
            placeholder="Enter your email address..."
            {...register('email', { required: true })}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="password">
            Password
          </label>
          <input
            style={styles.input}
            type={passwordVisible ? 'text' : 'password'}
            id="password"
            placeholder="Enter your password..."
            {...register('password', { required: true })}
          />
          <FontAwesomeIcon
            icon={passwordVisible ? faEye : faEyeSlash}
            style={styles.togglePassword}
            onClick={togglePasswordVisibility}
          />
        </div>
        <button style={styles.loginButton} type="submit">
          Login
        </button>
        <div style={styles.footer}>
          Join us today!
          <Link href="/register" passHref>
            <span style={styles.link}>Register here</span>
          </Link>
        </div>
        <div style={styles.guestAccessText}>Guest access available below.</div>{' '}
        {/* ガイドテキストを追加 */}
        <button style={styles.guestButton} onClick={handleGuestLogin}>
          Guest Login
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center' as 'center',
    width: '100%',
    padding: '20px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    height: '100vh',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 700,
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#888',
    fontWeight: 'normal' as 'normal',
    marginTop: '0',
    marginBottom: '20px',
  },
  form: {
    width: '100%',
    maxWidth: '400px',
  },
  error: {
    color: 'red',
    marginBottom: '20px',
  },
  inputGroup: {
    textAlign: 'left' as 'left',
    marginTop: '20px',
    position: 'relative' as 'relative',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 600,
  },
  input: {
    width: '100%',
    padding: '12px 10px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box' as 'border-box',
    marginBottom: '10px',
  },
  togglePassword: {
    position: 'absolute' as 'absolute',
    top: '50%',
    right: '10px',
    transform: 'translateY(20%)',
    cursor: 'pointer' as 'pointer',
  },
  loginButton: {
    backgroundColor: '#065fd4',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '12px',
    fontSize: '1.25rem',
    cursor: 'pointer' as 'pointer',
    width: '100%',
    marginTop: '20px',
  },

  guestAccessText: {
    fontSize: '0.875rem',
    color: '#888',
    marginTop: '10px',
    marginBottom: '5px',
    textAlign: 'center' as 'center',
  },

  guestButton: {
    backgroundColor: '#FD7E14',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '12px',
    fontSize: '1.25rem',
    cursor: 'pointer' as 'pointer',
    width: '100%',
    marginTop: '15px',
  },
  footer: {
    fontSize: '0.75rem',
    color: '#888',
    marginTop: '20px',
    whiteSpace: 'pre-wrap' as 'pre-wrap',
    textAlign: 'center' as 'center',
    maxWidth: '400px',
  },
  link: {
    color: '#065fd4',
    cursor: 'pointer' as 'pointer',
    textDecoration: 'underline',
    marginLeft: '5px',
  },
};

export default Logins;
