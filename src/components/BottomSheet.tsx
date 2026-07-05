import type { ReactNode } from 'react';

interface Props {
  onClose: () => void;
  /** Cap height and scroll the body — for long sheets like category management. */
  scrollable?: boolean;
  children: ReactNode;
}

/** A modal sheet anchored to the bottom of the screen with a dimmed backdrop.
 *  Tapping the backdrop closes it; taps inside are ignored. */
export default function BottomSheet({ onClose, scrollable, children }: Props) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(45,36,56,0.45)',
        zIndex: 20,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 520,
          background: '#FFF6EC',
          borderRadius: '28px 28px 0 0',
          padding: '24px 22px calc(24px + env(safe-area-inset-bottom)) 22px',
          ...(scrollable ? { maxHeight: '80dvh', overflowY: 'auto' } : {}),
        }}
      >
        {children}
      </div>
    </div>
  );
}
