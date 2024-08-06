import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faCamera } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from './_app';
import { db, storage } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Profile: React.FC = () => {
  const user = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUsername(userData.username || 'No Name');
            setEmail(userData.email || 'No Email');
            setProfileImage(userData.profileImage || null);
          } else {
            console.log('User document does not exist');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleProfileImageChange = async () => {
    if (profileImageFile && user) {
      try {
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(storageRef, profileImageFile);
        const profileImageUrl = await getDownloadURL(storageRef);

        await updateDoc(doc(db, 'users', user.uid), {
          profileImage: profileImageUrl,
        });

        setProfileImage(profileImageUrl);
        setIsEditing(false);
        console.log('Profile image updated');
      } catch (error) {
        console.error('Error updating profile image:', error);
      }
    }
  };

  const handleUsernameChange = async () => {
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          username: username,
        });
        setIsEditing(false);
        console.log('Username updated');
      } catch (error) {
        console.error('Error updating username:', error);
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100vw;
          background: #ffffff;
          box-sizing: border-box;
        }

        .profile-content {
          text-align: center;
          width: 100%;
          max-width: 400px;
          padding: 40px 30px;
          box-sizing: border-box;
        }

        .profile-title {
          font-size: 28px;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
        }

        .profile-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 30px;
        }

        .profile-image {
          width: 120px;
          height: 120px;
          background-color: #e0e0e0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          color: #ffffff;
          margin-bottom: 10px;
          position: relative;
          overflow: hidden;
        }

        .profile-image-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .edit-icon {
          position: absolute;
          bottom: 0;
          right: 0;
          left: 0;
          top: 0;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .edit-icon .fa-camera {
          font-size: 24px;
        }

        .profile-info {
          text-align: center;
        }

        .profile-label {
          display: block;
          font-size: 14px;
          color: #666666;
          margin-bottom: 8px;
        }

        .profile-input {
          width: 100%;
          max-width: 300px;
          padding: 10px;
          border: 1px solid #cccccc;
          border-radius: 4px;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .profile-link {
          font-size: 14px;
          color: #007bff;
          text-decoration: none;
          cursor: pointer;
          margin-bottom: 20px;
        }

        .profile-link:hover {
          text-decoration: underline;
        }

        .security-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .security-section {
          text-align: center;
          width: 100%;
          margin-bottom: 20px;
        }

        .security-item {
          margin-bottom: 20px;
        }

        .security-label {
          font-size: 14px;
          color: #666666;
          margin-bottom: 4px;
        }

        .security-info {
          font-size: 14px;
          color: #333333;
        }

        .button {
          padding: 8px 16px;
          background-color: #ffffff;
          border: 1px solid #dcdcdc;
          border-radius: 4px;
          font-size: 14px;
          color: #333333;
          cursor: pointer;
          transition: background-color 0.3s, box-shadow 0.3s;
          margin-right: 8px;
          display: inline-block;
          margin-top: 10px;
        }

        .button:hover {
          background-color: #f5f5f5;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        }

        .button-secondary {
          background-color: #f0f0f0;
          color: #333;
        }

        .button-secondary:hover {
          background-color: #e0e0e0;
        }
      `}</style>
      <div className="profile-content">
        <h1 className="profile-title">My profile</h1>
        <div className="profile-section">
          <div className="profile-image">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="profile-image-img" />
            ) : (
              <FontAwesomeIcon icon={faUserCircle} className="text-9xl" />
            )}
            <label htmlFor="profileImageInput" className="edit-icon">
              <FontAwesomeIcon icon={faCamera} className="fa-camera" />
            </label>
          </div>
          <input
            type="file"
            id="profileImageInput"
            style={{ display: 'none' }}
            onChange={(e) =>
              setProfileImageFile(e.target.files ? e.target.files[0] : null)
            }
          />
          {profileImageFile && (
            <button className="button" onClick={handleProfileImageChange}>Update Profile Image</button>
          )}
          <div className="profile-info">
            <label htmlFor="preferredName" className="profile-label">User name</label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  id="preferredName"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="profile-input"
                />
                <button className="button" onClick={handleUsernameChange}>Save</button>
                <button className="button button-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
              </>
            ) : (
              <>
                <p className="profile-info-text">{username}</p>
                <button className="button" onClick={() => setIsEditing(true)}>Edit</button>
              </>
            )}
          </div>
        </div>
        <div className="security-section">
          <div className="security-item">
          <div>
            <label className="security-label">Email</label>
            <p className="security-info" style={{ fontSize: '16px' }}>{email}</p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
