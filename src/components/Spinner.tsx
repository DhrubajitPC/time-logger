export default function Spinner() {
  return (
    <span
      style={{
        width: 28,
        height: 28,
        border: '4px solid #F3EADF',
        borderTopColor: '#FF6B57',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        display: 'inline-block',
      }}
    />
  );
}
