import { AuthProvider, useAuth } from './lib/auth';
import { isFirebaseConfigured } from './lib/firebase';
import SignIn from './components/SignIn';
import Tracker from './components/Tracker';
import NotConfigured from './components/NotConfigured';
import Spinner from './components/Spinner';

function Gate() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spinner />
      </div>
    );
  }

  if (!user) return <SignIn />;
  return <Tracker user={user} onSignOut={signOut} />;
}

export default function App() {
  if (!isFirebaseConfigured) return <NotConfigured />;
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
