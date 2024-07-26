import React, { useContext, useEffect, useState } from 'react';
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

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUsername(userData.username);
            setEmail(userData.email);
            setProfileImage(userData.profileImage);
          } else {
            console.log('User document does not exist');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
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

  if (!user || !username || !email) {
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
          padding: 40px 20px;
          background-color: #f5f5f5;
          box-sizing: border-box;
        }

        .profile-content {
          width: 100%;
          max-width: 600px;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          box-sizing: border-box;
        }

        .profile-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          text-align: center;
        }

        .profile-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 30px;
        }

        .profile-image {
          width: 100px;
          height: 100px;
          background-color: #d1d1d1;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          color: #ffffff;
          margin-bottom: 20px;
        }

        .profile-image-img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
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
          padding: 8px;
          border: 1px solid #cccccc;
          border-radius: 4px;
          font-size: 14px;
          margin-bottom: 8px;
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
          background-color: #f0f0f0;
          border: 1px solid #cccccc;
          border-radius: 4px;
          font-size: 14px;
          color: #333333;
          cursor: pointer;
          transition: background-color 0.3s;
          margin-right: 8px;
          display: inline-block;
          margin-top: 10px;
        }

        .button:hover {
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
              'R'
            )}
          </div>
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
                <button className="button" onClick={() => setIsEditing(false)}>Cancel</button>
              </>
            ) : (
              <>
                <p className="profile-info-text">{username}</p>
                <button className="button" onClick={() => setIsEditing(true)}>Edit</button>
              </>
            )}
            <input
              type="file"
              id="profileImageInput"
              style={{ display: 'none' }}
              onChange={(e) =>
                setProfileImageFile(e.target.files ? e.target.files[0] : null)
              }
            />
            <label htmlFor="profileImageInput" className="profile-link">Add photo</label>
            {profileImageFile && (
              <button className="button" onClick={handleProfileImageChange}>Update Profile Image</button>
            )}
          </div>
        </div>
        <h2 className="security-title">Account security</h2>
        <div className="security-section">
          <div className="security-item">
            <div>
              <label className="security-label">Email</label>
              <p className="security-info">{email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
