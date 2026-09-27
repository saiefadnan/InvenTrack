interface StepperInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  className?: string;
}

const StepperInput = ({
  value,
  onChange,
  min = 1,
  className = "",
}: StepperInputProps) => {
  return (
    <div
      className={`shrink-0 inline-flex items-center bg-slate-950 border border-slate-800/90 rounded-lg p-0.5 shadow-inner ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 rounded transition-colors cursor-pointer select-none text-sm font-semibold leading-none"
      >
        −
      </button>
      <input
        type="number"
        value={value}
        min={min}
        className="w-7 text-center bg-transparent text-white font-medium text-xs outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        onChange={(e) => {
          const val = Math.max(min, Number(e.target.value) || min);
          onChange(val);
        }}
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 rounded transition-colors cursor-pointer select-none text-sm font-semibold leading-none"
      >
        +
      </button>
    </div>
  );
};

export default StepperInput;
