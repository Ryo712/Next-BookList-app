import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { signInWithEmail } from '../lib/firebase/apis/auth';

const Logins: React.FC = () => {
    const { handleSubmit, register } = useForm();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter();

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

    const onSubmit = handleSubmit(async ({ email, password }) => {
        try {
            const res = await signInWithEmail({ email, password });
            if (res) {
                console.log('ログイン成功');
                setShowPopup(true);
                router.push('/');
            } else {
                console.log('ログイン失敗');
            }
        } catch (error) {
            console.error('ログインエラー:', error);
        }
    });

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Think it. Make it.</h1>
            <h2 style={styles.subtitle}>Log in to your Book-List account</h2>
            <form onSubmit={onSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label style={styles.label} htmlFor="email">Email</label>
                    <input
                        style={styles.input}
                        type="email"
                        id="email"
                        placeholder="Enter your email address..."
                        {...register('email', { required: true })}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label} htmlFor="password">Password</label>
                    <input
                        style={styles.input}
                        type={passwordVisible ? "text" : "password"}
                        id="password"
                        placeholder="Enter your password..."
                        {...register('password', { required: true })}
                    />
                    <img
                        src={passwordVisible ? "https://img.icons8.com/ios-glyphs/30/000000/visible--v1.png" : "https://img.icons8.com/ios-glyphs/30/000000/invisible.png"}
                        alt="toggle visibility"
                        style={styles.togglePassword}
                        onClick={togglePasswordVisibility}
                    />
                </div>
                <button style={styles.loginButton} type="submit">Login</button>
            </form>
            <div style={styles.footer}>
                Your name and photo are displayed to users who invite you to a workspace using your email. By continuing, you acknowledge that you understand and agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>.
            </div>
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
        top: '36px',
        right: '10px',
        cursor: 'pointer' as 'pointer',
    },
    loginButton: {
        backgroundColor: '#065fd4',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '12px',
        fontSize: '1rem',
        cursor: 'pointer' as 'pointer',
        width: '100%',
        marginTop: '20px',
    },
    footer: {
        fontSize: '0.75rem',
        color: '#888',
        marginTop: '20px',
        whiteSpace: 'pre-wrap' as 'pre-wrap',
        textAlign: 'center' as 'center',
        maxWidth: '400px',
    }
};

export default Logins;
