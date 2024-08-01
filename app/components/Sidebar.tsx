import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBookOpen, faCheckDouble, faSearch, faArrowRightFromBracket, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { collection, query, where, getDocs, doc, getDoc, orderBy } from 'firebase/firestore';
import { db, getAuth } from '../firebaseConfig';
import { UserContext, UserContextType } from '../pages/_app';
import LogoutModal from './LogoutModal';

interface SidebarProps {
  onSearchResult: (result: { id: string; title: string; description: string; status: number; author: string; url: string; coverImage: string; createdAt: any }[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSearchResult }) => {
  const navigation = [
    { name: 'Unread', icon: faBook },
    { name: 'Reading', icon: faBookOpen },
    { name: 'Read', icon: faCheckDouble },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const user = useContext(UserContext) as UserContextType | null;
  const [profileImageURL, setProfileImageURL] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfileImage = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfileImageURL(userData?.profileImage || null);
        }
      }
    };

    fetchUserProfileImage();
  }, [user]);

  const handleSearch = async () => {
    if (searchTerm.trim() === '') return; // 空の検索は無視
    const q = query(
      collection(db, 'tasks'),
      where('title', '>=', searchTerm),
      where('title', '<=', searchTerm + '\uf8ff'),
      orderBy('createdAt', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
      description: doc.data().description,
      status: doc.data().status,
      author: doc.data().author,
      url: doc.data().url,
      coverImage: doc.data().coverImage,
      createdAt: doc.data().createdAt
    }));
    onSearchResult(results);
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut().then(() => {
      router.push('/login');
    });
  };

  return (
    <aside className="sidebar flex flex-col w-60 h-screen bg-white text-grey-800 shadow-2xl fixed left-0 top-0 bottom-0 z-10">
      <div className="px-4 py-6 flex-grow">
        <Link href="/">
          <div className="text-xl font-semibold text-gray-800 text-center cursor-pointer">Book List</div>
        </Link>
        <div className="flex flex-col items-center mt-6" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
          {profileImageURL ? (
            <img
              className="h-16 w-16 rounded-full object-cover"
              src={profileImageURL}
              alt="User profile"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
              <FontAwesomeIcon icon={faUserCircle} className="text-7xl" />
            </div>
          )}
          <div className="text-center mt-4 mb-4">
            <p className="text-sm font-semibold text-gray-800">{user?.username || 'No Name'}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
        <div className="relative w-full mb-6 text-center">
          <input
            type="search"
            className="w-full pl-3 pr-10 py-2 bg-white text-gray-800 rounded-md focus:outline-none focus:ring focus:border-blue-300 border border-gray-300"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={handleSearch}>
            <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-gray-500" />
          </div>
        </div>
        <div className="w-full text-center mb-6">
          <button
            onClick={handleSearch}
            className="mt-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-black font-medium border border-gray-300 rounded-md shadow-sm transition duration-300"
            style={{ width: 'auto' }}
          >
            Search
          </button>
        </div>
        <nav className="flex flex-col mt-2">
          {navigation.map((item) => (
            <Link href={item.name === 'Unread' ? '/unread' : item.name === 'Reading' ? '/reading' : '/read'} key={item.name}>
              <div className={`flex items-center px-4 py-2 mt-2 text-sm font-semibold rounded-lg ${
                item.name === 'Dashboard' ? 'bg-gray-700 text-white' : 'hover:bg-gray-100'
              }`}>
                <FontAwesomeIcon icon={item.icon} className="text-3xl mr-3" />
                {item.name}
              </div>
            </Link>
          ))}
        </nav>
        <div className="px-4 py-6">
          <button
            className="w-full flex items-center justify-center px-4 py-2 mt-2 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600"
            onClick={() => setIsLogoutModalOpen(true)}
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-3xl mr-3" />
            Log out
          </button>
        </div>
      </div>
      <footer className="w-full bg-gray-800 text-gray-100 p-4 text-sm text-center fixed bottom-0 left-0">
        © 2024 Book List App by Ryo Oshiro.
      </footer>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onLogout={handleLogout}
      />
    </aside>
  );
};

export default Sidebar;
