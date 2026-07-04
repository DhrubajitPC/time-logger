import { useState } from 'react';
import { useAuth } from '../lib/auth';

const GoogleG = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

export default function SignIn() {
  const { signInWithGoogle } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (e) {
      const code = (e as { code?: string })?.code ?? '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        // User dismissed the popup — not an error worth showing.
      } else {
        setError('Could not sign in. Please try again.');
        console.error(e);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        maxWidth: 520,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'calc(24px + env(safe-area-inset-top)) 28px calc(24px + env(safe-area-inset-bottom))',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 26,
          background: '#FF6B57',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 14px 30px rgba(255,107,87,0.35)',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: '#fff',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 3,
              height: 12,
              background: '#FF6B57',
              borderRadius: 2,
              transform: 'translate(-50%, -100%)',
              transformOrigin: 'bottom',
            }}
          />
        </div>
      </div>

      <div
        style={{
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 700,
          fontSize: 34,
          marginTop: 22,
          letterSpacing: '-0.5px',
        }}
      >
        Time Pop
      </div>
      <div style={{ color: '#B09A85', fontWeight: 700, fontSize: 16, marginTop: 6, maxWidth: 320 }}>
        Where's your time going? Track it, see it, own it — synced across all your devices.
      </div>

      <button
        onClick={handleSignIn}
        disabled={busy}
        style={{
          marginTop: 34,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          width: '100%',
          maxWidth: 320,
          background: '#fff',
          border: '2px solid #F3EADF',
          borderRadius: 999,
          padding: '15px 0',
          fontWeight: 800,
          fontSize: 16,
          color: '#2D2438',
          cursor: busy ? 'default' : 'pointer',
          opacity: busy ? 0.6 : 1,
          boxShadow: '0 8px 18px rgba(45,36,56,0.08)',
        }}
      >
        {busy ? (
          <span
            style={{
              width: 18,
              height: 18,
              border: '3px solid #E8D3BC',
              borderTopColor: '#FF6B57',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
        ) : (
          <GoogleG />
        )}
        {busy ? 'Signing in…' : 'Continue with Google'}
      </button>

      {error && (
        <div style={{ color: '#E14B4B', fontWeight: 700, fontSize: 14, marginTop: 16 }}>{error}</div>
      )}

      <div style={{ color: '#C7B7A5', fontWeight: 600, fontSize: 12, marginTop: 28, maxWidth: 300 }}>
        Your data is private to your account and never shared.
      </div>
    </div>
  );
}
