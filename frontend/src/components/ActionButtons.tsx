interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  editLabel?: string;
  deleteLabel?: string;
  className?: string;
}

const ActionButtons = ({
  onEdit,
  onDelete,
  isDeleting = false,
  editLabel = "Edit",
  deleteLabel = "Delete",
  className = "inline-flex items-center gap-6",
}: ActionButtonsProps) => {
  return (
    <div className={className}>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="text-indigo-400 hover:text-indigo-300 text-xs font-medium cursor-pointer transition-colors"
        >
          {editLabel}
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="text-rose-400 hover:text-rose-300 text-xs font-medium cursor-pointer disabled:opacity-50 transition-colors"
        >
          {isDeleting ? "Deleting..." : deleteLabel}
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
