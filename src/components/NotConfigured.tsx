export default function NotConfigured() {
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
        padding: '32px 28px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 26 }}>
        Almost there
      </div>
      <div style={{ color: '#B09A85', fontWeight: 700, fontSize: 15, marginTop: 10, maxWidth: 380 }}>
        Time Pop isn't connected to Firebase yet. Add your Firebase web config to the{' '}
        <code style={{ background: '#FBEBD9', padding: '2px 6px', borderRadius: 6 }}>.env</code> file
        (see <code style={{ background: '#FBEBD9', padding: '2px 6px', borderRadius: 6 }}>.env.example</code>)
        and restart the dev server.
      </div>
      <div
        style={{
          marginTop: 20,
          background: '#fff',
          border: '2px solid #F3EADF',
          borderRadius: 16,
          padding: '16px 18px',
          textAlign: 'left',
          fontFamily: 'ui-monospace, monospace',
          fontSize: 12.5,
          color: '#6b5d50',
          maxWidth: 380,
          width: '100%',
          lineHeight: 1.7,
        }}
      >
        VITE_FIREBASE_API_KEY=…
        <br />
        VITE_FIREBASE_AUTH_DOMAIN=…
        <br />
        VITE_FIREBASE_PROJECT_ID=…
        <br />
        VITE_FIREBASE_STORAGE_BUCKET=…
        <br />
        VITE_FIREBASE_MESSAGING_SENDER_ID=…
        <br />
        VITE_FIREBASE_APP_ID=…
      </div>
    </div>
  );
}
