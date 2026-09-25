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
    fields.forEach((field) => {
      if (field.type === "checkbox") {
        register(field.name);
      }
    });
  }, [fields, register]);

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
                (() => {
                  const idKey = field.checkBoxFields?.[0] ?? "productId";
                  const valKey = field.checkBoxFields?.[1] ?? "quantity";
                  const currentItems =
                    (watch(field.name as any) as any[]) || [];

                  return field.options?.map((option) => {
                    const selectedItem = currentItems?.length
                      ? currentItems?.find(
                          (item) => item[idKey] == option.value,
                        )
                      : null;
                    const isChecked = Boolean(selectedItem);
                    const varFieldValue = selectedItem
                      ? selectedItem[valKey]
                      : 1;

                    const itemIndex = currentItems.findIndex(
                      (item) => item[idKey] == option.value,
                    );
                    const itemError =
                      itemIndex !== -1
                        ? (errors[field.name] as any)?.[itemIndex]?.[valKey]
                            ?.message
                        : null;

                    return (
                      <div
                        key={option.value}
                        className="flex flex-col gap-1 py-1"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                e.target.checked
                                  ? setValue(
                                      field.name as any,
                                      [
                                        ...currentItems,
                                        {
                                          [idKey]: option.value,
                                          [valKey]: 1,
                                        },
                                      ] as any,
                                      { shouldValidate: true },
                                    )
                                  : setValue(
                                      field.name as any,
                                      currentItems?.filter(
                                        (item) => item[idKey] !== option.value,
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
                          </label>

                          {/* Stepper pill */}
                          <div className="inline-flex items-center bg-slate-950 border border-slate-700/80 rounded-xl px-1.5 py-0.5 shadow-inner">
                            <button
                              type="button"
                              onClick={() => {
                                const newVarFieldValue = Math.max(
                                  1,
                                  varFieldValue - 1,
                                );
                                if (isChecked) {
                                  setValue(
                                    field.name as any,
                                    currentItems.map((item) =>
                                      item[idKey] == option.value
                                        ? {
                                            ...item,
                                            [valKey]: newVarFieldValue,
                                          }
                                        : item,
                                    ) as any,
                                    { shouldValidate: true },
                                  );
                                } else {
                                  setValue(
                                    field.name as any,
                                    [
                                      ...currentItems,
                                      {
                                        [idKey]: option.value,
                                        [valKey]: 1,
                                      },
                                    ] as any,
                                    { shouldValidate: true },
                                  );
                                }
                              }}
                              className="px-2 py-0.5 text-slate-400 hover:text-white transition-colors cursor-pointer select-none text-base font-semibold leading-none"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={varFieldValue}
                              min={1}
                              className="w-8 text-center bg-transparent text-white font-bold text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              onChange={(e) => {
                                const val = Math.max(
                                  1,
                                  Number(e.target.value) || 1,
                                );
                                if (isChecked) {
                                  setValue(
                                    field.name as any,
                                    currentItems.map((item) =>
                                      item[idKey] == option.value
                                        ? { ...item, [valKey]: val }
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
                                const newVarFieldValue = varFieldValue + 1;
                                if (!isChecked) {
                                  setValue(
                                    field.name as any,
                                    [
                                      ...currentItems,
                                      {
                                        [idKey]: option.value,
                                        [valKey]: newVarFieldValue,
                                      },
                                    ] as any,
                                    { shouldValidate: true },
                                  );
                                } else {
                                  setValue(
                                    field.name as any,
                                    currentItems.map((item) =>
                                      item[idKey] == option.value
                                        ? {
                                            ...item,
                                            [valKey]: newVarFieldValue,
                                          }
                                        : item,
                                    ) as any,
                                    { shouldValidate: true },
                                  );
                                }
                              }}
                              className="px-2 py-0.5 text-slate-400 hover:text-white transition-colors cursor-pointer select-none text-base font-semibold leading-none"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {itemError && (
                          <span className="text-xs text-red-400 text-right pr-1">
                            {itemError}
                          </span>
                        )}
                      </div>
                    );
                  });
                })()
              ) : (
                <input
                  {...register(field.name, {
                    valueAsNumber: field.type === "number",
                  })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
              {(() => {
                const valKey = field.checkBoxFields?.[1] ?? "quantity";
                const rootMessage = errors[field.name]?.message;
                const nestedError = Array.isArray(errors[field.name])
                  ? (errors[field.name] as any[]).find(
                      (err) => err?.quantity?.message || err?.[valKey]?.message,
                    )?.quantity?.message
                  : null;
                const errorMessage = rootMessage || nestedError;
                return errorMessage ? (
                  <span className="text-xs text-red-400">
                    {String(errorMessage)}
                  </span>
                ) : null;
              })()}
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
