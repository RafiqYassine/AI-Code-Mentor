import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { AnalyzePage } from './pages/AnalyzePage';
import { HistoryPage } from './pages/HistoryPage';
import { UserProfile } from './types';
import { auth, loginWithGoogle, logout } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [page, setPage] = useState<'analyze' | 'history'>('analyze');
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoadingAuth(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Check console for details (likely missing Firebase config).");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setPage('analyze');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-neutral-900 rounded-lg mb-4"></div>
          <p className="text-neutral-500 text-sm">Loading Mentor...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      user={user} 
      onLogin={handleLogin} 
      onLogout={handleLogout}
      currentPage={page}
      onNavigate={setPage}
    >
      {page === 'analyze' ? (
        <AnalyzePage user={user} onLoginRequest={handleLogin} />
      ) : (
        <HistoryPage user={user} />
      )}
    </Layout>
  );
};

export default App;
