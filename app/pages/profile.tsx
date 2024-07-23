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

  const buttonStyle = {
    margin: '5px',
    padding: '10px 15px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#f0f0f0',
    cursor: 'pointer',
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div>
        <label>Username: </label>
        {isEditing ? (
          <>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button style={buttonStyle} onClick={handleUsernameChange}>Save</button>
            <button style={buttonStyle} onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <span>{username}</span>
            <button style={buttonStyle} onClick={() => setIsEditing(true)}>Edit</button>
          </>
        )}
      </div>
      <div>
        <label>Email: </label>
        <span>{email}</span>
      </div>
      <div>
        <label>Profile Image:</label>
        {profileImage ? (
          <img src={profileImage} alt="Profile" style={{ width: '100px', height: '100px' }} />
        ) : (
          <p>No profile image set</p>
        )}
        {isEditing ? (
          <>
            <input
              type="file"
              onChange={(e) =>
                setProfileImageFile(e.target.files ? e.target.files[0] : null)
              }
            />
            <button style={buttonStyle} onClick={handleProfileImageChange}>Update Profile Image</button>
          </>
        ) : (
          <button style={buttonStyle} onClick={() => setIsEditing(true)}>Change Profile Image</button>
        )}
      </div>
    </div>
  );
};

export default Profile;
