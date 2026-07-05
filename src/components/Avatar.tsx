import type { User } from 'firebase/auth';

interface Props {
  user: User;
  size: number;
}

/** The user's Google photo, or a colored circle with their initial as fallback. */
export default function Avatar({ user, size }: Props) {
  if (user.photoURL) {
    return (
      <img
        src={user.photoURL}
        alt=""
        referrerPolicy="no-referrer"
        style={{ width: size, height: size, borderRadius: '50%' }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#FF6B57',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: Math.round(size * 0.42),
      }}
    >
      {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
    </div>
  );
}
