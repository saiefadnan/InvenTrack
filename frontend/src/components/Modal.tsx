import { useEffect, useRef } from "react";
import type { ModalProps } from "../types";
import { useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const Modal = <T extends FieldValues>({
  isOpen,
  title,
  fields,
  onClose,
  onSubmit,
  validationSchema,
}: ModalProps<T>) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const defaultValues = fields.reduce<Record<string, any>>((acc, field) => {
    if (field.type === "checkbox") {
      acc[field.name] = [];
    }
    return acc;
  }, {});
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValues as any,
  });
  useEffect(() => {
    if (!dialogRef.current) return;
    if (isOpen) {
      reset();
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
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
        {fields.map((field) => {
          return (
            <div
              key={String(field.name)}
              className="flex flex-col gap-2 text-sm text-slate-400"
            >
              {" "}
              {field.label}
              {field.type === "select" ? (
                <select
                  {...register(field.name)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select an option</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "checkbox" ? (
                field.options?.map((option) => {
                  const currentItems = watch(field.name as any as any[]) || [];
                  const selectedItem = currentItems?.length
                    ? currentItems?.find(
                        (item) => item.productId == option.value,
                      )
                    : null;
                  const isChecked = Boolean(selectedItem);
                  const quantity = selectedItem ? selectedItem.quantity : 0;
                  return (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          e.target.checked
                            ? setValue(
                                field.name as any,
                                [
                                  ...currentItems,
                                  { productId: option.value, quantity: 0 },
                                ] as any,
                                { shouldValidate: true },
                              )
                            : setValue(
                                field.name as any,
                                currentItems?.filter(
                                  (item) => item.productId !== option.value,
                                ) as any,
                                { shouldValidate: true },
                              );
                        }}
                        checked={isChecked}
                        value={option.value}
                        className="w-4 h-4 text-indigo-600 bg-slate-950 border border-slate-700 rounded focus:ring-indigo-500"
                      />
                      {option.labels.map((label: string) => (
                        <span key={label}>{label}</span>
                      ))}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            const newQty = quantity + 1;
                            if (!isChecked) {
                              setValue(
                                field.name as any,
                                [
                                  ...currentItems,
                                  {
                                    productId: option.value,
                                    quantity: newQty,
                                  },
                                ] as any,
                                { shouldValidate: true },
                              );
                            } else {
                              setValue(
                                field.name as any,
                                currentItems.map((item) =>
                                  item.productId == option.value
                                    ? {
                                        ...item,
                                        quantity: newQty,
                                      }
                                    : item,
                                ) as any,
                                { shouldValidate: true },
                              );
                            }
                          }}
                        >
                          {" "}
                          +
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          min={0}
                          className="w-12 text-center bg-slate-900 border border-slate-700 rounded"
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (isChecked) {
                              setValue(
                                field.name as any,
                                currentItems.map((item) =>
                                  item.productId == option.value
                                    ? { ...item, quantity: val }
                                    : item,
                                ) as any,
                                { shouldValidate: true },
                              );
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newQty = Math.max(0, quantity - 1);
                            if (isChecked) {
                              setValue(
                                field.name as any,
                                currentItems.map((item) =>
                                  item.productId == option.value
                                    ? { ...item, quantity: newQty }
                                    : item,
                                ) as any,
                                { shouldValidate: true },
                              );
                            } else {
                              setValue(
                                field.name as any,
                                [
                                  ...currentItems,
                                  { productId: option.value, quantity: newQty },
                                ] as any,
                                { shouldValidate: true },
                              );
                            }
                          }}
                        >
                          {" "}
                          -
                        </button>
                      </div>
                    </label>
                  );
                })
              ) : (
                <input
                  type={field.type}
                  {...register(field.name, {
                    valueAsNumber: field.type === "number",
                  })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
              {errors[field.name]?.message && (
                <span className="text-xs text-red-400">
                  {String(errors[field.name]?.message)}
                </span>
              )}
            </div>
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
          <button
            type="submit"
            value="Submit"
            className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Submit
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default Modal;
