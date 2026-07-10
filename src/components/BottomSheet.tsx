import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
  onClose: () => void;
  /** Accessible name for the dialog. */
  label: string;
  /** Cap height and scroll the body — for long sheets like category management. */
  scrollable?: boolean;
  children: ReactNode;
}

/** A modal sheet anchored to the bottom of the screen with a dimmed backdrop.
 *  Tapping the backdrop or pressing Escape closes it; taps inside are ignored. */
export default function BottomSheet({ onClose, label, scrollable, children }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Callers recreate onClose every render (the app re-renders each clock
  // tick), so the mount effect reads it through a ref instead of depending
  // on it — otherwise the sheet would re-focus itself every second.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    sheetRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus();
    };
  }, []);

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className="sheet"
        onClick={(e) => e.stopPropagation()}
        style={scrollable ? { maxHeight: '80dvh', overflowY: 'auto' } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
