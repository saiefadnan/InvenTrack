import { useEffect, useRef } from "react";
import type { ModalProps } from "../types";
import { useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const Modal = <T extends FieldValues>({ isOpen, title, fields,onClose, onSubmit, validationSchema}: ModalProps<T>) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const {register, handleSubmit, formState: {errors}} = useForm<T>({
    resolver: zodResolver(validationSchema),
  });
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
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors cursor-pointer text-lg leading-none"
        >
          ✕
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {fields.map((field)=>{
          return (
            <label key={String(field.name)} className="flex flex-col gap-2 text-sm text-slate-400"> {field.label} 
              
              {field.type === "select" ? (
                <select {...register(field.name)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select an option</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input {...register(field.name, {valueAsNumber: field.type === "number"})} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
              )}
              {errors[field.name] && <span className="text-xs text-red-400">{String(errors[field.name]?.message)}</span>}
            </label>
          );
        })}
        <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          Cancel
        </button>
        <button type="submit" value="Submit" className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer">
          Submit
        </button>
        </div>
      </form>
    </dialog>
  );
};

export default Modal;
