import React, { useEffect, useRef } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      ref={dialogRef}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative outline-none"
        tabIndex={0}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-700 text-2xl"
        >
          &times;
        </button>
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
