const codeStyle: React.CSSProperties = {
  background: 'var(--clay-wash)',
  padding: '2px 6px',
  borderRadius: 6,
};

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
      <div style={{ fontWeight: 700, fontSize: 22 }}>Almost there</div>
      <div
        style={{
          color: 'var(--text-muted)',
          fontWeight: 600,
          fontSize: 15,
          lineHeight: 1.5,
          marginTop: 10,
          maxWidth: 380,
        }}
      >
        Time Pop isn't connected to Firebase yet. Add your Firebase web config to the{' '}
        <code style={codeStyle}>.env</code> file (see <code style={codeStyle}>.env.example</code>)
        and restart the dev server.
      </div>
      <div
        style={{
          marginTop: 20,
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-lg)',
          padding: '16px 18px',
          textAlign: 'left',
          fontFamily: 'ui-monospace, monospace',
          fontSize: 12.5,
          color: 'var(--text-muted)',
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
