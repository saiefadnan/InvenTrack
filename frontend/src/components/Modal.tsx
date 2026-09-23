import { useEffect, useRef } from "react";
import type { ModalProps } from "../types";

const Modal = <T,>({ isOpen, title, onClose, onSubmit }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);
  return (
    <dialog
      ref={dialogRef}
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          onClose();
        }
      }}
      className="fixed inset-0 m-auto bg-slate-900 border border-slate-800 text-white rounded-xl p-6 max-w-md w-full shadow-2xl backdrop:bg-slate-950/80 backdrop:backdrop-blur-xs"
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
        <h3 className="text-lg font-semibold text-white">Add New Product</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors cursor-pointer text-lg leading-none"
        >
          ✕
        </button>
      </div>
    </dialog>
  );
};

export default Modal;
