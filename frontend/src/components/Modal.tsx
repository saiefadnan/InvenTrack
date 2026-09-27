import { useEffect, useRef } from "react";
import type { ModalProps } from "../types";
import { useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import StepperInput from "./StepperInput";
import Pagination from "./Pagination";

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

                  return (
                    <>
                      <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                        {field.options?.map((option) => {
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
                            className={`group flex flex-col gap-1.5 p-2.5 rounded-lg border transition-all ${
                              isChecked
                                ? "bg-indigo-950/20 border-indigo-500/40 ring-1 ring-indigo-500/20"
                                : "bg-slate-950/40 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700/80"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <label className="flex items-center gap-3 cursor-pointer min-w-0 flex-1 select-none">
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
                                            (item) =>
                                              item[idKey] !== option.value,
                                          ) as any,
                                          { shouldValidate: true },
                                        );
                                  }}
                                  checked={isChecked}
                                  value={option.value}
                                  className="w-4 h-4 text-indigo-600 bg-slate-950 border-slate-700 rounded focus:ring-indigo-500 focus:ring-offset-0 focus:ring-offset-slate-900 cursor-pointer shrink-0"
                                />
                                <div className="flex flex-col gap-1 min-w-0 flex-1">
                                  <span
                                    className="font-medium text-slate-200 text-sm leading-snug truncate"
                                    title={option.labels?.[0]}
                                  >
                                    {option.labels?.[0]}
                                  </span>
                                  {option.labels && option.labels.length > 1 && (
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      {option.labels.slice(1).map((label: string) => (
                                        <span
                                          key={label}
                                          className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-400 border border-slate-700/60 font-normal whitespace-nowrap"
                                        >
                                          {label}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </label>

                              {/* Stepper pill */}
                              <StepperInput
                                value={varFieldValue}
                                min={1}
                                onChange={(newVal) => {
                                  if (!isChecked) {
                                    setValue(
                                      field.name as any,
                                      [
                                        ...currentItems,
                                        {
                                          [idKey]: option.value,
                                          [valKey]: newVal,
                                        },
                                      ] as any,
                                      { shouldValidate: true },
                                    );
                                  } else {
                                    setValue(
                                      field.name as any,
                                      currentItems.map((item) =>
                                        item[idKey] == option.value
                                          ? { ...item, [valKey]: newVal }
                                          : item,
                                      ) as any,
                                      { shouldValidate: true },
                                    );
                                  }
                                }}
                              />
                            </div>

                            {itemError && (
                              <span className="text-xs text-red-400 text-right pr-1">
                                {itemError}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                      {(field.hasNextOptions || field.hasPrevOptions) && (
                        <Pagination
                          count={field.options?.length ?? 0}
                          hasNext={!!field.hasNextOptions}
                          hasPrev={!!field.hasPrevOptions}
                          onNext={field.onNextOptions}
                          onPrev={field.onPrevOptions}
                        />
                      )}
                    </>
                  );
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
