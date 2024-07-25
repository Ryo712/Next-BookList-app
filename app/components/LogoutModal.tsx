import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseCircleXmark } from '@fortawesome/free-solid-svg-icons';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <FontAwesomeIcon icon={faHouseCircleXmark} style={styles.icon} />
        <h1 style={styles.title}>Log out of your account?</h1>
        <p style={styles.message}>You will need to log back in to access your Book-List account.</p>
        <div style={styles.buttonContainer}>
          <button onClick={onLogout} style={{ ...styles.button, ...styles.logoutButton }}>Log out</button>
          <button onClick={onClose} style={{ ...styles.button, ...styles.cancelButton }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    textAlign: 'center' as 'center',
    width: '400px',
  },
  icon: {
    width: '48px',
    height: '48px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '20px',
    marginBottom: '10px',
  },
  message: {
    color: '#666',
    marginBottom: '20px',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    gap: '10px',
  },
  button: {
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer' as 'pointer',
    fontSize: '16px',
  },
  logoutButton: {
    backgroundColor: '#ff6b6b',
    color: 'white',
  },
  cancelButton: {
    backgroundColor: 'white',
    color: '#666',
    border: '1px solid #ccc',
  },
};

export default LogoutModal;
